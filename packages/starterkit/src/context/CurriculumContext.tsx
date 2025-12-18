import React, { createContext, useContext, useState, ReactNode } from 'react';
import { curriculumService, DBSubject } from '../services/supabase';

export interface CurriculumData {
  id: string;
  subjectName: string;
  department: string;
  totalHours: number;
  hoursPerWeek: number;
  topics: Topic[];
  prerequisites: string[];
  objectives: string[];
  status: 'draft' | 'approved' | 'active';
  createdAt: Date;
  updatedAt: Date;
}

export interface Topic {
  id: string;
  name: string;
  hours: number;
  subtopics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  weekNumber?: number;
  sessions?: Session[];
}

export interface Session {
  session: number;
  minutes: number;
  topicTitles: string[];
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  department: string;
  subject: string;
  // Raw file blob for uploading to ingest server
  fileBlob?: File;
  extractedText?: string;
  curriculumData?: CurriculumData;
  errorMessage?: string;
}

interface CurriculumContextType {
  curricula: CurriculumData[];
  uploadedFiles: UploadedFile[];
  isLoading: boolean;
  availableSubjects: DBSubject[];
  addCurriculum: (curriculum: Omit<CurriculumData, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCurriculum: (id: string, updates: Partial<CurriculumData>) => void;
  deleteCurriculum: (id: string) => void;
  addUploadedFile: (file: UploadedFile) => void;
  updateUploadedFile: (id: string, updates: Partial<UploadedFile>) => void;
  deleteUploadedFile: (id: string) => void;
  processOCR: (fileId: string) => Promise<void>;
  processOCRDirect: (file: UploadedFile) => Promise<void>;
  generateTimetable: (curriculumId: string) => Promise<void>;
  loadAvailableSubjects: (department: string) => Promise<void>;
  saveCurriculumToDatabase: (curriculum: CurriculumData) => Promise<boolean>;
}

const CurriculumContext = createContext<CurriculumContextType | undefined>(undefined);

export const useCurriculum = () => {
  const context = useContext(CurriculumContext);
  if (!context) {
    throw new Error('useCurriculum must be used within a CurriculumProvider');
  }
  return context;
};

interface CurriculumProviderProps {
  children: ReactNode;
}

export const CurriculumProvider: React.FC<CurriculumProviderProps> = ({ children }) => {
  const [curricula, setCurricula] = useState<CurriculumData[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [availableSubjects, setAvailableSubjects] = useState<DBSubject[]>([]);

  // Mock data for demonstration
  const mockCurricula: CurriculumData[] = [
    {
      id: '1',
      subjectName: 'Data Structures and Algorithms',
      department: 'Computer Science Engineering (CSE)',
      totalHours: 50,
      hoursPerWeek: 4,
      topics: [
        {
          id: '1',
          name: 'Arrays and Linked Lists',
          hours: 8,
          subtopics: ['Static Arrays', 'Dynamic Arrays', 'Singly Linked List', 'Doubly Linked List'],
          difficulty: 'beginner',
          weekNumber: 1
        },
        {
          id: '2',
          name: 'Stacks and Queues',
          hours: 6,
          subtopics: ['Stack Implementation', 'Queue Implementation', 'Applications'],
          difficulty: 'beginner',
          weekNumber: 2
        },
        {
          id: '3',
          name: 'Trees and Binary Search Trees',
          hours: 10,
          subtopics: ['Tree Traversal', 'BST Operations', 'Balanced Trees'],
          difficulty: 'intermediate',
          weekNumber: 3
        },
        {
          id: '4',
          name: 'Graphs and Graph Algorithms',
          hours: 12,
          subtopics: ['Graph Representation', 'DFS', 'BFS', 'Shortest Path', 'Minimum Spanning Tree'],
          difficulty: 'advanced',
          weekNumber: 4
        },
        {
          id: '5',
          name: 'Sorting and Searching Algorithms',
          hours: 8,
          subtopics: ['Bubble Sort', 'Quick Sort', 'Binary Search', 'Hash Tables'],
          difficulty: 'intermediate',
          weekNumber: 5
        },
        {
          id: '6',
          name: 'Dynamic Programming',
          hours: 6,
          subtopics: ['Memoization', 'Tabulation', 'Classic Problems'],
          difficulty: 'advanced',
          weekNumber: 6
        }
      ],
      prerequisites: ['Programming Fundamentals', 'Discrete Mathematics'],
      objectives: [
        'Understand fundamental data structures',
        'Analyze algorithm complexity',
        'Implement efficient algorithms',
        'Solve real-world problems'
      ],
      status: 'approved',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      subjectName: 'Database Management Systems',
      department: 'Computer Science Engineering (CSE)',
      totalHours: 45,
      hoursPerWeek: 3,
      topics: [
        {
          id: '1',
          name: 'Introduction to Databases',
          hours: 6,
          subtopics: ['Database Concepts', 'DBMS Architecture', 'Data Models'],
          difficulty: 'beginner',
          weekNumber: 1
        },
        {
          id: '2',
          name: 'Relational Model',
          hours: 8,
          subtopics: ['Relations', 'Keys', 'Integrity Constraints', 'Normalization'],
          difficulty: 'intermediate',
          weekNumber: 2
        },
        {
          id: '3',
          name: 'SQL Queries',
          hours: 10,
          subtopics: ['DDL', 'DML', 'DCL', 'Advanced Queries'],
          difficulty: 'intermediate',
          weekNumber: 3
        },
        {
          id: '4',
          name: 'Database Design',
          hours: 8,
          subtopics: ['ER Model', 'Schema Design', 'Indexing'],
          difficulty: 'advanced',
          weekNumber: 4
        },
        {
          id: '5',
          name: 'Transaction Management',
          hours: 6,
          subtopics: ['ACID Properties', 'Concurrency Control', 'Recovery'],
          difficulty: 'advanced',
          weekNumber: 5
        },
        {
          id: '6',
          name: 'Database Security',
          hours: 7,
          subtopics: ['Authentication', 'Authorization', 'Encryption'],
          difficulty: 'intermediate',
          weekNumber: 6
        }
      ],
      prerequisites: ['Data Structures', 'Computer Programming'],
      objectives: [
        'Understand database concepts and architecture',
        'Design and implement relational databases',
        'Write efficient SQL queries',
        'Understand transaction management and security'
      ],
      status: 'draft',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    }
  ];

  // Initialize with mock data and load from Supabase
  React.useEffect(() => {
    setCurricula(mockCurricula);
    loadCurriculaFromDatabase();
    loadUploadedFilesFromDatabase();
  }, []);

  const loadUploadedFilesFromDatabase = async () => {
    try {
      console.log('Loading uploaded files from database...');
      const dbCurricula = await curriculumService.getCurricula();
      if (dbCurricula.length > 0) {
        // Create uploaded files from database curricula
        const uploadedFiles: UploadedFile[] = dbCurricula.map((curriculum, index) => ({
          id: `db-${curriculum.id}`,
          name: `${curriculum.subjectName}.pdf`,
          size: 1000000, // Mock size
          type: 'application/pdf',
          status: 'completed' as const,
          progress: 100,
          department: curriculum.department,
          subject: curriculum.subjectName,
          extractedText: `Curriculum for ${curriculum.subjectName}`,
          curriculumData: curriculum
        }));
        
        console.log('Created uploaded files from database:', uploadedFiles.length, 'files');
        setUploadedFiles(uploadedFiles);
      }
    } catch (error) {
      console.error('Error loading uploaded files from database:', error);
    }
  };

  const loadCurriculaFromDatabase = async () => {
    try {
      console.log('Loading curricula from database...');
      const dbCurricula = await curriculumService.getCurricula();
      console.log('Retrieved curricula from database:', dbCurricula.length, 'curricula');
      if (dbCurricula.length > 0) {
        setCurricula(dbCurricula);
        console.log('Set curricula in state:', dbCurricula.length, 'curricula');
      } else {
        console.log('No curricula found in database');
      }
    } catch (error) {
      console.error('Error loading curricula from database:', error);
    }
  };

  const addCurriculum = (curriculum: Omit<CurriculumData, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCurriculum: CurriculumData = {
      ...curriculum,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setCurricula(prev => [...prev, newCurriculum]);
  };

  const updateCurriculum = (id: string, updates: Partial<CurriculumData>) => {
    setCurricula(prev => prev.map(curriculum => 
      curriculum.id === id 
        ? { ...curriculum, ...updates, updatedAt: new Date() }
        : curriculum
    ));
  };

  const deleteCurriculum = (id: string) => {
    setCurricula(prev => prev.filter(curriculum => curriculum.id !== id));
  };

  const addUploadedFile = (file: UploadedFile) => {
    setUploadedFiles(prev => [...prev, file]);
  };

  const updateUploadedFile = (id: string, updates: Partial<UploadedFile>) => {
    setUploadedFiles(prev => prev.map(file => 
      file.id === id ? { ...file, ...updates } : file
    ));
  };

  const deleteUploadedFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const processOCR = async (fileId: string): Promise<void> => {
    setIsLoading(true);

    try {
      if ((window as any).localStorage?.getItem('INGEST_DEBUG')) {
        console.log('[Ingest OCR] start', { fileId, uploadedCount: uploadedFiles.length, uploadedFiles });
      }
      const file = uploadedFiles.find(f => f.id === fileId);
      if (!file || !file.fileBlob) {
        const msg = !file ? 'File not found in state' : 'Missing fileBlob for upload';
        if ((window as any).localStorage?.getItem('INGEST_DEBUG')) {
          console.error('[Ingest OCR] early failure', msg);
        }
        updateUploadedFile(fileId, { status: 'error', errorMessage: msg });
        setIsLoading(false);
        return;
      }

      // Move to processing state
      updateUploadedFile(fileId, { status: 'processing' });

      const form = new FormData();
      form.append('file', file.fileBlob, file.name);

      const response = await fetch('http://localhost:5057/ingest', {
        method: 'POST',
        body: form
      });

      const data: any = await response.json().catch(() => null);
      if (!response.ok) {
        const serverDetail = data?.detail || data?.error;
        throw new Error(serverDetail ? String(serverDetail) : `Ingest failed: ${response.status}`);
      }
      if ((window as any).localStorage?.getItem('INGEST_DEBUG')) {
        console.log('[Ingest OCR] response ok', { hasMarkdown: !!data?.markdown, planKeys: Object.keys(data?.plan || {}) });
      }

      const markdown: string = data?.markdown || '';
      const plan: any = data?.plan || null;

      // Expect normalized schema from ingest: { course, slotMinutes, units: [{ name, contactHours, topics: [{title, minutes}], sessions: [...] }], notes }
      const subjectName = (plan && plan.course) ? String(plan.course) : (file.subject || file.name);
      const units = Array.isArray(plan?.units) ? plan.units : [];

      const totalHours = units.reduce((sum: number, u: any) => sum + (Number(u?.contactHours) || 0), 0);

      const topics = units.map((u: any, idx: number) => {
        const subtopics: string[] = Array.isArray(u?.topics)
          ? u.topics.map((t: any) => t?.title || t?.name || String(t)).filter(Boolean)
          : [];
        const sessions: Session[] = Array.isArray(u?.sessions)
          ? u.sessions.map((s: any) => ({
              session: s.session || 0,
              minutes: s.minutes || 60,
              topicTitles: s.topicTitles || []
            }))
          : [];
        return {
          id: String(idx + 1),
          name: u?.name || `Unit ${idx + 1}`,
          hours: Number(u?.contactHours) || 0,
          subtopics,
          difficulty: 'intermediate' as const,
          sessions
        };
      });

      const curriculum: CurriculumData = {
        id: Math.random().toString(36).substr(2, 9),
        subjectName,
        department: file.department || '',
        totalHours: totalHours || topics.reduce((s: number, t: Topic) => s + (t.hours || 0), 0),
        hoursPerWeek: 3,
        topics,
        prerequisites: [],
        objectives: [],
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      updateUploadedFile(fileId, {
        status: 'completed',
        extractedText: markdown,
        curriculumData: curriculum
      });

      // Automatically save to database (parity with direct flow)
      const saved = await saveCurriculumToDatabase(curriculum);
      if (saved) {
        console.log('Curriculum saved to database successfully');
      } else {
        console.warn('Failed to save curriculum to database');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[Ingest OCR] Failed:', message);
      updateUploadedFile(fileId, { status: 'error', errorMessage: message });
    } finally {
      setIsLoading(false);
    }
  };

  const processOCRDirect = async (file: UploadedFile): Promise<void> => {
    setIsLoading(true);

    try {
      if (!file || !file.fileBlob) {
        const msg = !file ? 'File not provided' : 'Missing fileBlob for upload';
        updateUploadedFile(file.id, { status: 'error', errorMessage: msg });
        setIsLoading(false);
        return;
      }

      updateUploadedFile(file.id, { status: 'processing' });

      const form = new FormData();
      form.append('file', file.fileBlob, file.name);

      const response = await fetch('http://localhost:5057/ingest', {
        method: 'POST',
        body: form
      });

      const data: any = await response.json().catch(() => null);
      if (!response.ok) {
        const serverDetail = data?.detail || data?.error;
        throw new Error(serverDetail ? String(serverDetail) : `Ingest failed: ${response.status}`);
      }

      const markdown: string = data?.markdown || '';
      const plan: any = data?.plan || null;

      const subjectName = (plan && plan.course) ? String(plan.course) : (file.subject || file.name);
      const units = Array.isArray(plan?.units) ? plan.units : [];
      const totalHours = units.reduce((sum: number, u: any) => sum + (Number(u?.contactHours) || 0), 0);
      const topics = units.map((u: any, idx: number) => {
        const subtopics: string[] = Array.isArray(u?.topics)
          ? u.topics.map((t: any) => t?.title || t?.name || String(t)).filter(Boolean)
          : [];
        const sessions: Session[] = Array.isArray(u?.sessions)
          ? u.sessions.map((s: any) => ({
              session: s.session || 0,
              minutes: s.minutes || 60,
              topicTitles: s.topicTitles || []
            }))
          : [];
        return {
          id: String(idx + 1),
          name: u?.name || `Unit ${idx + 1}`,
          hours: Number(u?.contactHours) || 0,
          subtopics,
          difficulty: 'intermediate' as const,
          sessions
        };
      });

      const curriculum: CurriculumData = {
        id: Math.random().toString(36).substr(2, 9),
        subjectName,
        department: file.department || '',
        totalHours: totalHours || topics.reduce((s: number, t: Topic) => s + (t.hours || 0), 0),
        hoursPerWeek: 3,
        topics,
        prerequisites: [],
        objectives: [],
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      updateUploadedFile(file.id, {
        status: 'completed',
        extractedText: markdown,
        curriculumData: curriculum
      });

      // Automatically save to database
      const saved = await saveCurriculumToDatabase(curriculum);
      if (saved) {
        console.log('Curriculum saved to database successfully');
      } else {
        console.warn('Failed to save curriculum to database');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[Ingest OCR] Failed (direct):', message);
      updateUploadedFile(file.id, { status: 'error', errorMessage: message });
    } finally {
      setIsLoading(false);
    }
  };

  const generateTimetable = async (curriculumId: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate timetable generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const curriculum = curricula.find(c => c.id === curriculumId);
    if (curriculum) {
      // Update curriculum status to active
      updateCurriculum(curriculumId, { status: 'active' });
      
      // Here you would typically:
      // 1. Calculate optimal schedule based on hours per week
      // 2. Assign topics to specific weeks
      // 3. Generate timetable slots
      // 4. Integrate with existing timetable system
    }
    
    setIsLoading(false);
  };

  const loadAvailableSubjects = async (department: string): Promise<void> => {
    try {
      const subjects = await curriculumService.getSubjectsByDepartment(department);
      setAvailableSubjects(subjects);
    } catch (error) {
      console.error('Error loading subjects:', error);
      setAvailableSubjects([]);
    }
  };

  const saveCurriculumToDatabase = async (curriculum: CurriculumData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await curriculumService.saveCurriculum(curriculum);
      if (result) {
        // Update local state with the saved curriculum
        setCurricula(prev => [curriculum, ...prev]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving curriculum to database:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: CurriculumContextType = {
    curricula,
    uploadedFiles,
    isLoading,
    availableSubjects,
    addCurriculum,
    updateCurriculum,
    deleteCurriculum,
    addUploadedFile,
    updateUploadedFile,
    deleteUploadedFile,
    processOCR,
    processOCRDirect,
    generateTimetable,
    loadAvailableSubjects,
    saveCurriculumToDatabase
  };

  return (
    <CurriculumContext.Provider value={value}>
      {children}
    </CurriculumContext.Provider>
  );
};
