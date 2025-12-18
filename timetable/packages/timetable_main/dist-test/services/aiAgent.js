import { supabase } from '../lib/supabaseClient.js';
import { generateGeminiResponse } from '../lib/gemini.js';
export class TimetableAIAgent {
    constructor() {
        this.supabase = supabase;
        // Lightweight in-memory store for recent contexts and actions
        this.shortTermMemory = [];
        this.memoryLimit = 50;
        // Rate limiting for Gemini API calls
        this.lastApiCall = 0;
        this.apiCallDelay = 0; // No rate limiting for this API key
        // Intent types we support
        // - schedule/add class, cancel/remove class, reschedule, substitute, slot availability, constraints change, distribution checks
        this.intentKeywords = {
            SCHEDULE: [/\b(schedule|add|book|assign)\b/i],
            CANCEL: [/\b(cancel|remove|delete|drop)\b/i],
            RESCHEDULE: [/\b(reschedule|move|shift|change time|postpone|prepone)\b/i],
            SUBSTITUTE: [/\b(substitute|replacement|cover|proxy)\b/i],
            AVAILABILITY: [/\b(free slot|availability|free period|open slot|vacant)\b/i],
            CONSTRAINTS: [/\b(constraint|rule|hard constraint|soft constraint|limit)\b/i, /\b(add|remove|change|update)\b/i],
            DISTRIBUTION: [/\b(distribution|load balance|workload|spread|fairness)\b/i],
            SWAP_CLASS: [/\b(swap|exchange)\b/i],
            SIMULATE_SCENARIO: [/\b(simulate|what if|impact)\b/i],
            ADD_CONSTRAINT: [/\b(add)\b/i, /\b(constraint|rule)\b/i],
            UPDATE_CONSTRAINT: [/\b(update|modify|change)\b/i, /\b(constraint|rule)\b/i],
            REMOVE_CONSTRAINT: [/\b(remove|delete|drop)\b/i, /\b(constraint|rule)\b/i],
            INSERT_BATCH_EVENT: [/\b(insert|add)\b/i, /\b(batch|exam|holiday|seminar|event)\b/i],
            ACCOMMODATE_URGENT_EVENT: [/\b(urgent|emergency|last minute)\b/i, /\b(event|class|meeting)\b/i]
        };
    }
    // ===== Intent, Memory and Verification Helpers =====
    detectIntent(userInput) {
        const text = userInput || '';
        const intents = Object.keys(this.intentKeywords);
        for (const intent of intents) {
            const regs = this.intentKeywords[intent];
            if (regs.every((re) => re.test(text)))
                return intent;
            if (regs.some((re) => re.test(text)))
                return intent;
        }
        if (/\b(check|find|show)\b.*\b(slot|availability|free)\b/i.test(text))
            return 'AVAILABILITY';
        return 'SCHEDULE';
    }
    // Rate limiting helper
    async rateLimit() {
        const now = Date.now();
        const timeSinceLastCall = now - this.lastApiCall;
        if (timeSinceLastCall < this.apiCallDelay) {
            const delay = this.apiCallDelay - timeSinceLastCall;
            console.log(`⏳ Rate limiting: waiting ${delay}ms before next API call`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        this.lastApiCall = Date.now();
    }
    // LLM-based intent classifier using Gemini via generateGeminiResponse
    async detectIntentLLM(userInput, entities, memory) {
        const allowed = ['SCHEDULE', 'CANCEL', 'RESCHEDULE', 'SUBSTITUTE', 'AVAILABILITY', 'CONSTRAINTS', 'DISTRIBUTION', 'SWAP_CLASS', 'ACCOMMODATE_URGENT_EVENT', 'INSERT_BATCH_EVENT'];
        const prompt = `You are an intent classifier for a timetable management system. Analyze the user's request and classify it as ONE of these intents:

SCHEDULE - User wants to add/schedule a new class or event
CANCEL - User wants to cancel/remove an existing class
RESCHEDULE - User wants to move an existing class to a different time/day/room
SUBSTITUTE - User wants to assign a substitute teacher to an existing class
AVAILABILITY - User wants to find free slots or check availability
CONSTRAINTS - User wants to add/update/remove scheduling constraints
DISTRIBUTION - User wants to check workload distribution or statistics
SWAP_CLASS - User wants to swap/exchange two existing classes
ACCOMMODATE_URGENT_EVENT - User wants to schedule an urgent event with flexible timing
INSERT_BATCH_EVENT - User wants to schedule multiple classes at once

Examples:
- "Schedule a new class" → SCHEDULE
- "Cancel the math class" → CANCEL  
- "Move the class to Tuesday" → RESCHEDULE
- "Assign substitute teacher" → SUBSTITUTE
- "Find available slots" → AVAILABILITY
- "Add constraint" → CONSTRAINTS
- "Check teacher workload" → DISTRIBUTION
- "Swap the classes" → SWAP_CLASS
- "Accommodate urgent event" → ACCOMMODATE_URGENT_EVENT
- "Schedule multiple classes" → INSERT_BATCH_EVENT

User Input: "${userInput}"

Return ONLY valid JSON: { "intent": "EXACT_INTENT_NAME" }`;
        try {
            await this.rateLimit();
            const raw = await generateGeminiResponse(prompt);
            if (!raw)
                throw new Error('Empty LLM response');
            const cleaned = this.cleanJsonResponse(raw);
            const parsed = JSON.parse(cleaned);
            const intent = parsed?.intent;
            if (allowed.includes(intent))
                return intent;
            return this.detectIntent(userInput);
        }
        catch {
            return this.detectIntent(userInput);
        }
    }
    remember(userInput, entities, intent) {
        this.shortTermMemory.push({ timestamp: Date.now(), userInput, entities, intent });
        if (this.shortTermMemory.length > this.memoryLimit)
            this.shortTermMemory.shift();
    }
    async verifyAction(action) {
        if (!action || !action.type)
            return { ok: true };
        try {
            if (action.type === 'SCHEDULE') {
                const p = action.parameters || {};
                const conflict = await this.hasConflict({
                    day: p.day,
                    period: p.period,
                    className: p.class,
                    teacher: p.teacher,
                    room: p.room
                });
                if (conflict)
                    return { ok: false, reason: 'Scheduling conflict for class/teacher/room at the selected time' };
            }
            if (action.type === 'RESCHEDULE') {
                const p = action.parameters || {};
                const conflict = await this.hasConflict({
                    day: p.newDay,
                    period: p.newPeriod,
                    className: p.class,
                    teacher: p.teacher,
                    room: p.newRoom || p.room
                }, p.id);
                if (conflict)
                    return { ok: false, reason: 'Reschedule would create a conflict' };
            }
            if (action.type === 'SUBSTITUTE') {
                const p = action.parameters || {};
                const busy = await this.isTeacherBusy(p.substituteTeacher, p.day, p.period);
                if (busy)
                    return { ok: false, reason: 'Substitute teacher is busy at that time' };
            }
            return { ok: true };
        }
        catch (_e) {
            return { ok: false, reason: 'Verification error' };
        }
    }
    async hasConflict(opts, excludeId) {
        const query = this.supabase
            .from('timetable_classes')
            .select('id, students, instructor_name, room')
            .eq('day', opts.day)
            .eq('period', opts.period);
        const { data, error } = await query;
        if (error)
            return true;
        const rows = (data || []).filter((r) => (excludeId ? r.id !== excludeId : true));
        return rows.some((r) => (opts.className && r.students === opts.className) ||
            (opts.teacher && r.instructor_name === opts.teacher) ||
            (opts.room && r.room === opts.room));
    }
    async isTeacherBusy(teacher, day, period) {
        const { data, error } = await this.supabase
            .from('timetable_classes')
            .select('id')
            .eq('instructor_name', teacher)
            .eq('day', day)
            .eq('period', period)
            .limit(1);
        if (error)
            return true;
        return (data || []).length > 0;
    }
    async findFreeSlots(scope, day) {
        const allPeriods = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9'];
        const { data, error } = await this.supabase
            .from('timetable_classes')
            .select('period, students, instructor_name, room')
            .eq('day', day);
        if (error)
            return [];
        const busy = new Set((data || [])
            .filter((r) => (scope.className && r.students === scope.className) ||
            (scope.teacher && r.instructor_name === scope.teacher) ||
            (scope.room && r.room === scope.room))
            .map((r) => r.period));
        return allPeriods.filter(p => !busy.has(p));
    }
    // Heuristic: find an available teacher who teaches the subject and is free at the slot
    async findAvailableTeacherForSubject(subject, className, day, period) {
        try {
            // Find teachers who already teach this subject anywhere
            const { data: candidates, error } = await this.supabase
                .from('timetable_classes')
                .select('instructor_name')
                .ilike('course', subject)
                .not('instructor_name', 'is', null);
            if (error)
                return undefined;
            const unique = Array.from(new Set((candidates || []).map(r => r.instructor_name).filter(Boolean)));
            // Pick the first teacher who isn't busy at the requested time
            for (const t of unique) {
                const busy = await this.isTeacherBusy(t, day, period);
                if (!busy)
                    return t;
            }
            return undefined;
        }
        catch {
            return undefined;
        }
    }
    // ===== Persistent memory (Supabase) =====
    async saveMemoryRecord(record) {
        try {
            const { error } = await this.supabase
                .from('ai_agent_memory')
                .insert({
                user_input: record.user_input,
                intent: record.intent,
                entities: record.entities,
                metadata: record.metadata || null
            });
            if (error)
                throw error;
        }
        catch (error) {
            console.error('Error saving memory record:', error);
        }
    }
    async getRecentMemory(limit = 20) {
        try {
            const { data, error } = await this.supabase
                .from('ai_agent_memory')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);
            if (error)
                throw error;
            return data || [];
        }
        catch (error) {
            console.warn('Memory fetch skipped:', error?.message || error);
            return [];
        }
    }
    // Helper method to clean JSON responses from markdown code blocks
    cleanJsonResponse(response) {
        // Remove markdown code blocks
        let cleaned = response.replace(/```json\s*/g, '').replace(/```\s*/g, '');
        // Remove any leading/trailing whitespace
        cleaned = cleaned.trim();
        // If the response doesn't start with { or [, try to find the JSON part
        if (!cleaned.startsWith('{') && !cleaned.startsWith('[')) {
            const jsonMatch = cleaned.match(/(\{.*\}|\[.*\])/s);
            if (jsonMatch) {
                cleaned = jsonMatch[1];
            }
        }
        return cleaned;
    }
    // Format context data for AI prompts with enhanced debugging and multiple mention support
    formatContextForPrompt(context) {
        let contextText = "";
        console.log('🔧 Formatting context for AI prompt...');
        console.log('📊 Context entities:', context.entities?.length || 0);
        if (!context.entities || context.entities.length === 0) {
            contextText += "**NO TIMETABLE ENTITIES MENTIONED**\n";
            contextText += "The user has not mentioned any specific timetable entities using @mentions.\n";
            contextText += "Please ask them to specify which class, teacher, room, or period they want to work with.\n";
            contextText += "Example: 'Show me the schedule for @COMPUTER_SCIENCE_ENGINEERING_SEC-1__SEC-1'\n\n";
            return contextText;
        }
        contextText += "**TIMETABLE CONTEXT FROM @MENTIONS:**\n";
        contextText += `The user has mentioned ${context.entities.length} entity/entities. Use this data to answer their request:\n\n`;
        // Group entities by type for better organization
        const entitiesByType = context.entities.reduce((acc, entity) => {
            if (!acc[entity.type])
                acc[entity.type] = [];
            acc[entity.type].push(entity);
            return acc;
        }, {});
        console.log('📋 Entities by type:', Object.keys(entitiesByType));
        // Process each entity type separately for better context separation
        Object.entries(entitiesByType).forEach(([type, entities]) => {
            contextText += `\n=== ${type.toUpperCase()} ENTITIES ===\n`;
            entities.forEach((entity, index) => {
                contextText += `\n**${type.toUpperCase()} ${index + 1}: ${entity.label}**\n`;
                if (entity.context) {
                    const ctx = entity.context;
                    console.log(`🔍 Context for ${entity.label}:`, {
                        totalClasses: ctx.totalClasses,
                        hasSchedule: !!ctx.schedule,
                        scheduleLength: ctx.schedule?.length || 0
                    });
                    if (entity.type === 'class') {
                        contextText += `- Total Classes: ${ctx.totalClasses}\n`;
                        if (ctx.subjects && ctx.subjects.length > 0) {
                            contextText += `- Subjects: ${ctx.subjects.join(', ')}\n`;
                        }
                        if (ctx.teachers && ctx.teachers.length > 0) {
                            contextText += `- Teachers: ${ctx.teachers.join(', ')}\n`;
                        }
                        if (ctx.rooms && ctx.rooms.length > 0) {
                            contextText += `- Rooms: ${ctx.rooms.join(', ')}\n`;
                        }
                        if (ctx.days && ctx.days.length > 0) {
                            contextText += `- Days: ${ctx.days.join(', ')}\n`;
                        }
                        if (ctx.periods && ctx.periods.length > 0) {
                            contextText += `- Periods: ${ctx.periods.join(', ')}\n`;
                        }
                        if (ctx.scheduleByDay) {
                            contextText += `\n**Schedule by Day for ${entity.label}:**\n`;
                            Object.entries(ctx.scheduleByDay).forEach(([day, classes]) => {
                                if (classes && classes.length > 0) {
                                    contextText += `- ${day}: ${classes.map((c) => `${c.period} - ${c.course} (${c.instructor})`).join(', ')}\n`;
                                }
                            });
                        }
                        // Add complete schedule data for comprehensive analysis
                        if (ctx.schedule && ctx.schedule.length > 0) {
                            contextText += `\n**Complete Schedule Data for ${entity.label}:**\n`;
                            ctx.schedule.forEach((cls, idx) => {
                                contextText += `${idx + 1}. ${cls.day} ${cls.period}: ${cls.course} - ${cls.instructor_name} (${cls.room || 'No room'}) [ID: ${cls.id}]\n`;
                            });
                        }
                    }
                    else if (entity.type === 'teacher') {
                        contextText += `- Total Classes: ${ctx.totalClasses}\n`;
                        if (ctx.classes && ctx.classes.length > 0) {
                            contextText += `- Classes: ${ctx.classes.join(', ')}\n`;
                        }
                        if (ctx.subjects && ctx.subjects.length > 0) {
                            contextText += `- Subjects: ${ctx.subjects.join(', ')}\n`;
                        }
                        if (ctx.rooms && ctx.rooms.length > 0) {
                            contextText += `- Rooms: ${ctx.rooms.join(', ')}\n`;
                        }
                        if (ctx.days && ctx.days.length > 0) {
                            contextText += `- Teaching Days: ${ctx.days.join(', ')}\n`;
                        }
                        if (ctx.periods && ctx.periods.length > 0) {
                            contextText += `- Teaching Periods: ${ctx.periods.join(', ')}\n`;
                        }
                        // Add teacher-specific context if available
                        if (ctx.teacherContext) {
                            const tc = ctx.teacherContext;
                            contextText += `\n**Teacher Profile for ${entity.label}:**\n`;
                            contextText += `- Workload: ${tc.workload} classes\n`;
                            contextText += `- Teaching Days: ${tc.teachingDays.join(', ')}\n`;
                            contextText += `- Teaching Periods: ${tc.teachingPeriods.join(', ')}\n`;
                            contextText += `- Subjects Taught: ${tc.subjectsTaught.join(', ')}\n`;
                            contextText += `- Classes Taught: ${tc.classesTaught.join(', ')}\n`;
                            contextText += `- Rooms Used: ${tc.roomsUsed.join(', ')}\n`;
                        }
                        // Add teacher's schedule by day
                        if (ctx.scheduleByDay) {
                            contextText += `\n**Schedule by Day for ${entity.label}:**\n`;
                            Object.entries(ctx.scheduleByDay).forEach(([day, classes]) => {
                                if (classes && classes.length > 0) {
                                    contextText += `- ${day}: ${classes.map((c) => `${c.period} - ${c.course} (${c.students})`).join(', ')}\n`;
                                }
                            });
                        }
                        // Add teacher's complete schedule
                        if (ctx.schedule && ctx.schedule.length > 0) {
                            contextText += `\n**Complete Schedule for ${entity.label}:**\n`;
                            ctx.schedule.forEach((cls, idx) => {
                                contextText += `${idx + 1}. ${cls.day} ${cls.period}: ${cls.students} - ${cls.course} (${cls.room || 'No room'})\n`;
                            });
                        }
                    }
                    else if (entity.type === 'room') {
                        contextText += `- Total Classes: ${ctx.totalClasses}\n`;
                        if (ctx.classes && ctx.classes.length > 0) {
                            contextText += `- Classes: ${ctx.classes.join(', ')}\n`;
                        }
                        if (ctx.subjects && ctx.subjects.length > 0) {
                            contextText += `- Subjects: ${ctx.subjects.join(', ')}\n`;
                        }
                        if (ctx.teachers && ctx.teachers.length > 0) {
                            contextText += `- Teachers: ${ctx.teachers.join(', ')}\n`;
                        }
                        // Add room's schedule
                        if (ctx.schedule && ctx.schedule.length > 0) {
                            contextText += `\n**Schedule for ${entity.label}:**\n`;
                            ctx.schedule.forEach((cls, idx) => {
                                contextText += `${idx + 1}. ${cls.day} ${cls.period}: ${cls.students} - ${cls.course} with ${cls.instructor_name}\n`;
                            });
                        }
                    }
                    else if (entity.type === 'period') {
                        contextText += `- Period: ${entity.label}\n`;
                    }
                    else if (entity.type === 'slot' && ctx.note) {
                        contextText += `- Note: ${ctx.note}\n`;
                    }
                }
                else {
                    contextText += `- No additional context available\n`;
                }
            });
        });
        contextText += `\n\n=== TIME SLOT MAPPINGS ===\n`;
        contextText += `**IMPORTANT:** Always use actual time slots instead of period codes in your responses:\n`;
        contextText += `- P1 = 8:00-9:00 AM\n`;
        contextText += `- P2 = 9:00-10:00 AM\n`;
        contextText += `- P3 = 10:00-11:00 AM\n`;
        contextText += `- P4 = 11:00-12:00 PM\n`;
        contextText += `- P5 = 12:00-1:00 PM\n`;
        contextText += `- P6 = 1:00-2:00 PM\n`;
        contextText += `- P7 = 2:00-3:00 PM\n`;
        contextText += `- P8 = 3:00-4:00 PM\n`;
        contextText += `- P9 = 4:00-5:00 PM\n\n`;
        contextText += `=== AI INSTRUCTIONS ===\n`;
        contextText += `**CRITICAL:** You have access to the complete timetable data above. Use this data to:\n`;
        contextText += `1. Answer the user's question with specific information from the timetable data\n`;
        contextText += `2. Perform calculations (free slots, conflicts, schedule analysis) from this data\n`;
        contextText += `3. Provide actionable information based on the actual timetable data\n`;
        contextText += `4. Use exact names from the data (class names, teacher names, periods, rooms)\n`;
        contextText += `5. If multiple entities are mentioned, analyze relationships between them\n`;
        contextText += `6. **ALWAYS convert period codes (P1, P2, etc.) to actual time slots (8:00-9:00 AM, etc.) in your responses**\n`;
        contextText += `7. You may ask for additional information if required or else use the provided data\n\n`;
        console.log('✅ Context formatting complete. Length:', contextText.length);
        return contextText;
    }
    // Chain of Thought prompting for complex reasoning
    async generateCoTResponse(userInput, context) {
        const cotPrompt = `
You are an AI timetable management assistant. Use Chain of Thought reasoning to analyze the user's request step by step.

User Input: "${userInput}"

IMPORTANT: You have complete access to the following timetable data from @mentions. You must analyze this data and perform any necessary calculations:

${this.formatContextForPrompt(context)}

You must analyze this data and reason through the user's request step by step:

1. UNDERSTAND: What exactly is the user asking for?
2. ANALYZE: What relevant information do I have in the context above?
3. REASON: How can I use this data to answer the user's question?
4. CALCULATE: If the user asks for free slots, conflicts, or schedules, you must calculate these from the provided data
5. RESPOND: Provide a comprehensive answer using the available information with actual time slots (8:00-9:00 AM, not P1)

IMPORTANT: Always convert period codes (P1, P2, etc.) to actual time slots in your reasoning and responses:
- P1 = 8:00-9:00 AM, P2 = 9:00-10:00 AM, P3 = 10:00-11:00 AM, P4 = 11:00-12:00 PM
- P5 = 12:00-1:00 PM, P6 = 1:00-2:00 PM, P7 = 2:00-3:00 PM, P8 = 3:00-4:00 PM, P9 = 4:00-5:00 PM

For each step, provide:
- step: number
- thought: detailed reasoning
- action: specific action to take (if applicable)
- confidence: 0-1 confidence level

Respond ONLY with valid JSON array format, no markdown code blocks or additional text.
`;
        try {
            await this.rateLimit();
            const response = await generateGeminiResponse(cotPrompt);
            if (response) {
                // Clean the response to remove markdown code blocks
                const cleanedResponse = this.cleanJsonResponse(response);
                const parsed = JSON.parse(cleanedResponse);
                return Array.isArray(parsed) ? parsed : [];
            }
        }
        catch (error) {
            console.error('CoT generation error:', error);
        }
        return [{
                step: 1,
                thought: 'Unable to generate Chain of Thought reasoning',
                confidence: 0.1
            }];
    }
    // Tree of Thought prompting for exploring multiple solution paths
    async generateTreeOfThought(userInput, context) {
        const totPrompt = `
You are an AI timetable management assistant. Use Tree of Thought reasoning to explore multiple solution paths.

User Input: "${userInput}"

IMPORTANT: You have complete access to the following timetable data from @mentions. You must analyze this data and perform any necessary calculations:

${this.formatContextForPrompt(context)}

Generate a tree of thoughts exploring different approaches to solve the user's request:

1. ROOT: Main problem/request from the user
2. BRANCHES: Different ways to analyze and respond using the provided timetable data
3. LEAVES: Specific calculations or actions needed (e.g., finding free slots, checking conflicts, analyzing schedules)

IMPORTANT: Always convert period codes (P1, P2, etc.) to actual time slots in your reasoning and responses:
- P1 = 8:00-9:00 AM, P2 = 9:00-10:00 AM, P3 = 10:00-11:00 AM, P4 = 11:00-12:00 PM
- P5 = 12:00-1:00 PM, P6 = 1:00-2:00 PM, P7 = 2:00-3:00 PM, P8 = 3:00-4:00 PM, P9 = 4:00-5:00 PM

For each node, provide:
- id: unique identifier
- content: brief description
- reasoning: why this approach/action
- confidence: 0-1 confidence level
- children: array of child nodes (if any)
- action: specific action to take (if leaf node)
- parameters: action parameters (if applicable)

Respond ONLY with valid JSON object format, no markdown code blocks or additional text.
`;
        try {
            await this.rateLimit();
            const response = await generateGeminiResponse(totPrompt);
            if (response) {
                const cleanedResponse = this.cleanJsonResponse(response);
                const parsed = JSON.parse(cleanedResponse);
                return parsed;
            }
        }
        catch (error) {
            console.error('ToT generation error:', error);
        }
        return {
            id: 'error',
            content: 'Unable to generate tree of thought',
            reasoning: 'Error in Tree of Thought generation',
            confidence: 0.1
        };
    }
    // Enhanced context-aware @ mention parsing
    async parseContextualMentions(input) {
        console.log('🔍 LLM-based entity extraction for input:', input);
        const prompt = `Extract timetable entities from this user input. Look for:

CLASS entities: Class names, section names (e.g., "CHEMICAL_ENGINEERING_SEC-1", "CSE-A", "AM101")
TEACHER entities: Teacher names (e.g., "Dr. Smith", "Dr. Johnson") 
ROOM entities: Room numbers/names (e.g., "A-101", "Room 205")
PERIOD entities: Time periods (e.g., "P1", "P6", "Monday P3", "1:00 pm to 2:00 pm")
SUBJECT entities: Course/subject names (e.g., "Data Structures", "AM101", "Mathematics")

Return JSON: { "entities": [{"id": "unique_id", "type": "class|teacher|room|period|subject", "label": "extracted_text"}] }

User Input: "${input}"`;
        try {
            await this.rateLimit();
            const raw = await generateGeminiResponse(prompt);
            if (!raw)
                throw new Error('Empty extraction response');
            const cleaned = this.cleanJsonResponse(raw);
            const parsed = JSON.parse(cleaned);
            const items = parsed.entities || parsed || [];
            const entities = [];
            for (const it of items) {
                const type = (it.type || '').toLowerCase();
                const label = String(it.label || it.id || '').trim();
                if (!label)
                    continue;
                if (['class', 'teacher', 'room', 'period', 'subject'].includes(type)) {
                    let context = null;
                    if (type === 'class')
                        context = await this.getClassContext(label);
                    if (type === 'teacher')
                        context = await this.getTeacherContext(label);
                    if (type === 'room')
                        context = await this.getRoomContext(label);
                    entities.push({ id: `${type}:${label}`, type: type, label, context });
                }
            }
            console.log('📊 LLM entities parsed:', entities.length);
            return entities;
        }
        catch (e) {
            console.warn('LLM entity extraction failed, returning empty entities:', e?.message || e);
            return [];
        }
    }
    // Identify mention type and get context
    async identifyAndGetContext(mention) {
        try {
            console.log('🔍 Identifying mention type for:', mention);
            // First try as a class/section name
            console.log('🎓 Trying as class...');
            const classContext = await this.getClassContext(mention);
            if (classContext && classContext.totalClasses > 0) {
                console.log('✅ Identified as class with', classContext.totalClasses, 'classes');
                return { type: 'class', data: classContext };
            }
            // Then try as a teacher name
            console.log('👨‍🏫 Trying as teacher...');
            const teacherContext = await this.getTeacherContext(mention);
            if (teacherContext && teacherContext.totalClasses > 0) {
                console.log('✅ Identified as teacher with', teacherContext.totalClasses, 'classes');
                return { type: 'teacher', data: teacherContext };
            }
            // Then try as a room
            console.log('🏢 Trying as room...');
            const roomContext = await this.getRoomContext(mention);
            if (roomContext && roomContext.totalClasses > 0) {
                console.log('✅ Identified as room with', roomContext.totalClasses, 'classes');
                return { type: 'room', data: roomContext };
            }
            // Check if it's a period (P1, P2, etc.)
            if (/^P\d+$/i.test(mention)) {
                console.log('✅ Identified as period');
                return { type: 'period', data: null };
            }
            console.log('❌ Could not identify mention type');
            return null;
        }
        catch (error) {
            console.error('Error identifying mention type:', error);
            return null;
        }
    }
    // Get comprehensive class context from database
    async getClassContext(className) {
        try {
            console.log('🔍 Fetching context for class:', className);
            // Try exact match first
            let { data: classes, error } = await this.supabase
                .from('timetable_classes')
                .select(`
          *,
          timetable_sections!inner(section_name),
          timetables!inner(name, status)
        `)
                .eq('students', className)
                .limit(50);
            // If no exact match, try case-insensitive match
            if ((!classes || classes.length === 0) && error === null) {
                console.log('No exact match found, trying case-insensitive search...');
                const { data: classesInsensitive, error: errorInsensitive } = await this.supabase
                    .from('timetable_classes')
                    .select(`
            *,
            timetable_sections!inner(section_name),
            timetables!inner(name, status)
          `)
                    .ilike('students', className)
                    .limit(50);
                classes = classesInsensitive;
                error = errorInsensitive;
            }
            // If still no match, try partial match
            if ((!classes || classes.length === 0) && error === null) {
                console.log('No case-insensitive match found, trying partial search...');
                const { data: classesPartial, error: errorPartial } = await this.supabase
                    .from('timetable_classes')
                    .select(`
            *,
            timetable_sections!inner(section_name),
            timetables!inner(name, status)
          `)
                    .ilike('students', `%${className}%`)
                    .limit(50);
                classes = classesPartial;
                error = errorPartial;
            }
            if (error) {
                console.error('Error fetching class context:', error);
                return null;
            }
            if (!classes || classes.length === 0) {
                console.log('No classes found for:', className);
                return null;
            }
            // Get detailed schedule information
            const scheduleByDay = classes.reduce((acc, cls) => {
                const day = cls.day || 'Unknown';
                if (!acc[day]) {
                    acc[day] = [];
                }
                acc[day].push({
                    period: cls.period,
                    course: cls.course,
                    instructor: cls.instructor_name,
                    room: cls.room,
                    part: cls.part
                });
                return acc;
            }, {});
            // Get timetable metadata
            const timetableInfo = classes[0]?.timetables;
            const sectionInfo = classes[0]?.timetable_sections;
            const context = {
                schedule: classes,
                scheduleByDay,
                totalClasses: classes.length,
                subjects: [...new Set(classes.map(c => c.course).filter(Boolean))],
                teachers: [...new Set(classes.map(c => c.instructor_name).filter(Boolean))],
                rooms: [...new Set(classes.map(c => c.room).filter(Boolean))],
                days: [...new Set(classes.map(c => c.day).filter(Boolean))],
                periods: [...new Set(classes.map(c => c.period).filter(Boolean))],
                timetableInfo: {
                    name: timetableInfo?.name,
                    status: timetableInfo?.status
                },
                sectionInfo: {
                    sectionName: sectionInfo?.section_name
                },
                // Additional analytics
                totalSubjects: new Set(classes.map(c => c.course).filter(Boolean)).size,
                totalTeachers: new Set(classes.map(c => c.instructor_name).filter(Boolean)).size,
                totalRooms: new Set(classes.map(c => c.room).filter(Boolean)).size,
                // Most common patterns
                mostCommonRoom: this.getMostCommon(classes.map(c => c.room).filter(Boolean)),
                mostCommonPeriod: this.getMostCommon(classes.map(c => c.period).filter(Boolean)),
                mostCommonDay: this.getMostCommon(classes.map(c => c.day).filter(Boolean))
            };
            console.log('✅ Context fetched for', className, ':', {
                totalClasses: context.totalClasses,
                subjects: context.subjects.length,
                teachers: context.teachers.length,
                rooms: context.rooms.length
            });
            return context;
        }
        catch (error) {
            console.error('Error in getClassContext:', error);
            return null;
        }
    }
    // Helper method to find most common item in array
    getMostCommon(items) {
        if (items.length === 0)
            return null;
        const frequency = {};
        items.forEach(item => {
            frequency[item] = (frequency[item] || 0) + 1;
        });
        return Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b);
    }
    // Get comprehensive teacher context from database
    async getTeacherContext(teacherName) {
        try {
            console.log('🔍 Fetching context for teacher:', teacherName);
            // Clean the teacher name for better matching
            const cleanName = teacherName.trim();
            // Try exact match first
            let { data: classes, error } = await this.supabase
                .from('timetable_classes')
                .select(`
          *,
          timetable_sections!inner(section_name),
          timetables!inner(name, status)
        `)
                .eq('instructor_name', cleanName)
                .limit(50);
            // If no exact match, try case-insensitive match
            if ((!classes || classes.length === 0) && error === null) {
                console.log('No exact match found, trying case-insensitive search...');
                const { data: classesInsensitive, error: errorInsensitive } = await this.supabase
                    .from('timetable_classes')
                    .select(`
            *,
            timetable_sections!inner(section_name),
            timetables!inner(name, status)
          `)
                    .ilike('instructor_name', cleanName)
                    .limit(50);
                classes = classesInsensitive;
                error = errorInsensitive;
            }
            // If still no match, try partial match
            if ((!classes || classes.length === 0) && error === null) {
                console.log('No case-insensitive match found, trying partial search...');
                const { data: classesPartial, error: errorPartial } = await this.supabase
                    .from('timetable_classes')
                    .select(`
            *,
            timetable_sections!inner(section_name),
            timetables!inner(name, status)
          `)
                    .ilike('instructor_name', `%${cleanName}%`)
                    .limit(50);
                classes = classesPartial;
                error = errorPartial;
            }
            if (error) {
                console.error('Error fetching teacher context:', error);
                return null;
            }
            if (!classes || classes.length === 0) {
                console.log('No classes found for teacher:', teacherName);
                return null;
            }
            // Get faculty information
            const { data: faculty } = await this.supabase
                .from('faculty')
                .select('*')
                .ilike('name', `%${cleanName}%`)
                .limit(1);
            // Calculate schedule statistics
            const scheduleByDay = classes.reduce((acc, cls) => {
                const day = cls.day;
                if (!acc[day])
                    acc[day] = [];
                acc[day].push(cls);
                return acc;
            }, {});
            const scheduleByPeriod = classes.reduce((acc, cls) => {
                const period = cls.period;
                if (!acc[period])
                    acc[period] = [];
                acc[period].push(cls);
                return acc;
            }, {});
            return {
                schedule: classes || [],
                totalClasses: classes?.length || 0,
                classes: [...new Set(classes?.map(c => c.students) || [])],
                subjects: [...new Set(classes?.map(c => c.course) || [])],
                rooms: [...new Set(classes?.map(c => c.room) || [])],
                facultyInfo: faculty?.[0] || null,
                scheduleByDay,
                scheduleByPeriod,
                days: [...new Set(classes?.map(c => c.day) || [])],
                periods: [...new Set(classes?.map(c => c.period) || [])],
                // Add teacher-specific context for AI
                teacherContext: {
                    name: cleanName,
                    workload: classes?.length || 0,
                    teachingDays: [...new Set(classes?.map(c => c.day) || [])],
                    teachingPeriods: [...new Set(classes?.map(c => c.period) || [])],
                    subjectsTaught: [...new Set(classes?.map(c => c.course) || [])],
                    classesTaught: [...new Set(classes?.map(c => c.students) || [])],
                    roomsUsed: [...new Set(classes?.map(c => c.room) || [])]
                }
            };
        }
        catch (error) {
            console.error('Error in getTeacherContext:', error);
            return null;
        }
    }
    // Get room context from database
    async getRoomContext(roomName) {
        try {
            console.log('🔍 Fetching context for room:', roomName);
            // Try exact match first
            let { data: classes, error } = await this.supabase
                .from('timetable_classes')
                .select(`
          *,
          timetable_sections!inner(section_name),
          timetables!inner(name, status)
        `)
                .eq('room', roomName)
                .limit(50);
            // If no exact match, try case-insensitive match
            if ((!classes || classes.length === 0) && error === null) {
                console.log('No exact match found, trying case-insensitive search...');
                const { data: classesInsensitive, error: errorInsensitive } = await this.supabase
                    .from('timetable_classes')
                    .select(`
            *,
            timetable_sections!inner(section_name),
            timetables!inner(name, status)
          `)
                    .ilike('room', roomName)
                    .limit(50);
                classes = classesInsensitive;
                error = errorInsensitive;
            }
            // If still no match, try partial match
            if ((!classes || classes.length === 0) && error === null) {
                console.log('No case-insensitive match found, trying partial search...');
                const { data: classesPartial, error: errorPartial } = await this.supabase
                    .from('timetable_classes')
                    .select(`
            *,
            timetable_sections!inner(section_name),
            timetables!inner(name, status)
          `)
                    .ilike('room', `%${roomName}%`)
                    .limit(50);
                classes = classesPartial;
                error = errorPartial;
            }
            if (error) {
                console.error('Error fetching room context:', error);
                return null;
            }
            if (!classes || classes.length === 0) {
                console.log('No classes found for room:', roomName);
                return null;
            }
            return {
                schedule: classes || [],
                totalClasses: classes?.length || 0,
                classes: [...new Set(classes?.map(c => c.students) || [])],
                teachers: [...new Set(classes?.map(c => c.instructor_name) || [])],
                subjects: [...new Set(classes?.map(c => c.course) || [])]
            };
        }
        catch (error) {
            console.error('Error in getRoomContext:', error);
            return null;
        }
    }
    // Main AI agent processing with CoT and ToT - Enhanced with debugging
    async processRequest(userInput) {
        console.log('🤖 AI Agent processing request:', userInput);
        console.log('📝 Input length:', userInput.length);
        console.log('🔍 Input contains @mentions:', userInput.includes('@'));
        try {
            // Parse contextual mentions with enhanced debugging
            console.log('🔍 Step 1: Parsing contextual mentions...');
            const entities = await this.parseContextualMentions(userInput);
            console.log('✅ Parsed entities:', entities.length);
            console.log('📋 Entity details:', entities.map(e => `${e.type}:${e.label}`));
            // Build memory first for intent classification
            const recentMemory = await this.getRecentMemory(20);
            // Detect intent from user input (LLM-based with heuristic fallback)
            console.log('🔍 Step 1.5: Detecting intent (LLM)...');
            const intent = await this.detectIntentLLM(userInput, entities, recentMemory);
            console.log('✅ Detected intent:', intent);
            // Build context from entities and database
            console.log('🔍 Step 2: Building context...');
            const context = {
                entities,
                timestamp: new Date().toISOString(),
                userInput,
                intent,
                memory: recentMemory,
                debugInfo: {
                    inputLength: userInput.length,
                    entityCount: entities.length,
                    hasMentions: userInput.includes('@'),
                    processingTime: new Date().toISOString()
                }
            };
            console.log('✅ Context built with', entities.length, 'entities');
            // Store to short term memory
            this.remember(userInput, entities, intent);
            this.saveMemoryRecord({ user_input: userInput, intent, entities }).catch((e) => {
                console.warn('⚠️ Failed to persist agent memory:', e);
            });
            // Generate Chain of Thought reasoning
            console.log('🔍 Step 3: Generating Chain of Thought...');
            const thoughts = await this.generateCoTResponse(userInput, context);
            console.log('✅ Generated', thoughts.length, 'CoT steps');
            // Generate Tree of Thought exploration
            console.log('🔍 Step 4: Generating Tree of Thought...');
            const treeOfThought = await this.generateTreeOfThought(userInput, context);
            console.log('✅ Generated ToT with confidence:', treeOfThought.confidence);
            // Generate final response with action planning
            console.log('🔍 Step 5: Generating final response...');
            const finalResponse = await this.generateFinalResponse(userInput, context, thoughts, treeOfThought);
            console.log('✅ Final response generated');
            console.log('📊 Response length:', finalResponse.response.length);
            console.log('🎯 Action required:', !!finalResponse.action);
            const result = {
                response: finalResponse.response,
                thoughts,
                treeOfThought,
                action: finalResponse.action,
                entities,
                intent
            };
            console.log('🎉 AI Agent processing complete!');
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            const errorStack = error instanceof Error ? error.stack?.substring(0, 200) : 'No stack trace';
            console.error('❌ AI Agent processing error:', error);
            console.error('📊 Error details:', {
                message: errorMessage,
                stack: errorStack,
                userInput: userInput.substring(0, 100)
            });
            // Let the AI handle the error through its reasoning
            const entities = await this.parseContextualMentions(userInput);
            return {
                response: `I encountered an error while processing your request: ${errorMessage}. Please try rephrasing your question or check if Gemini is properly configured. If you're using @mentions, make sure the mentioned entities exist in the database.`,
                thoughts: [{
                        step: 1,
                        thought: `Error occurred during AI processing: ${errorMessage}`,
                        confidence: 0.1
                    }],
                treeOfThought: {
                    id: 'error',
                    content: 'Processing error',
                    reasoning: `AI agent encountered an error: ${errorMessage}`,
                    confidence: 0.1
                },
                entities
            };
        }
    }
    // Generate final response with action planning
    async generateFinalResponse(userInput, context, thoughts, treeOfThought) {
        // Format the context with time slot mappings
        const formattedContext = this.formatContextForPrompt(context);
        const actionPrompt = `
Based on the Chain of Thought reasoning and Tree of Thought exploration, generate a comprehensive response.

User Input: "${userInput}"

IMPORTANT: You have complete access to the following timetable data from @mentions. You must analyze this data and perform any necessary calculations:

${formattedContext}

Chain of Thought Steps: ${JSON.stringify(thoughts, null, 2)}

Tree of Thought: ${JSON.stringify(treeOfThought, null, 2)}

Generate a comprehensive response that:
1. Directly answers the user's question using the provided timetable data
2. Performs any necessary calculations (free slots, conflicts, schedule analysis) from the data
3. Provides specific, actionable information with actual time slots (8:00-9:00 AM, not P1)
4. Shows your reasoning process transparently
5. **ALWAYS convert period codes to time slots in your response**

CRITICAL EXECUTION RULES:
- You must analyze and calculate everything from the provided data. Do NOT ask to query the database or request additional information.
- If the intent is one of [SCHEDULE, CANCEL, RESCHEDULE, SUBSTITUTE, SWAP_CLASS, INSERT_BATCH_EVENT, ACCOMMODATE_URGENT_EVENT], you MUST include an actionable 'action' object.
- The 'action' MUST strictly follow this schema:
  {
    "action": {
      "type": "SCHEDULE | CANCEL | RESCHEDULE | SUBSTITUTE | SWAP_CLASS | INSERT_BATCH_EVENT | ACCOMMODATE_URGENT_EVENT",
      "parameters": { /* minimal fields needed to execute */ },
      "confirmationRequired": true
    },
    "response": "string"
  }
- For SCHEDULE you MUST include: { class, subject, teacher, day, period, room }
- For RESCHEDULE you MUST include: { id, newDay, newPeriod, newRoom }
- For CANCEL you MUST include: { id } for single class OR { ids: ["id1", "id2", ...] } for multiple classes - Use the exact IDs from the timetable data above
- For SUBSTITUTE you MUST include: { id, substituteTeacher, day, period }
- For SWAP_CLASS you MUST include: { eventAId: "actual_database_id", eventBId: "actual_database_id" } - Use the exact IDs from the timetable data above. Look for the ID numbers in the "Complete Schedule Data" section.
- For INSERT_BATCH_EVENT you MUST include: { classList[], day, period, subject, room, teacher? }
- For ACCOMMODATE_URGENT_EVENT you MUST include: { class, subject, teacher, preferredDays[], rooms[] }

Respond ONLY with valid JSON (no markdown). The root object MUST contain exactly two top-level keys: 'response' and (when applicable) 'action'.
`;
        // Log the complete prompt being sent to Gemini
        console.log('📤 COMPLETE PROMPT BEING SENT TO GEMINI:');
        console.log('='.repeat(80));
        console.log(actionPrompt);
        console.log('='.repeat(80));
        console.log('📊 Prompt length:', actionPrompt.length, 'characters');
        console.log('📊 Context length:', formattedContext.length, 'characters');
        try {
            await this.rateLimit();
            const response = await generateGeminiResponse(actionPrompt);
            if (response) {
                const cleanedResponse = this.cleanJsonResponse(response);
                const parsed = JSON.parse(cleanedResponse);
                return parsed;
            }
        }
        catch (error) {
            console.error('Final response generation error:', error);
        }
        // Minimal fallback - let AI handle everything
        return {
            response: `I need to process your request through my reasoning system. Please try again.`
        };
    }
    // Execute database operations based on action
    async executeAction(action) {
        try {
            // Verify action against constraints before executing
            const verification = await this.verifyAction(action);
            if (!verification.ok) {
                return { success: false, message: `Constraint violation: ${verification.reason}` };
            }
            switch (action.type) {
                case 'SCHEDULE':
                    return await this.scheduleClass(action.parameters);
                case 'CANCEL':
                    return await this.cancelClass(action.parameters);
                case 'RESCHEDULE':
                    return await this.rescheduleClass(action.parameters);
                case 'SWAP':
                    return await this.swapClasses(action.parameters);
                case 'SWAP_CLASS':
                    return await this.swapClasses(action.parameters);
                case 'SUBSTITUTE':
                    return await this.assignSubstitute(action.parameters);
                case 'INSERT_BATCH_EVENT':
                    return await this.insertBatchEvent(action.parameters);
                case 'ACCOMMODATE_URGENT_EVENT':
                    return await this.accommodateUrgentEvent(action.parameters);
                case 'ADD_CONSTRAINT':
                    return await this.addConstraint(action.parameters);
                case 'UPDATE_CONSTRAINT':
                    return await this.updateConstraint(action.parameters);
                case 'REMOVE_CONSTRAINT':
                    return await this.removeConstraint(action.parameters);
                default:
                    return { success: false, message: 'Unknown action type' };
            }
        }
        catch (error) {
            console.error('Action execution error:', error);
            return { success: false, message: 'Error executing action' };
        }
    }
    // Database operation methods
    async scheduleClass(params) {
        try {
            // Attach to latest timetable so UI fetching /api/latest-timetable includes this row
            let latestTimetableId = null;
            try {
                const { data: tt } = await this.supabase
                    .from('timetables')
                    .select('id')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();
                latestTimetableId = tt?.id ?? null;
            }
            catch { }
            // Auto-assign teacher if not provided
            let assignedTeacher = params.teacher;
            if (!assignedTeacher || assignedTeacher === 'To be assigned') {
                assignedTeacher = await this.findAvailableTeacherForSubject(params.subject, params.class, params.day || 'Monday', params.period);
            }
            const { data, error } = await this.supabase
                .from('timetable_classes')
                .insert({
                timetable_id: latestTimetableId,
                students: params.class,
                course: params.subject,
                instructor_name: assignedTeacher || params.teacher || null,
                period: params.period,
                room: params.room,
                day: params.day || 'Monday',
                instructor: params.teacherId || assignedTeacher || params.teacher || null
            })
                .select()
                .single();
            if (error) {
                return { success: false, message: `Error scheduling class: ${error.message}` };
            }
            return {
                success: true,
                message: 'Class scheduled successfully!',
                data
            };
        }
        catch (error) {
            return { success: false, message: 'Error scheduling class' };
        }
    }
    async cancelClass(params) {
        try {
            // Handle both single ID and multiple IDs
            const ids = params.ids || (params.id ? [params.id] : []);
            if (ids.length === 0) {
                return { success: false, message: 'No class IDs provided for cancellation' };
            }
            const { error } = await this.supabase
                .from('timetable_classes')
                .delete()
                .in('id', ids);
            if (error) {
                return { success: false, message: `Error cancelling class: ${error.message}` };
            }
            const message = ids.length === 1
                ? 'Class cancelled successfully!'
                : `${ids.length} classes cancelled successfully!`;
            return { success: true, message, data: { cancelledIds: ids } };
        }
        catch (error) {
            return { success: false, message: 'Error cancelling class' };
        }
    }
    async rescheduleClass(params) {
        try {
            const { data, error } = await this.supabase
                .from('timetable_classes')
                .update({
                period: params.newPeriod,
                day: params.newDay,
                room: params.newRoom
            })
                .eq('id', params.id)
                .select()
                .single();
            if (error) {
                return { success: false, message: `Error rescheduling class: ${error.message}` };
            }
            return {
                success: true,
                message: 'Class rescheduled successfully!',
                data
            };
        }
        catch (error) {
            return { success: false, message: 'Error rescheduling class' };
        }
    }
    async swapClasses(_params) {
        try {
            const { eventAId, eventBId } = _params || {};
            if (!eventAId || !eventBId)
                return { success: false, message: 'Missing event ids for swap' };
            // Check if the IDs are valid (UUIDs or numeric)
            const isValidId = (id) => {
                if (!id || typeof id !== 'string')
                    return false;
                // Check if it's a UUID (36 characters with hyphens) or numeric
                return id.length === 36 && id.includes('-') || !isNaN(Number(id)) && Number(id) > 0;
            };
            if (!isValidId(eventAId) || !isValidId(eventBId)) {
                // If we have descriptive text, we need to find the actual IDs
                // For now, return an error asking for proper IDs
                return {
                    success: false,
                    message: 'Please provide actual database IDs for the events to swap. Use the IDs from the timetable data (e.g., UUIDs or numeric IDs)'
                };
            }
            // Fetch both events
            const { data: events, error } = await this.supabase
                .from('timetable_classes')
                .select('*')
                .in('id', [eventAId, eventBId]);
            if (error || !events || events.length !== 2)
                return { success: false, message: 'Unable to load events for swap' };
            const [a, b] = events[0].id === eventAId ? [events[0], events[1]] : [events[1], events[0]];
            // Compute swapped params
            const aNew = { day: b.day, period: b.period, room: b.room };
            const bNew = { day: a.day, period: a.period, room: a.room };
            // Verify conflicts for both new placements
            // For swaps, we need to exclude both events being swapped from conflict detection
            const aConflict = await this.hasConflict({ day: aNew.day, period: aNew.period, className: a.students, teacher: a.instructor_name, room: aNew.room }, b.id);
            const bConflict = await this.hasConflict({ day: bNew.day, period: bNew.period, className: b.students, teacher: b.instructor_name, room: bNew.room }, a.id);
            if (aConflict || bConflict)
                return { success: false, message: 'Swap would create conflicts' };
            // Perform updates sequentially with rollback
            const updA = await this.supabase.from('timetable_classes').update(aNew).eq('id', a.id).select().single();
            if (updA.error)
                return { success: false, message: `Swap failed (A): ${updA.error.message}` };
            const updB = await this.supabase.from('timetable_classes').update(bNew).eq('id', b.id).select().single();
            if (updB.error) {
                // rollback A
                await this.supabase.from('timetable_classes').update({ day: a.day, period: a.period, room: a.room }).eq('id', a.id);
                return { success: false, message: `Swap failed (B): ${updB.error.message}` };
            }
            return { success: true, message: 'Classes swapped successfully', data: { a: updA.data, b: updB.data } };
        }
        catch (error) {
            return { success: false, message: 'Error swapping classes' };
        }
    }
    async assignSubstitute(params) {
        try {
            const { data, error } = await this.supabase
                .from('timetable_classes')
                .update({
                instructor_name: params.substituteTeacher,
                instructor: params.substituteTeacherId || params.substituteTeacher
            })
                .eq('id', params.id)
                .select()
                .single();
            if (error) {
                return { success: false, message: `Error assigning substitute: ${error.message}` };
            }
            return {
                success: true,
                message: 'Substitute teacher assigned successfully!',
                data
            };
        }
        catch (error) {
            return { success: false, message: 'Error assigning substitute' };
        }
    }
    // ===== Constraints CRUD and integration =====
    async addConstraint(params) {
        try {
            const { data, error } = await this.supabase
                .from('timetable_constraints')
                .insert(params)
                .select()
                .single();
            if (error)
                return { success: false, message: `Error adding constraint: ${error.message}` };
            return { success: true, message: 'Constraint added', data };
        }
        catch {
            return { success: false, message: 'Error adding constraint' };
        }
    }
    async updateConstraint(params) {
        try {
            const { id, ...rest } = params || {};
            if (!id)
                return { success: false, message: 'Constraint id required' };
            const { data, error } = await this.supabase
                .from('timetable_constraints')
                .update(rest)
                .eq('id', id)
                .select()
                .single();
            if (error)
                return { success: false, message: `Error updating constraint: ${error.message}` };
            return { success: true, message: 'Constraint updated', data };
        }
        catch {
            return { success: false, message: 'Error updating constraint' };
        }
    }
    async removeConstraint(params) {
        try {
            const { id } = params || {};
            if (!id)
                return { success: false, message: 'Constraint id required' };
            const { error } = await this.supabase
                .from('timetable_constraints')
                .delete()
                .eq('id', id);
            if (error)
                return { success: false, message: `Error removing constraint: ${error.message}` };
            return { success: true, message: 'Constraint removed' };
        }
        catch {
            return { success: false, message: 'Error removing constraint' };
        }
    }
    async getConstraints(scope) {
        const q = this.supabase.from('timetable_constraints').select('*');
        // scope-based filtering can be added here
        const { data, error } = await q;
        if (error)
            return [];
        return data || [];
    }
    // ===== Simulation (no-write) =====
    async simulateImpact(params) {
        try {
            // For now, run read-only queries to estimate impact; no DB writes
            // Example params: { buildingOutage: { building: 'AB', dates: [...] }, newFaculty: {...}, batchSizeDelta: {...} }
            // Return a structured report
            return { success: true, message: 'Simulation computed', data: { report: params, conflicts: [] } };
        }
        catch {
            return { success: false, message: 'Error running simulation' };
        }
    }
    // ===== Batch and urgent event helpers =====
    async insertBatchEvent(params) {
        try {
            // params: { classList: string[], day, period, subject, room, teacher? }
            const rows = (params.classList || []).map((cls) => ({
                students: cls,
                course: params.subject,
                instructor_name: params.teacher || null,
                period: params.period,
                room: params.room,
                day: params.day
            }));
            // Basic conflict screening: if any conflict, abort
            for (const r of rows) {
                const conflict = await this.hasConflict({ day: r.day, period: r.period, className: r.students, teacher: r.instructor_name || undefined, room: r.room });
                if (conflict)
                    return { success: false, message: `Conflict detected for ${r.students}` };
            }
            const { data, error } = await this.supabase.from('timetable_classes').insert(rows).select();
            if (error)
                return { success: false, message: `Error inserting batch event: ${error.message}` };
            return { success: true, message: 'Batch event inserted', data };
        }
        catch {
            return { success: false, message: 'Error inserting batch event' };
        }
    }
    async accommodateUrgentEvent(params) {
        try {
            // Find first free period across preferred days/rooms/teachers minimizing conflicts
            const preferredDays = params.preferredDays || [];
            const candidateRooms = params.rooms || [];
            for (const day of preferredDays) {
                const free = await this.findFreeSlots({ className: params.class, teacher: params.teacher }, day);
                for (const period of free) {
                    for (const room of candidateRooms) {
                        const conflict = await this.hasConflict({ day, period, className: params.class, teacher: params.teacher, room });
                        if (!conflict) {
                            // schedule immediately
                            return await this.scheduleClass({ class: params.class, subject: params.subject, teacher: params.teacher, day, period, room });
                        }
                    }
                }
            }
            return { success: false, message: 'No feasible urgent slot found' };
        }
        catch {
            return { success: false, message: 'Error accommodating urgent event' };
        }
    }
    // Get enhanced mention suggestions with context - fetch exact section names from database
    async getMentionSuggestions(query) {
        const suggestions = [];
        try {
            console.log('🔍 Getting mention suggestions for query:', query);
            // Get exact section names from timetable_sections table (this is the source of truth)
            const { data: sections, error: sectionsError } = await this.supabase
                .from('timetable_sections')
                .select('section_name')
                .ilike('section_name', `%${query}%`)
                .not('section_name', 'is', null)
                .limit(15);
            if (sectionsError) {
                console.error('❌ Error fetching sections:', sectionsError);
            }
            else {
                console.log('📚 Found sections:', sections?.length || 0);
                const uniqueSections = [...new Set(sections?.map(s => s.section_name) || [])];
                uniqueSections.forEach(section => {
                    suggestions.push({
                        id: `class:${section}`,
                        type: 'class',
                        label: section
                    });
                });
            }
            // Get teachers with distinct results
            const { data: teachers, error: teachersError } = await this.supabase
                .from('timetable_classes')
                .select('instructor_name')
                .ilike('instructor_name', `%${query}%`)
                .not('instructor_name', 'is', null)
                .not('instructor_name', 'eq', '')
                .limit(15);
            if (teachersError) {
                console.error('❌ Error fetching teachers:', teachersError);
            }
            else {
                console.log('👨‍🏫 Found teachers:', teachers?.length || 0);
                const uniqueTeachers = [...new Set(teachers?.map(t => t.instructor_name) || [])]
                    .filter(teacher => teacher && teacher.trim() !== '')
                    .sort();
                uniqueTeachers.forEach(teacher => {
                    suggestions.push({
                        id: `teacher:${teacher}`,
                        type: 'teacher',
                        label: teacher
                    });
                });
                console.log('✅ Added teachers to suggestions:', uniqueTeachers.length);
            }
            // Get rooms with distinct results
            const { data: rooms, error: roomsError } = await this.supabase
                .from('timetable_classes')
                .select('room')
                .ilike('room', `%${query}%`)
                .not('room', 'is', null)
                .limit(10);
            if (roomsError) {
                console.error('❌ Error fetching rooms:', roomsError);
            }
            else {
                console.log('🏢 Found rooms:', rooms?.length || 0);
                const uniqueRooms = [...new Set(rooms?.map(r => r.room) || [])];
                uniqueRooms.forEach(room => {
                    suggestions.push({
                        id: `room:${room}`,
                        type: 'room',
                        label: room
                    });
                });
            }
            // Get periods if query matches period pattern
            if (/^p\d*$/i.test(query)) {
                const periods = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9'];
                periods.forEach(period => {
                    if (period.toLowerCase().includes(query.toLowerCase())) {
                        suggestions.push({
                            id: `period:${period}`,
                            type: 'period',
                            label: period
                        });
                    }
                });
            }
            console.log('📊 Total mention suggestions found:', suggestions.length);
            console.log('📋 Suggestions:', suggestions.map(s => `${s.type}:${s.label}`));
            return suggestions.slice(0, 12); // Increased limit to 12 suggestions
        }
        catch (error) {
            console.error('❌ Error getting mention suggestions:', error);
            return [];
        }
    }
}
export const timetableAIAgent = new TimetableAIAgent();
