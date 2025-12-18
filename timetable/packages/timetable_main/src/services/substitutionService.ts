import { Teacher, Timetable, Period } from '../types/substitution';

// API base URL - adjust if needed
const API_BASE_URL = '/api';

export interface TeacherTimetableResponse {
  teacher_timetable: {
    instructor_id: string;
    instructor_name: string;
    grid: Record<string, Record<string, any>>;
    total_classes: number;
    courses: string[];
    sections: string[];
  };
  metadata: {
    timetable_id: string;
    timetable_name: string;
    generated_at: string;
  };
}

export interface TeacherTimetablesResponse {
  teacher_timetables: Record<string, {
    instructor_id: string;
    instructor_name: string;
    grid: Record<string, Record<string, any>>;
    total_classes: number;
    courses: string[];
    sections: string[];
  }>;
  metadata: {
    timetable_id: string;
    timetable_name: string;
    total_teachers: number;
    total_classes: number;
    generated_at: string;
  };
}

class SubstitutionService {
  // Fetch all teacher timetables
  async getTeacherTimetables(): Promise<TeacherTimetablesResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/teacher-timetables`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching teacher timetables:', error);
      throw error;
    }
  }

  // Fetch specific teacher timetable
  async getTeacherTimetable(instructorId: string): Promise<TeacherTimetableResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/teacher-timetable/${instructorId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching teacher timetable:', error);
      throw error;
    }
  }

  // Convert teacher timetable data to Teacher format
  convertToTeacher(teacherData: any, instructorId: string): Teacher {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'];
    const colorIndex = parseInt(instructorId) % colors.length;
    
    // Get the most common course for this teacher as their subject
    const primaryCourse = this.getPrimaryCourse(teacherData.teacher_timetable_classes);
    
    return {
      id: instructorId,
      name: teacherData.instructor_name,
      subject: primaryCourse || 'General',
      color: colors[colorIndex],
      initial: teacherData.instructor_name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
      isAvailable: true, // Assume all teachers are available for now
      todayLoad: this.calculateTodayLoad(teacherData.grid),
      weeklyLoad: teacherData.total_classes,
      classes: teacherData.sections,
    };
  }

  // Helper function to get the primary course for a teacher
  private getPrimaryCourse(classes: any[]): string {
    if (!classes || classes.length === 0) return 'General';
    
    const courseCount: Record<string, number> = {};
    classes.forEach(cls => {
      courseCount[cls.course] = (courseCount[cls.course] || 0) + 1;
    });
    
    // Return the course with the most classes
    return Object.keys(courseCount).reduce((a, b) => 
      courseCount[a] > courseCount[b] ? a : b
    );
  }

  // Calculate today's load from timetable grid
  private calculateTodayLoad(grid: Record<string, Record<string, any>>): number {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayPeriods = grid[today] || {};
    return Object.values(todayPeriods).filter(period => period !== null).length;
  }

  // Convert teacher timetable to Timetable format for a specific date
  convertToTimetable(teacherData: any, instructorId: string, date: string): Timetable {
    const periods: Period[] = [];
    const dayName = this.getDayNameFromDate(date);
    const dayPeriods = teacherData.grid[dayName] || {};

    let periodCounter = 1;
    Object.entries(dayPeriods).forEach(([periodKey, classData]) => {
      if (classData && classData !== null) {
        const startTime = this.getPeriodStartTime(periodKey);
        const endTime = this.getPeriodEndTime(periodKey);
        
        periods.push({
          id: `${instructorId}-${date}-${periodKey}`,
          periodNumber: periodCounter++,
          startTime: startTime,
          endTime: endTime,
          subject: classData.Course || 'Unknown Subject',
          className: classData.Students || 'Unknown Class',
          teacherId: instructorId,
          isSubstituted: false, // Default to not substituted
        });
      }
    });

    return {
      teacherId: instructorId,
      date: date,
      periods: periods
    };
  }

  // Helper function to get day name from date string
  private getDayNameFromDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  // Helper function to get period start time
  private getPeriodStartTime(periodKey: string): string {
    const periodMap: Record<string, string> = {
      'P1': '08:00',
      'P2': '09:00',
      'P3': '10:00',
      'P4': '11:00',
      'P5': '12:00',
      'P6': '13:00',
      'P7': '14:00',
      'P8': '15:00',
      'P9': '16:00',
      'P10': '17:00'
    };
    return periodMap[periodKey] || '08:00';
  }

  // Helper function to get period end time
  private getPeriodEndTime(periodKey: string): string {
    const periodMap: Record<string, string> = {
      'P1': '09:00',
      'P2': '10:00',
      'P3': '11:00',
      'P4': '12:00',
      'P5': '13:00',
      'P6': '14:00',
      'P7': '15:00',
      'P8': '16:00',
      'P9': '17:00',
      'P10': '18:00'
    };
    return periodMap[periodKey] || '09:00';
  }
}

export const substitutionService = new SubstitutionService();
