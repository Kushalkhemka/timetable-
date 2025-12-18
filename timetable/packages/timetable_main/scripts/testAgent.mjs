import 'dotenv/config';

const root = new URL('..', import.meta.url);

async function loadAgent() {
  try {
    // Try TS source via dynamic import transpiled by bundler if configured
    const mod = await import('../src/services/aiAgent.ts');
    return mod;
  } catch (e) {
    // Fallback to JS build path if exists
    try {
      const mod = await import('../dist/services/aiAgent.js');
      return mod;
    } catch (e2) {
      throw e2;
    }
  }
}

async function loadSupabase() {
  try {
    const mod = await import('../src/lib/supabaseClient.ts');
    return mod;
  } catch (e) {
    try {
      const mod = await import('../dist/lib/supabaseClient.js');
      return mod;
    } catch (e2) {
      throw e2;
    }
  }
}

async function main() {
  const { timetableAIAgent } = await loadAgent();
  const { supabase } = await loadSupabase();

  console.log('=== Agent E2E Test: Schedule Class ===');
  const input = "Schedule @class:CSE-A Data Structures with @teacher:Dr. Smith on Monday for P2 in @room:A-101";
  console.log('User Input:', input);

  const agentResponse = await timetableAIAgent.processRequest(input);
  console.log('Intent:', agentResponse.intent);
  console.log('Action:', agentResponse.action);
  console.log('AI Response (truncated):', agentResponse.response.slice(0, 200));

  if (agentResponse.action) {
    console.log('Executing action...');
    const exec = await timetableAIAgent.executeAction(agentResponse.action);
    console.log('Execution result:', exec);
  } else {
    console.log('No action to execute.');
  }

  console.log('\n=== Recent Timetable Rows ===');
  const { data, error } = await supabase
    .from('timetable_classes')
    .select('id, day, period, students, course, instructor_name, room')
    .order('id', { ascending: false })
    .limit(5);
  if (error) {
    console.error('Query error:', error.message);
  } else {
    console.table(data);
  }

  console.log('\n=== Memory Rows ===');
  const mem = await supabase
    .from('ai_agent_memory')
    .select('created_at, intent, user_input')
    .order('created_at', { ascending: false })
    .limit(3);
  if (mem.error) {
    console.warn('Memory table read failed (ok if not created yet):', mem.error.message);
  } else {
    console.table(mem.data);
  }
}

main().catch((e) => {
  console.error('Test failed:', e);
  process.exit(1);
});















