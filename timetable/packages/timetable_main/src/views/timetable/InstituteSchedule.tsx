import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '../../components/shadcn-ui/Default-Ui/button';
import { Badge } from '../../components/shadcn-ui/Default-Ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  RefreshCw, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  ChevronUp,
  BookOpen,
  GraduationCap,
  User
} from 'lucide-react';

interface ScheduleData {
  class: string;
  periods: {
    [key: string]: {
      teachers: string[];
      subject: string;
      type?: string;
    } | null;
  };
}

interface TeacherScheduleData {
  teacher: string;
  periods: {
    [key: string]: {
      class: string;
      subject: string;
      type?: string;
    } | null;
  };
}

const InstituteSchedule: React.FC = () => {
  const [viewBy, setViewBy] = useState<'classes' | 'teachers'>('classes');
  const [dateStr, setDateStr] = useState<string>('2025-09-08');
  const [classGrid, setClassGrid] = useState<Record<string, any> | null>(null);
  const [teacherGrid, setTeacherGrid] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = ((import.meta as any).env?.VITE_BACKEND_URL || (import.meta as any).env?.VITE_TIMETABLE_API || '').replace(/\/$/, '');

  const dayFromDate = (isoDate: string) => {
    const d = new Date(isoDate);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[d.getDay()];
  };

  const formatClassName = (className: string) => {
    // Remove duplicate section information (e.g., BIO_TECHNOLOGY_SEC-1__SEC-1 → BIO_TECHNOLOGY_SEC-1)
    return className.replace(/__SEC-\d+$/, '');
  };

  const selectedDay = useMemo(() => dayFromDate(dateStr), [dateStr]);

  useEffect(() => {
    let isCancelled = false;
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const [classesRes, teacherRes] = await Promise.all([
          fetch(`${API_BASE}/api/latest-timetable`).then((r) => r.json()),
          fetch(`${API_BASE}/api/teacher-timetables`).then((r) => r.json())
        ]);

        if (isCancelled) return;

        // classesRes.sections is an object: { [sectionName]: { grid: { [Day]: { [P]: row|null } } } }
        setClassGrid(classesRes?.sections || null);

        // teacherRes.teacher_timetables is an object keyed by instructor_id with grid similar shape
        setTeacherGrid(teacherRes?.teacher_timetables || null);
      } catch (e: any) {
        if (!isCancelled) setError(e?.message || 'Failed to load timetable');
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { isCancelled = true; };
  }, [API_BASE]);

  const periods = [
    { id: 'P1', time: '10:00-11:00' },
    { id: 'P2', time: '11:00-12:00' },
    { id: 'P3', time: '12:00-13:00' },
    { id: 'P4', time: '13:00-14:00' },
    { id: 'P5', time: '14:00-15:00' },
    { id: 'P6', time: '15:00-16:00' },
    { id: 'P7', time: '16:00-17:00' },
    { id: 'P8', time: '17:00-18:00' },
    { id: 'P9', time: '18:00-19:00' },
    { id: 'P10', time: '19:00-20:00' }
  ];

  // Transform DB payloads into UI-friendly arrays without changing the UI
  const scheduleData: ScheduleData[] = useMemo(() => {
    if (!classGrid) return [];
    const out: ScheduleData[] = [];
    const entries = Object.entries(classGrid) as [string, any][];
    for (const [sectionName, value] of entries) {
      const gridForDay = value?.grid?.[selectedDay] || {};
      const periodsMap: Record<string, { teachers: string[]; subject: string; type?: string } | null> = {};
      for (const p of periods) {
        const cell = gridForDay?.[p.id] || null;
        if (cell) {
          const subject = cell['Course'] || '';
          const instructorField = cell['Instructor'] || cell['Instructor Name'] || '';
          const teachers = typeof instructorField === 'string' ? instructorField.split(/,\s*/).filter(Boolean) : [];
          const type = subject.toLowerCase().includes('lab') ? 'LAB' : undefined;
          periodsMap[p.id] = { teachers, subject, type };
        } else {
          periodsMap[p.id] = null;
        }
      }
      out.push({ class: sectionName, periods: periodsMap });
    }
    // Stable sorting like screenshot (A..)
    out.sort((a, b) => a.class.localeCompare(b.class));
    return out;
  }, [classGrid, selectedDay]);

  const teacherScheduleData: TeacherScheduleData[] = useMemo(() => {
    if (!teacherGrid) return [];
    const out: TeacherScheduleData[] = [];
    const entries = Object.entries(teacherGrid) as [string, any][];
    for (const [, teacher] of entries) {
      const teacherName = teacher?.instructor_id || teacher?.instructor_name || '';
      const gridForDay = teacher?.grid?.[selectedDay] || {};
      const periodsMap: Record<string, { class: string; subject: string; type?: string } | null> = {};
      for (const p of periods) {
        const cell = gridForDay?.[p.id] || null;
        if (cell) {
          const subject = cell['Course'] || '';
          const cls = cell['Section'] || cell['Students'] || '';
          const type = subject.toLowerCase().includes('lab') ? 'LAB' : undefined;
          periodsMap[p.id] = { class: cls, subject, type };
        } else {
          periodsMap[p.id] = null;
        }
      }
      out.push({ teacher: teacherName, periods: periodsMap });
    }
    // Sort by teacher identifier
    out.sort((a, b) => a.teacher.localeCompare(b.teacher));
    return out;
  }, [teacherGrid, selectedDay]);

  // Summary metrics (derived from selected day)
  const summary = useMemo(() => {
    if (!classGrid) {
      return { activeTimetables: 0, totalLessons: 0, activeClasses: 0 };
    }
    let totalLessons = 0;
    let activeClasses = 0;
    const entries = Object.entries(classGrid) as [string, any][];
    for (const [, value] of entries) {
      const gridForDay = value?.grid?.[selectedDay] || {};
      let classHasLesson = false;
      for (const p of periods) {
        const cell = gridForDay?.[p.id] || null;
        if (cell) {
          totalLessons += 1;
          classHasLesson = true;
        }
      }
      if (classHasLesson) activeClasses += 1;
    }
    return { activeTimetables: 1, totalLessons, activeClasses };
  }, [classGrid, selectedDay]);


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Institute Schedule</h1>
              <p className="text-gray-600 mt-1">View schedules across 1 active timetable</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                <BookOpen className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Timetables</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.activeTimetables}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Lessons</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.totalLessons}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg mr-3">
                <Users className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Substitutes</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Classes</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.activeClasses}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>
                <input 
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-200 shadow-sm hover:border-slate-400" 
                  type="date" 
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                />
              </div>
              <Button variant="ghost" size="sm" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </Button>
              <Button className="px-3 py-2 text-sm bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                Today
              </Button>
              <Button className="px-3 py-2 text-sm bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                Tomorrow
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">View by:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <Button 
                    className={`px-3 py-2 text-sm flex items-center rounded-md transition-all duration-200 ${
                      viewBy === 'classes' 
                        ? 'bg-white text-indigo-700 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setViewBy('classes')}
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Classes
                  </Button>
                  <Button 
                    className={`px-3 py-2 text-sm flex items-center rounded-md transition-all duration-200 ${
                      viewBy === 'teachers' 
                        ? 'bg-white text-indigo-700 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setViewBy('teachers')}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Teachers
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200 cursor-pointer hover:from-indigo-100 hover:to-blue-100 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-indigo-600 mr-3" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">TIME TABLE</h2>
                    <p className="text-sm text-gray-600">19 lessons •7 classes active</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 mb-1">Schedule for {new Date(dateStr).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Academic Day: <span className="font-medium ml-1">Monday</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Viewing by {viewBy === 'classes' ? 'Classes' : 'Teachers'}</div>
                      <div className="text-lg font-medium text-gray-900">
                        {viewBy === 'classes' ? `${scheduleData.length} Classes` : `${teacherScheduleData.length} Teachers`}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{minWidth: '220px'}}>
                          <div className="flex items-center">
                            {viewBy === 'classes' ? (
                              <>
                                <GraduationCap className="h-4 w-4 mr-2" />
                                Class
                              </>
                            ) : (
                              <>
                                <User className="h-4 w-4 mr-2" />
                                Teacher
                              </>
                            )}
                          </div>
                        </th>
                        {periods.map((period) => (
                          <th key={period.id} scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{minWidth: '110px'}}>
                            <div className="text-xs font-medium">{period.id}</div>
                            <div className="text-xs font-normal text-gray-400 mt-0.5">{period.time}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loading ? (
                        <tr>
                          <td colSpan={1 + periods.length} className="px-4 py-6 text-center text-gray-500">Loading...</td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan={1 + periods.length} className="px-4 py-6 text-center text-red-600">{error}</td>
                        </tr>
                      ) : viewBy === 'classes' ? (
                        // Classes view
                        scheduleData.map((row, index) => (
                          <tr key={row.class} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                            <td className="sticky left-0 z-10 bg-white px-4 py-3 border-r border-gray-200">
                              <div className="flex items-center">
                                <div className="p-1.5 bg-blue-100 rounded-lg mr-2">
                                  <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
                                </div>
                                <div className="font-medium text-gray-900 truncate text-sm">{formatClassName(row.class)}</div>
                              </div>
                            </td>
                            {periods.map((period) => {
                              const schedule = row.periods[period.id];
                              return (
                                <td key={period.id} className="px-2 py-3 relative border-r border-gray-200">
                                  {schedule ? (
                                    <div className="p-2 border-2 rounded-lg text-xs transition-all duration-200 cursor-pointer bg-white border-gray-200 shadow-sm w-full min-h-[68px] flex flex-col justify-center relative overflow-hidden">
                                      <div className="font-medium text-gray-900 truncate w-full text-center mb-1 text-xs">
                                        {schedule.teachers.join(', ')}
                                      </div>
                                      <div className="text-[11px] text-gray-700 flex items-center justify-center w-full mb-1">
                                        <Users className="h-2.5 w-2.5 mr-1 flex-shrink-0 text-gray-500" />
                                        <span className="truncate font-medium">{schedule.subject}</span>
                                      </div>
                                      {schedule.type && (
                                        <Badge variant="secondary" className="mt-1 text-xs">
                                          {schedule.type}
                                        </Badge>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="text-center text-gray-300 py-3">
                                      <span className="text-lg">—</span>
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))
                      ) : (
                        // Teachers view
                        teacherScheduleData.map((row, index) => (
                          <tr key={row.teacher} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                            <td className="sticky left-0 z-10 bg-white px-4 py-3 border-r border-gray-200">
                              <div className="flex items-center">
                                <div className="p-1.5 bg-purple-100 rounded-lg mr-2">
                                  <User className="h-3.5 w-3.5 text-purple-600" />
                                </div>
                                <div className="font-medium text-gray-900 truncate text-sm">{row.teacher}</div>
                              </div>
                            </td>
                            {periods.map((period) => {
                              const schedule = row.periods[period.id];
                              return (
                                <td key={period.id} className="px-2 py-3 relative border-r border-gray-200">
                                  {schedule ? (
                                    <div className="p-2 border-2 rounded-lg text-xs transition-all duration-200 cursor-pointer bg-white border-gray-200 shadow-sm w-full min-h-[68px] flex flex-col justify-center relative overflow-hidden hover:border-purple-300 hover:shadow-md">
                                      <div className="font-medium text-gray-900 truncate w-full text-center mb-1 text-xs">
                                        {schedule.class}
                                      </div>
                                      <div className="text-[11px] text-gray-700 flex items-center justify-center w-full mb-1">
                                        <GraduationCap className="h-2.5 w-2.5 mr-1 flex-shrink-0 text-gray-500" />
                                        <span className="truncate font-medium">{schedule.subject}</span>
                                      </div>
                                      {schedule.type && (
                                        <Badge variant="secondary" className="mt-1 text-xs">
                                          {schedule.type}
                                        </Badge>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="text-center text-gray-300 py-3">
                                      <span className="text-lg">—</span>
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstituteSchedule;
