import { supabase } from '../lib/supabaseClient';

export interface Faculty {
  id: string;
  instructor_id: number;
  name: string;
  department: string;
  designation: string;
  specialization: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FacultyForm {
  instructor_id?: number;
  name: string;
  email: string;
  department: string;
  designation: string;
  specialization: string;
  is_active: boolean;
}

export const facultyService = {
  // Get all faculty members
  async getFaculty(): Promise<Faculty[]> {
    try {
      const { data, error } = await supabase
        .from('faculty')
        .select('*')
        .order('instructor_id');

      if (error) {
        console.error('Error fetching faculty:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getFaculty:', error);
      return [];
    }
  },

  // Get faculty by ID
  async getFacultyById(id: string): Promise<Faculty | null> {
    try {
      const { data, error } = await supabase
        .from('faculty')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching faculty by ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getFacultyById:', error);
      return null;
    }
  },

  // Add new faculty member
  async addFaculty(faculty: FacultyForm): Promise<Faculty | null> {
    try {
      // Get the next instructor_id
      const { data: maxId } = await supabase
        .from('faculty')
        .select('instructor_id')
        .order('instructor_id', { ascending: false })
        .limit(1);

      const nextId = maxId && maxId.length > 0 ? maxId[0].instructor_id + 1 : 1;

      const { data, error } = await supabase
        .from('faculty')
        .insert({
          instructor_id: faculty.instructor_id ?? nextId,
          name: faculty.name,
          email: faculty.email,
          department: faculty.department,
          designation: faculty.designation,
          specialization: faculty.specialization,
          is_active: faculty.is_active,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding faculty:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in addFaculty:', error);
      return null;
    }
  },

  // Update faculty member
  async updateFaculty(id: string, faculty: Partial<FacultyForm>): Promise<Faculty | null> {
    try {
      const { data, error } = await supabase
        .from('faculty')
        .update({
          ...faculty,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating faculty:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in updateFaculty:', error);
      return null;
    }
  },

  // Delete faculty member
  async deleteFaculty(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('faculty')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting faculty:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteFaculty:', error);
      return false;
    }
  },

  // Toggle faculty status
  async toggleFacultyStatus(id: string): Promise<Faculty | null> {
    try {
      // First get the current status
      const { data: currentFaculty } = await supabase
        .from('faculty')
        .select('is_active')
        .eq('id', id)
        .single();

      if (!currentFaculty) {
        return null;
      }

      const { data, error } = await supabase
        .from('faculty')
        .update({
          is_active: !currentFaculty.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error toggling faculty status:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in toggleFacultyStatus:', error);
      return null;
    }
  },

  // Get faculty statistics
  async getFacultyStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byDepartment: Record<string, number>;
    byDesignation: Record<string, number>;
    bySpecialization: Record<string, number>;
  }> {
    try {
      const faculty = await this.getFaculty();
      
      const stats = {
        total: faculty.length,
        active: faculty.filter(f => f.is_active).length,
        inactive: faculty.filter(f => !f.is_active).length,
        byDepartment: {} as Record<string, number>,
        byDesignation: {} as Record<string, number>,
        bySpecialization: {} as Record<string, number>,
      };

      // Count by department
      faculty.forEach(f => {
        stats.byDepartment[f.department] = (stats.byDepartment[f.department] || 0) + 1;
      });

      // Count by designation
      faculty.forEach(f => {
        stats.byDesignation[f.designation] = (stats.byDesignation[f.designation] || 0) + 1;
      });

      // Count by specialization
      faculty.forEach(f => {
        stats.bySpecialization[f.specialization] = (stats.bySpecialization[f.specialization] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error in getFacultyStats:', error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        byDepartment: {},
        byDesignation: {},
        bySpecialization: {},
      };
    }
  },

  // Search faculty
  async searchFaculty(query: string): Promise<Faculty[]> {
    try {
      const { data, error } = await supabase
        .from('faculty')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,specialization.ilike.%${query}%`)
        .order('name');

      if (error) {
        console.error('Error searching faculty:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchFaculty:', error);
      return [];
    }
  },
};
