export interface Teacher {
  id: string;
  name: string;
  initial: string;
  subject: string;
  color: string;
  isAvailable: boolean;
  todayLoad: number;
  weeklyLoad: number;
  classes: string[];
}

export interface Period {
  id: string;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: string;
  className: string;
  teacherId: string;
  isSubstituted: boolean;
  substituteTeacherId?: string;
}

export interface Timetable {
  teacherId: string;
  date: string;
  periods: Period[];
}

export interface SubstituteRecommendation {
  teacher: Teacher;
  matchScore: number;
  reason: string;
  conflicts: string[];
}

export interface SubstitutionRequest {
  originalTeacherId: string;
  date: string;
  periodIds: string[];
  substituteTeacherId: string;
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
}
