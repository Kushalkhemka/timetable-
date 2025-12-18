import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  metadata?: any;
  isLoading?: boolean;
}

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
  
  // Actions
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  processUserInput: (input: string) => Promise<void>;
  confirmAction: (action: AIAction) => void;
  cancelAction: () => void;
  updateTimetable: (updates: Partial<TimetableSlot>[]) => void;
  getFreeSlots: (teacher?: string, className?: string) => TimetableSlot[];
  getTeacherSchedule: (teacher: string) => TimetableSlot[];
  getClassSchedule: (className: string) => TimetableSlot[];
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

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerInput = input.toLowerCase();
    let response: string;
    let actionType: ChatMessage['actionType'];
    let metadata: any = {};

    // Enhanced AI processing logic
    if (lowerInput.includes('schedule') || lowerInput.includes('book') || lowerInput.includes('add')) {
      response = await processScheduleRequest(input);
      actionType = 'SCHEDULE';
    } else if (lowerInput.includes('cancel') || lowerInput.includes('remove')) {
      response = await processCancelRequest(input);
      actionType = 'CANCEL';
    } else if (lowerInput.includes('reschedule') || lowerInput.includes('move') || lowerInput.includes('change time')) {
      response = await processRescheduleRequest(input);
      actionType = 'RESCHEDULE';
    } else if (lowerInput.includes('swap') || lowerInput.includes('exchange') || lowerInput.includes('switch')) {
      response = await processSwapRequest(input);
      actionType = 'SWAP';
    } else if (lowerInput.includes('substitute') || lowerInput.includes('replace') || lowerInput.includes('cover')) {
      response = await processSubstituteRequest(input);
      actionType = 'SUBSTITUTE';
    } else if (lowerInput.includes('free') || lowerInput.includes('available') || lowerInput.includes('slot')) {
      response = await processAvailabilityRequest(input);
      actionType = 'QUERY';
    } else if (lowerInput.includes('show') || lowerInput.includes('display') || lowerInput.includes('list')) {
      response = await processShowRequest(input);
      actionType = 'QUERY';
    } else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('help')) {
      response = 'Hello! How can I help you with your timetable today? I can assist with:\n\n• Scheduling new classes\n• Canceling existing classes\n• Rescheduling classes\n• Swapping classes between teachers\n• Assigning substitute teachers\n• Checking free slots and availability\n\nJust tell me what you\'d like to do in natural language!';
    } else {
      response = 'I understand you want help with timetable management. Could you be more specific about what you\'d like to do? I can help with scheduling, canceling, rescheduling, swapping, or assigning substitute teachers.';
    }

    setIsLoading(false);
    
    addMessage({
      type: 'ai',
      content: response,
      actionType,
      metadata,
    });
  };

  // AI Processing Functions
  const processScheduleRequest = async (input: string): Promise<string> => {
    // Extract information from natural language
    const classMatch = input.match(/(?:class|section)\s+([A-Z]+-[A-Z])/i);
    const subjectMatch = input.match(/(?:subject|course)\s+([^,]+)/i);
    const teacherMatch = input.match(/(?:teacher|professor|instructor)\s+([^,]+)/i);
    const periodMatch = input.match(/(?:period|slot)\s+(P\d+)/i);
    const roomMatch = input.match(/(?:room|hall)\s+([^,]+)/i);

    if (!classMatch || !subjectMatch || !teacherMatch || !periodMatch) {
      return 'To schedule a class, I need more information. Please provide:\n\n• Class/Section (e.g., CSE-A)\n• Subject (e.g., Data Structures)\n• Teacher (e.g., Dr. Smith)\n• Period (e.g., P1)\n• Room (optional)\n\nExample: "Schedule CSE-A Data Structures with Dr. Smith for P1 in room A-101"';
    }

    const newSlot: TimetableSlot = {
      id: Date.now().toString(),
      class: classMatch[1],
      subject: subjectMatch[1].trim(),
      teacher: teacherMatch[1].trim(),
      period: periodMatch[1],
      room: roomMatch ? roomMatch[1].trim() : 'TBD',
      type: 'LECTURE',
      status: 'SCHEDULED',
      date: new Date().toISOString().split('T')[0],
      time: '09:00-10:00'
    };

    // Check for conflicts
    const conflicts = timetableData.filter(slot => 
      slot.period === newSlot.period && 
      (slot.class === newSlot.class || slot.teacher === newSlot.teacher)
    );

    if (conflicts.length > 0) {
      return `I found a conflict! The ${newSlot.period} slot is already occupied:\n\n${conflicts.map(c => `• ${c.class} - ${c.subject} with ${c.teacher}`).join('\n')}\n\nWould you like to reschedule this class to a different period?`;
    }

    setCurrentAction({
      type: 'SCHEDULE',
      parameters: newSlot,
      confirmationRequired: true
    });

    return `I'll schedule the following class:\n\n• Class: ${newSlot.class}\n• Subject: ${newSlot.subject}\n• Teacher: ${newSlot.teacher}\n• Period: ${newSlot.period}\n• Room: ${newSlot.room}\n\nPlease confirm if this is correct.`;
  };

  const processCancelRequest = async (input: string): Promise<string> => {
    const classMatch = input.match(/(?:class|section)\s+([A-Z]+-[A-Z])/i);
    const teacherMatch = input.match(/(?:teacher|professor|instructor)\s+([^,]+)/i);
    const periodMatch = input.match(/(?:period|slot)\s+(P\d+)/i);

    if (!classMatch && !teacherMatch && !periodMatch) {
      return 'To cancel a class, please specify:\n\n• Class/Section (e.g., CSE-A)\n• Teacher (e.g., Dr. Smith)\n• Period (e.g., P1)\n\nExample: "Cancel CSE-A Data Structures for P1"';
    }

    const matchingSlots = timetableData.filter(slot => {
      const classMatch = input.toLowerCase().includes(slot.class.toLowerCase());
      const teacherMatch = input.toLowerCase().includes(slot.teacher.toLowerCase());
      const periodMatch = input.toLowerCase().includes(slot.period.toLowerCase());
      
      return classMatch || teacherMatch || periodMatch;
    });

    if (matchingSlots.length === 0) {
      return 'I couldn\'t find any classes matching your criteria. Please check the class name, teacher, or period and try again.';
    }

    if (matchingSlots.length === 1) {
      setCurrentAction({
        type: 'CANCEL',
        parameters: matchingSlots[0],
        confirmationRequired: true
      });

      return `I found this class to cancel:\n\n• Class: ${matchingSlots[0].class}\n• Subject: ${matchingSlots[0].subject}\n• Teacher: ${matchingSlots[0].teacher}\n• Period: ${matchingSlots[0].period}\n\nPlease confirm cancellation.`;
    }

    return `I found multiple classes matching your criteria:\n\n${matchingSlots.map(slot => 
      `• ${slot.class} - ${slot.subject} with ${slot.teacher} (${slot.period})`
    ).join('\n')}\n\nPlease be more specific about which class you want to cancel.`;
  };

  const processRescheduleRequest = async (_input: string): Promise<string> => {
    return 'I can help you reschedule a class. Please specify:\n\n• Which class to reschedule\n• New time/period\n• New date (if different)\n\nExample: "Reschedule CSE-A Data Structures from P1 to P3"';
  };

  const processSwapRequest = async (_input: string): Promise<string> => {
    return 'I can help you swap classes between teachers. Please specify:\n\n• First teacher and their class\n• Second teacher and their class\n\nExample: "Swap Dr. Smith\'s CSE-A Data Structures with Dr. Brown\'s CSE-B Database Systems"';
  };

  const processSubstituteRequest = async (_input: string): Promise<string> => {
    return 'I can help you assign a substitute teacher. Please specify:\n\n• Original teacher\n• Substitute teacher\n• Class and period\n\nExample: "Assign Dr. Wilson as substitute for Dr. Smith\'s CSE-A Data Structures class"';
  };

  const processAvailabilityRequest = async (input: string): Promise<string> => {
    const teacherMatch = input.match(/(?:teacher|professor|instructor)\s+([^,]+)/i);
    const classMatch = input.match(/(?:class|section)\s+([A-Z]+-[A-Z])/i);

    if (teacherMatch) {
      const teacher = teacherMatch[1].trim();
      const teacherSchedule = getTeacherSchedule(teacher);
      const freeSlots = getFreeSlots(teacher);
      
      return `Here's ${teacher}'s schedule:\n\n${teacherSchedule.length > 0 ? 
        teacherSchedule.map(slot => `• ${slot.period}: ${slot.class} - ${slot.subject}`).join('\n') :
        'No classes scheduled'
      }\n\nFree slots: ${freeSlots.length > 0 ? 
        freeSlots.map(slot => slot.period).join(', ') : 
        'None available'
      }`;
    }

    if (classMatch) {
      const className = classMatch[1];
      const classSchedule = getClassSchedule(className);
      
      return `Here's ${className}'s schedule:\n\n${classSchedule.length > 0 ? 
        classSchedule.map(slot => `• ${slot.period}: ${slot.subject} with ${slot.teacher}`).join('\n') :
        'No classes scheduled'
      }`;
    }

    return 'I can check availability for teachers or classes. Please specify:\n\n• "Show free slots for [Teacher Name]"\n• "Show schedule for [Class Name]"\n\nExample: "Show free slots for Dr. Smith"';
  };

  const processShowRequest = async (input: string): Promise<string> => {
    if (input.toLowerCase().includes('timetable') || input.toLowerCase().includes('schedule')) {
      return `Here's the current timetable:\n\n${timetableData.map(slot => 
        `• ${slot.class} - ${slot.period}: ${slot.subject} with ${slot.teacher} (${slot.room})`
      ).join('\n')}`;
    }
    
    return 'I can show you the timetable, specific teacher schedules, or class schedules. What would you like to see?';
  };

  const confirmAction = (action: AIAction) => {
    if (action.type === 'SCHEDULE') {
      setTimetableData(prev => [...prev, action.parameters]);
      addMessage({
        type: 'ai',
        content: '✅ Class scheduled successfully!',
        actionType: 'CONFIRM'
      });
    } else if (action.type === 'CANCEL') {
      setTimetableData(prev => prev.map(slot => 
        slot.id === action.parameters.id 
          ? { ...slot, status: 'CANCELLED' as const }
          : slot
      ));
      addMessage({
        type: 'ai',
        content: '✅ Class cancelled successfully!',
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
    addMessage,
    processUserInput,
    confirmAction,
    cancelAction,
    updateTimetable,
    getFreeSlots,
    getTeacherSchedule,
    getClassSchedule,
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
