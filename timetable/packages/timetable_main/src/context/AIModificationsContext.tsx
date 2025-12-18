import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { isGeminiConfigured, ensureGeminiInitialized } from '../lib/gemini';
import { timetableAIAgent, TimetableEntity, CoTStep, ThoughtNode } from '../services/aiAgent';
import { supabase } from '../lib/supabaseClient';

// Types
interface TimetableSlot {
  id: string;
  class: string;
  period: string;
  teacher: string;
  subject: string;
  type?: 'LECTURE' | 'LAB' | 'TUTORIAL';
  room?: string;
  status: 'SCHEDULED' | 'CANCELLED' | 'RESCHEDULED' | 'SUBSTITUTE';
  date?: string;
  time?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  actionType?: 'SCHEDULE' | 'CANCEL' | 'RESCHEDULE' | 'SWAP' | 'SUBSTITUTE' | 'QUERY' | 'CONFIRM';
  metadata?: {
    mentions?: TimetableEntity[];
    thoughts?: CoTStep[];
    treeOfThought?: ThoughtNode;
    entities?: TimetableEntity[];
    data?: any;
  };
  isLoading?: boolean;
}

type MentionType = 'class' | 'teacher' | 'room' | 'period' | 'slot';
interface MentionItem { id: string; type: MentionType; label: string }

interface AIAction {
  type: ChatMessage['actionType'];
  parameters: any;
  confirmationRequired?: boolean;
}

interface AIModificationsContextType {
  // State
  messages: ChatMessage[];
  timetableData: TimetableSlot[];
  isLoading: boolean;
  currentAction: AIAction | null;
  isGeminiAvailable: boolean;
  
  // Actions
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  processUserInput: (input: string) => Promise<void>;
  confirmAction: (action: AIAction) => void;
  cancelAction: () => void;
  updateTimetable: (updates: Partial<TimetableSlot>[]) => void;
  getFreeSlots: (teacher?: string, className?: string) => TimetableSlot[];
  getTeacherSchedule: (teacher: string) => TimetableSlot[];
  getClassSchedule: (className: string) => TimetableSlot[];
  getMentionSuggestions: (query: string) => Promise<TimetableEntity[]>;
}

const AIModificationsContext = createContext<AIModificationsContextType | undefined>(undefined);

// Mock data
const initialTimetableData: TimetableSlot[] = [
  {
    id: '1',
    class: 'CSE-A',
    period: 'P1',
    teacher: 'Dr. Smith',
    subject: 'Data Structures',
    type: 'LECTURE',
    room: 'A-101',
    status: 'SCHEDULED',
    date: '2024-01-15',
    time: '09:00-10:00'
  },
  {
    id: '2',
    class: 'CSE-A',
    period: 'P2',
    teacher: 'Prof. Johnson',
    subject: 'Algorithms Lab',
    type: 'LAB',
    room: 'LAB-1',
    status: 'SCHEDULED',
    date: '2024-01-15',
    time: '10:00-11:00'
  },
  {
    id: '3',
    class: 'CSE-B',
    period: 'P1',
    teacher: 'Dr. Brown',
    subject: 'Database Systems',
    type: 'LECTURE',
    room: 'B-201',
    status: 'SCHEDULED',
    date: '2024-01-15',
    time: '09:00-10:00'
  },
  {
    id: '4',
    class: 'CSE-B',
    period: 'P2',
    teacher: 'Dr. Smith',
    subject: 'Data Structures',
    type: 'LECTURE',
    room: 'B-201',
    status: 'SCHEDULED',
    date: '2024-01-15',
    time: '10:00-11:00'
  },
  {
    id: '5',
    class: 'CSE-C',
    period: 'P1',
    teacher: 'Prof. Wilson',
    subject: 'Computer Networks',
    type: 'LECTURE',
    room: 'C-301',
    status: 'SCHEDULED',
    date: '2024-01-15',
    time: '09:00-10:00'
  }
];

export const AIModificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI timetable assistant. I can help you manage your timetable using natural language. You can ask me to schedule classes, cancel classes, swap teachers, assign substitutes, or ask questions about free slots.',
      timestamp: new Date(),
    }
  ]);
  const [timetableData, setTimetableData] = useState<TimetableSlot[]>(initialTimetableData);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState<AIAction | null>(null);
  const [isGeminiAvailable, setIsGeminiAvailable] = useState(isGeminiConfigured());

  useEffect(() => {
    // Try to initialize Gemini on mount if key exists
    if (isGeminiConfigured()) {
      const ok = ensureGeminiInitialized();
      setIsGeminiAvailable(ok);
    }
  }, []);

  // Load real timetable data from Supabase on mount
  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const { data, error } = await supabase
          .from('timetable_classes')
          .select('id, students, course, part, period, room, instructor_name')
          .limit(100)
          .order('period');

        if (error) {
          console.error('❌ Error fetching timetable:', error);
          return; // keep mock data as fallback
        }

        const mapped = (data || []).map((item: any) => ({
          id: String(item.id),
          class: item.students,
          period: item.period,
          teacher: item.instructor_name,
          subject: item.course,
          type: (String(item.part || 'LECTURE').toUpperCase() as 'LECTURE' | 'LAB' | 'TUTORIAL'),
          room: item.room,
          status: 'SCHEDULED' as const,
        }));

        if (mapped.length > 0) {
          setTimetableData(mapped);
        }
      } catch (err) {
        console.error('❌ Unexpected error loading timetable:', err);
      }
    };

    fetchTimetable();
  }, []);

  const buildMentionIndex = (): MentionItem[] => {
    const classes = Array.from(new Set(timetableData.map(s => s.class))).map(c => ({ id: `class:${c}`, type: 'class' as const, label: c }));
    const teachers = Array.from(new Set(timetableData.map(s => s.teacher))).map(t => ({ id: `teacher:${t}`, type: 'teacher' as const, label: t }));
    const rooms = Array.from(new Set(timetableData.map(s => s.room).filter(Boolean) as string[])).map(r => ({ id: `room:${r}`, type: 'room' as const, label: r }));
    const periods = Array.from(new Set(timetableData.map(s => s.period))).map(p => ({ id: `period:${p}`, type: 'period' as const, label: p }));
    const slots = timetableData.map(s => ({ id: `slot:${s.id}`, type: 'slot' as const, label: `${s.class} ${s.subject} ${s.period}` }));
    return [...classes, ...teachers, ...rooms, ...periods, ...slots];
  };

  const getMentionSuggestions = async (query: string): Promise<TimetableEntity[]> => {
    try {
      return await timetableAIAgent.getMentionSuggestions(query);
    } catch (error) {
      console.error('Error getting mention suggestions:', error);
      // Fallback to local data
      const index = buildMentionIndex();
      const q = query.trim().toLowerCase();
      if (!q) return index.slice(0, 8).map(item => ({
        id: item.id,
        type: item.type,
        label: item.label
      }));
      return index.filter(item => item.label.toLowerCase().includes(q))
        .slice(0, 8)
        .map(item => ({
          id: item.id,
          type: item.type,
          label: item.label
        }));
    }
  };

  // Removed parseMentions as we're now purely LLM-based

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const processUserInput = async (input: string) => {
    setIsLoading(true);
    
    // Add user message
    addMessage({
      type: 'user',
      content: input,
    });

    try {
      // Use the enhanced AI agent with CoT and ToT
      console.log('🤖 Processing with enhanced AI agent:', input);
      const agentResponse = await timetableAIAgent.processRequest(input);
      
      console.log('✅ AI Agent response received:', {
        response: agentResponse.response.substring(0, 100) + '...',
        thoughtsCount: agentResponse.thoughts.length,
        entitiesCount: agentResponse.entities?.length || 0
      });

      setIsLoading(false);
      
      addMessage({
        type: 'ai',
        content: agentResponse.response,
        actionType: agentResponse.action?.type as ChatMessage['actionType'],
        metadata: {
          mentions: agentResponse.entities,
          thoughts: agentResponse.thoughts,
          treeOfThought: agentResponse.treeOfThought,
          entities: agentResponse.entities
        }
      });

      // Set current action if confirmation is required
      if (agentResponse.action?.confirmationRequired) {
        setCurrentAction({
          type: agentResponse.action.type as ChatMessage['actionType'],
          parameters: agentResponse.action.parameters,
          confirmationRequired: true
        });
      }

    } catch (error) {
      console.error('❌ AI Agent error:', error);
      setIsGeminiAvailable(false);
      setIsLoading(false);
      
      // Pure LLM-based error handling - let the AI handle the error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addMessage({
        type: 'ai',
        content: `I encountered an error while processing your request: ${errorMessage}. Please try rephrasing your question or check if Gemini is properly configured. If you're using @mentions, make sure the mentioned entities exist in the database.`,
        actionType: 'QUERY',
        metadata: {
          data: {
            errorMessage,
            timestamp: new Date().toISOString()
          }
        }
      });
    }
  };

  // All processing is now handled by the LLM through the AI agent

  const confirmAction = async (action: AIAction) => {
    try {
      // Execute action using the AI agent
      const result = await timetableAIAgent.executeAction(action);
      
      if (result.success) {
        // Update local state for immediate UI feedback
        if (action.type === 'SCHEDULE') {
          setTimetableData(prev => [...prev, action.parameters]);
        } else if (action.type === 'CANCEL') {
          setTimetableData(prev => prev.map(slot => 
            slot.id === action.parameters.id 
              ? { ...slot, status: 'CANCELLED' as const }
              : slot
          ));
        }
        
        addMessage({
          type: 'ai',
          content: `✅ ${result.message}`,
          actionType: 'CONFIRM',
          metadata: { data: result.data }
        });
      } else {
        addMessage({
          type: 'ai',
          content: `❌ ${result.message}`,
          actionType: 'CONFIRM'
        });
      }
    } catch (error) {
      console.error('Error executing action:', error);
      addMessage({
        type: 'ai',
        content: '❌ Error executing action. Please try again.',
        actionType: 'CONFIRM'
      });
    }
    
    setCurrentAction(null);
  };

  const cancelAction = () => {
    setCurrentAction(null);
    addMessage({
      type: 'ai',
      content: 'Action cancelled. How else can I help you?'
    });
  };

  const updateTimetable = (updates: Partial<TimetableSlot>[]) => {
    setTimetableData(prev => 
      prev.map(slot => {
        const update = updates.find(u => u.id === slot.id);
        return update ? { ...slot, ...update } : slot;
      })
    );
  };

  const getFreeSlots = (teacher?: string, className?: string): TimetableSlot[] => {
    const allPeriods = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'];
    const occupiedPeriods = timetableData
      .filter(slot => 
        (!teacher || slot.teacher === teacher) &&
        (!className || slot.class === className) &&
        slot.status === 'SCHEDULED'
      )
      .map(slot => slot.period);
    
    return allPeriods
      .filter(period => !occupiedPeriods.includes(period))
      .map(period => ({
        id: `free-${period}`,
        class: className || 'Available',
        period,
        teacher: teacher || 'Available',
        subject: 'Free Slot',
        status: 'SCHEDULED' as const
      }));
  };

  const getTeacherSchedule = (teacher: string): TimetableSlot[] => {
    return timetableData.filter(slot => 
      slot.teacher === teacher && slot.status === 'SCHEDULED'
    );
  };

  const getClassSchedule = (className: string): TimetableSlot[] => {
    return timetableData.filter(slot => 
      slot.class === className && slot.status === 'SCHEDULED'
    );
  };

  const value: AIModificationsContextType = {
    messages,
    timetableData,
    isLoading,
    currentAction,
    isGeminiAvailable,
    addMessage,
    processUserInput,
    confirmAction,
    cancelAction,
    updateTimetable,
    getFreeSlots,
    getTeacherSchedule,
    getClassSchedule,
    getMentionSuggestions,
  };

  return (
    <AIModificationsContext.Provider value={value}>
      {children}
    </AIModificationsContext.Provider>
  );
};

export const useAIModifications = () => {
  const context = useContext(AIModificationsContext);
  if (context === undefined) {
    throw new Error('useAIModifications must be used within an AIModificationsProvider');
  }
  return context;
};
