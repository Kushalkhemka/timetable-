import { createClient } from '@supabase/supabase-js';
import { CurriculumData } from '../context/CurriculumContext';

// Supabase configuration
const supabaseUrl = 'https://ketlvbjlukqcolfkwyge.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldGx2YmpsdWtxY29sZmt3eWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjEwMTksImV4cCI6MjA3MjkzNzAxOX0.Lro-UME31Wcn-Y6RegmadZqPPJk9MzlQuDYO8Uf0tyw';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface DBCurriculum {
  id: string;
  subject_name: string;
  department: string;
  total_hours: number;
  hours_per_week: number;
  prerequisites: string[];
  objectives: string[];
  status: 'draft' | 'approved' | 'active';
  created_at: string;
  updated_at: string;
}

export interface DBTopic {
  id: string;
  curriculum_id: string;
  name: string;
  hours: number;
  subtopics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  week_number?: number;
  order_index: number;
  sessions?: any[];
}

export interface DBSubject {
  id: string;
  name: string;
  department: string;
  code: string;
  credits: number;
  is_active: boolean;
}

// Curriculum operations
export const curriculumService = {
  // Save curriculum to database
  async saveCurriculum(curriculum: CurriculumData): Promise<DBCurriculum | null> {
    try {
      const dbCurriculum: Omit<DBCurriculum, 'id'> = {
        subject_name: curriculum.subjectName,
        department: curriculum.department,
        total_hours: curriculum.totalHours,
        hours_per_week: curriculum.hoursPerWeek,
        prerequisites: curriculum.prerequisites,
        objectives: curriculum.objectives,
        status: curriculum.status,
        created_at: curriculum.createdAt.toISOString(),
        updated_at: curriculum.updatedAt.toISOString(),
      };

      const { data, error } = await supabase
        .from('curricula')
        .insert(dbCurriculum)
        .select()
        .single();

      if (error) {
        console.error('Error saving curriculum:', error);
        return null;
      }

      // Save topics
      if (curriculum.topics.length > 0) {
        console.log('Saving topics:', curriculum.topics.length, 'topics');
        const dbTopics: Omit<DBTopic, 'id'>[] = curriculum.topics.map((topic, index) => ({
          curriculum_id: data.id,
          name: topic.name,
          hours: topic.hours,
          subtopics: topic.subtopics,
          difficulty: topic.difficulty,
          week_number: topic.weekNumber,
          order_index: index,
          sessions: topic.sessions || [],
        }));

        console.log('Topics to insert:', dbTopics);
        const { error: topicsError } = await supabase
          .from('topics')
          .insert(dbTopics);

        if (topicsError) {
          console.error('Error saving topics:', topicsError);
        } else {
          console.log('Topics saved successfully');
        }
      } else {
        console.log('No topics to save');
      }

      return data;
    } catch (error) {
      console.error('Error in saveCurriculum:', error);
      return null;
    }
  },

  // Get all curricula
  async getCurricula(): Promise<CurriculumData[]> {
    try {
      console.log('Supabase: Fetching curricula...');
      const { data: curricula, error } = await supabase
        .from('curricula')
        .select(`
          *,
          topics (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase: Error fetching curricula:', error);
        return [];
      }

      console.log('Supabase: Raw curricula data:', curricula?.length || 0, 'curricula');
      
      const mappedCurricula = curricula.map((dbCurriculum: any) => ({
        id: dbCurriculum.id,
        subjectName: dbCurriculum.subject_name,
        department: dbCurriculum.department,
        totalHours: dbCurriculum.total_hours,
        hoursPerWeek: dbCurriculum.hours_per_week,
        topics: dbCurriculum.topics?.map((topic: any) => ({
          id: topic.id,
          name: topic.name,
          hours: topic.hours,
          subtopics: topic.subtopics,
          difficulty: topic.difficulty,
          weekNumber: topic.week_number,
          sessions: topic.sessions || [],
        })) || [],
        prerequisites: dbCurriculum.prerequisites,
        objectives: dbCurriculum.objectives,
        status: dbCurriculum.status,
        createdAt: new Date(dbCurriculum.created_at),
        updatedAt: new Date(dbCurriculum.updated_at),
      }));

      console.log('Supabase: Mapped curricula:', mappedCurricula.length, 'curricula');
      return mappedCurricula;
    } catch (error) {
      console.error('Supabase: Error in getCurricula:', error);
      return [];
    }
  },

  // Delete a curriculum (and its topics via cascade)
  async deleteCurriculum(params: { id?: string; subjectName?: string; department?: string }): Promise<boolean> {
    try {
      if (params.id) {
        const { error } = await supabase
          .from('curricula')
          .delete()
          .eq('id', params.id);
        if (error) {
          console.error('Supabase: Error deleting curriculum by id:', error);
          return false;
        }
        return true;
      }

      if (params.subjectName && params.department) {
        const { error } = await supabase
          .from('curricula')
          .delete()
          .eq('subject_name', params.subjectName)
          .eq('department', params.department)
          .limit(1);
        if (error) {
          console.error('Supabase: Error deleting curriculum by subject/department:', error);
          return false;
        }
        return true;
      }

      console.warn('Supabase: deleteCurriculum called without sufficient identifiers');
      return false;
    } catch (error) {
      console.error('Supabase: Exception in deleteCurriculum:', error);
      return false;
    }
  },

  // Update a curriculum's status (by id or subject+department)
  async updateCurriculumStatus(params: { id?: string; subjectName?: string; department?: string; status: 'draft' | 'approved' | 'active' }): Promise<boolean> {
    try {
      const updates = { status: params.status, updated_at: new Date().toISOString() } as any;
      if (params.id) {
        const { error } = await supabase
          .from('curricula')
          .update(updates)
          .eq('id', params.id);
        if (error) {
          console.error('Supabase: Error updating curriculum status by id:', error);
          return false;
        }
        return true;
      }
      if (params.subjectName && params.department) {
        const { error } = await supabase
          .from('curricula')
          .update(updates)
          .eq('subject_name', params.subjectName)
          .eq('department', params.department);
        if (error) {
          console.error('Supabase: Error updating curriculum status by subject/department:', error);
          return false;
        }
        return true;
      }
      console.warn('Supabase: updateCurriculumStatus called without sufficient identifiers');
      return false;
    } catch (e) {
      console.error('Supabase: Exception in updateCurriculumStatus:', e);
      return false;
    }
  },

  // Get subjects by department
  async getSubjectsByDepartment(department: string): Promise<DBSubject[]> {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('department', department)
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching subjects:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSubjectsByDepartment:', error);
      return [];
    }
  },

  // Get a single subject by course code
  async getSubjectByCode(code: string): Promise<DBSubject | null> {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching subject by code:', error);
        return null;
      }

      return data || null;
    } catch (error) {
      console.error('Error in getSubjectByCode:', error);
      return null;
    }
  },

  // Upsert a subject (used when approving if subject missing)
  async upsertSubject(subject: { code: string; name: string; department: string; credits: number; is_active: boolean }): Promise<DBSubject | null> {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .upsert(subject, { onConflict: 'code' })
        .select('*')
        .single();
      if (error) {
        console.error('Error upserting subject:', error);
        return null;
      }
      return data as unknown as DBSubject;
    } catch (e) {
      console.error('Error in upsertSubject:', e);
      return null;
    }
  },

  // Create or update a subject by code
  async upsertSubject(params: { code: string; name: string; department: string; credits?: number; is_active?: boolean }): Promise<DBSubject | null> {
    try {
      const payload = {
        code: params.code,
        name: params.name,
        department: params.department,
        credits: typeof params.credits === 'number' ? params.credits : 0,
        is_active: params.is_active !== false
      } as any;

      // Attempt to find existing
      const existing = await this.getSubjectByCode(params.code);
      if (existing) {
        const { data, error } = await supabase
          .from('subjects')
          .update(payload)
          .eq('code', params.code)
          .select('*')
          .maybeSingle();
        if (error) {
          console.error('Error updating subject:', error);
          return null;
        }
        return data as any;
      }

      const { data, error } = await supabase
        .from('subjects')
        .insert(payload)
        .select('*')
        .maybeSingle();
      if (error) {
        console.error('Error inserting subject:', error);
        return null;
      }
      return data as any;
    } catch (error) {
      console.error('Error in upsertSubject:', error);
      return null;
    }
  },

  // Check if curriculum exists for subject
  async curriculumExists(subjectName: string, department: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('curricula')
        .select('id')
        .eq('subject_name', subjectName)
        .eq('department', department)
        .single();

      return !error && !!data;
    } catch (error) {
      return false;
    }
  }
};
