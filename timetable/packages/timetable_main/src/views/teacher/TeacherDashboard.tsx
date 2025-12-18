import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/shadcn-ui/Default-Ui/card';
import { Button } from 'src/components/shadcn-ui/Default-Ui/button';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useAuth } from 'src/context/AuthContext';
import { facultyService, type Faculty } from 'src/services/facultyService';
import { Calendar, ChevronLeft, ChevronRight, Download, MapPin, Maximize2, Minimize2, Users } from 'lucide-react';

type TeacherGrid = Record<string, Record<string, any>>;

type TeacherTimetableData = {
  instructor_id: string;
  instructor_name: string;
  grid: TeacherGrid;
  total_classes: number;
  courses: string[];
  sections: string[];
};

type TeacherTimetablesResponse = {
  teacher_timetables: Record<string, TeacherTimetableData>;
  metadata: {
    timetable_id: string;
    timetable_name: string;
    total_teachers: number;
    total_classes: number;
    generated_at: string;
  };
};

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [teacherTimetables, setTeacherTimetables] = useState<Record<string, TeacherTimetableData>>({});
  const [timetableLoading, setTimetableLoading] = useState(false);
  const [timetableError, setTimetableError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [subjectColorMap, setSubjectColorMap] = useState<Record<string, string>>({});

  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];
  const daysOrdered = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeToPeriodMap: Record<string, string> = {
    '8:00 AM': 'P1',
    '9:00 AM': 'P2',
    '10:00 AM': 'P3',
    '11:00 AM': 'P4',
    '12:00 PM': 'P5',
    '1:00 PM': 'P6',
    '2:00 PM': 'P7',
    '3:00 PM': 'P8',
    '4:00 PM': 'P9',
    '5:00 PM': 'P10',
    '6:00 PM': 'P10',
  };

  const currentTeacher = useMemo(() => {
    if (!user) return null;
    const myName = ((user.user_metadata as any)?.name || '').trim().toLowerCase();
    // Try to find exact name match first
    for (const t of Object.values(teacherTimetables)) {
      if (t.instructor_name.trim().toLowerCase() === myName) return t;
    }
    return null;
  }, [user, teacherTimetables]);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      // Map by email -> faculty row
      const all = await facultyService.searchFaculty(user.email);
      const match = all.find((f) => f.email?.toLowerCase() === user.email?.toLowerCase());
      if (!isMounted) return;
      setFaculty(match ?? null);
      setLoading(false);
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [user?.email]);

  useEffect(() => {
    const fetchTeacherTimetables = async () => {
      setTimetableLoading(true);
      setTimetableError(null);
      try {
        const res = await fetch('/api/teacher-timetables');
        if (!res.ok) throw new Error('Failed to fetch teacher timetables');
        const data: TeacherTimetablesResponse = await res.json();
        setTeacherTimetables(data.teacher_timetables);
      } catch (e) {
        setTimetableError(e instanceof Error ? e.message : 'Failed to load teacher timetables');
      } finally {
        setTimetableLoading(false);
      }
    };
    fetchTeacherTimetables();
  }, []);

  useEffect(() => {
    if (!currentTeacher) return;
    const courses = new Set(currentTeacher.courses);
    const colorPalette = [
      'bg-blue-100 border-blue-200 text-blue-800',
      'bg-green-100 border-green-200 text-green-800',
      'bg-purple-100 border-purple-200 text-purple-800',
      'bg-orange-100 border-orange-200 text-orange-800',
      'bg-pink-100 border-pink-200 text-pink-800',
      'bg-indigo-100 border-indigo-200 text-indigo-800',
      'bg-yellow-100 border-yellow-200 text-yellow-800',
      'bg-red-100 border-red-200 text-red-800',
      'bg-teal-100 border-teal-200 text-teal-800',
      'bg-cyan-100 border-cyan-200 text-cyan-800',
      'bg-emerald-100 border-emerald-200 text-emerald-800',
      'bg-lime-100 border-lime-200 text-lime-800',
      'bg-amber-100 border-amber-200 text-amber-800',
      'bg-rose-100 border-rose-200 text-rose-800',
      'bg-violet-100 border-violet-200 text-violet-800',
      'bg-sky-100 border-sky-200 text-sky-800',
      'bg-slate-100 border-slate-200 text-slate-800',
      'bg-stone-100 border-stone-200 text-stone-800',
      'bg-zinc-100 border-zinc-200 text-zinc-800',
      'bg-neutral-100 border-neutral-200 text-neutral-800',
    ];
    const map: Record<string, string> = {};
    Array.from(courses).forEach((c, i) => { map[c] = colorPalette[i % colorPalette.length]; });
    setSubjectColorMap(map);
  }, [currentTeacher]);

  const getEventForTimeSlot = (day: string, timeSlot: string) => {
    if (!currentTeacher) return null;
    const period = timeToPeriodMap[timeSlot];
    if (!period) return null;
    return currentTeacher.grid[day]?.[period] || null;
  };

  const getTodaysClasses = () => {
    if (!currentTeacher) return [];
    
    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = today.getHours() * 60 + today.getMinutes(); // Convert to minutes for comparison
    
    const timeSlotMap: Record<string, { time: string; minutes: number }> = {
      'P1': { time: '8:00 AM', minutes: 8 * 60 },
      'P2': { time: '9:00 AM', minutes: 9 * 60 },
      'P3': { time: '10:00 AM', minutes: 10 * 60 },
      'P4': { time: '11:00 AM', minutes: 11 * 60 },
      'P5': { time: '12:00 PM', minutes: 12 * 60 },
      'P6': { time: '1:00 PM', minutes: 13 * 60 },
      'P7': { time: '2:00 PM', minutes: 14 * 60 },
      'P8': { time: '3:00 PM', minutes: 15 * 60 },
      'P9': { time: '4:00 PM', minutes: 16 * 60 },
      'P10': { time: '5:00 PM', minutes: 17 * 60 },
    };

    const todaysClasses: Array<{
      id: string;
      subject: string;
      class: string;
      time: string;
      room: string;
      duration: string;
      period: string;
    }> = [];

    // Get today's classes from the teacher's grid
    const dayGrid = currentTeacher.grid[dayName];
    if (dayGrid) {
      Object.entries(dayGrid).forEach(([period, event]) => {
        if (event && event.Course) {
          const timeSlot = timeSlotMap[period];
          if (timeSlot) {
            todaysClasses.push({
              id: `${dayName}-${period}`,
              subject: event.Course,
              class: event.Section,
              time: timeSlot.time,
              room: event.Room,
              duration: '60 min',
              period: period
            });
          }
        }
      });
    }

    // Sort by time and filter upcoming classes (including current class)
    return todaysClasses
      .sort((a, b) => {
        const timeA = timeSlotMap[a.period]?.minutes || 0;
        const timeB = timeSlotMap[b.period]?.minutes || 0;
        return timeA - timeB;
      })
      .filter(cls => {
        const classTime = timeSlotMap[cls.period]?.minutes || 0;
        return classTime >= currentTime - 30; // Show classes starting within 30 minutes
      })
      .slice(0, 5); // Show max 5 upcoming classes
  };

  const upcomingClasses = getTodaysClasses();

  const exportTeacherTimetablePDF = () => {
    if (!currentTeacher) return;
    const styles = `
      <style>
        @page { size: A4 landscape; margin: 16mm; }
        body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, 'Apple Color Emoji','Segoe UI Emoji'; color: #111827; }
        .page { page-break-after: always; }
        .head { text-align: center; margin-bottom: 12px; }
        .title { font-weight: 700; font-size: 16px; }
        .subtitle { font-size: 12px; color: #374151; }
        .meta { font-size: 12px; margin-top: 4px; }
        table.grid { width: 100%; border-collapse: collapse; margin-top: 8px; table-layout: fixed; }
        th.time, th.day-header, th.day { border: 1px solid #E5E7EB; background: #F9FAFB; font-weight: 600; font-size: 11px; padding: 6px; }
        th.day { width: 9%; text-align: left; }
        th.time { text-align: center; }
        td.cell { border: 1px solid #E5E7EB; height: 60px; padding: 6px; font-size: 11px; vertical-align: top; }
        td.filled { background: #F3F4F6; border-width: 2px; }
        .cell-title { font-weight: 600; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cell-sub { color: #4B5563; font-size: 10px; line-height: 1.1; }
        .legend { display: flex; gap: 16px; font-size: 10px; color: #4B5563; margin-top: 8px; }
        .dot { display: inline-block; width: 8px; height: 8px; background: #E5E7EB; border: 1px solid #D1D5DB; border-radius: 999px; margin-right: 6px; }
        .dot.lab { background: #DBEAFE; border-color: #BFDBFE; }
      </style>
    `;
    const buildTeacherTimetableHTML = () => {
      const timeSlots = [
        '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
      ];
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      const getEvent = (day: string, timeSlot: string) => {
        const dayKey = day;
        const period = timeToPeriodMap[timeSlot];
        return currentTeacher.grid?.[dayKey]?.[period] || null;
      };
      const buildRow = (day: string) => {
        const cells = timeSlots.map((t) => {
          const ev = getEvent(day, t);
          if (ev) {
            return `<td class="cell filled">
              <div class="cell-title">${ev.Course}</div>
              <div class="cell-sub">${ev.Part || ''}</div>
              <div class="cell-sub">${ev.Section}</div>
              <div class="cell-sub">${ev.Room}</div>
            </td>`;
          }
          return '<td class="cell"></td>';
        }).join('');
        return `<tr><th class="day-header">${day}</th>${cells}</tr>`;
      };
      const headerRow = `<tr><th class="day-header">Day</th>${timeSlots.map(t => `<th class="time">${t}</th>`).join('')}</tr>`;
      const rows = days.map(buildRow).join('');
      const legend = Object.keys(subjectColorMap).map(course => `<span><span class="dot"></span>${course}</span>`).join('');
      return `
        <section class="page">
          <div class="head">
            <div class="title">My Teacher Timetable</div>
            <div class="subtitle">${currentTeacher.instructor_name}</div>
            <div class="meta">${currentTeacher.courses.length} courses • ${currentTeacher.sections.length} sections • ${currentTeacher.total_classes} classes/week</div>
          </div>
          <table class="grid">
            ${headerRow}
            ${rows}
          </table>
          ${legend ? `<div class="legend">${legend}</div>` : ''}
        </section>
      `;
    };
    const html = `<!doctype html><html><head><meta charset="utf-8">${styles}</head><body>${buildTeacherTimetableHTML()}</body></html>`;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    setTimeout(() => { try { w.focus(); w.print(); } catch {} }, 200);
  };
  const stats = [
    { 
      title: 'Total Classes/Week', 
      value: currentTeacher ? currentTeacher.total_classes.toString() : '0', 
      icon: 'solar:book-2-line-duotone', 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50', 
      change: currentTeacher ? `${currentTeacher.courses.length} courses` : 'No data', 
      changeType: 'positive' 
    },
    { 
      title: 'Active Courses', 
      value: currentTeacher ? currentTeacher.courses.length.toString() : '0', 
      icon: 'solar:document-text-line-duotone', 
      color: 'text-green-600', 
      bgColor: 'bg-green-50', 
      change: currentTeacher ? `${currentTeacher.sections.length} sections` : 'No data', 
      changeType: 'positive' 
    },
    { 
      title: 'Today\'s Classes', 
      value: upcomingClasses.length.toString(), 
      icon: 'solar:calendar-mark-line-duotone', 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-50', 
      change: upcomingClasses.length > 0 ? 'Upcoming' : 'None', 
      changeType: upcomingClasses.length > 0 ? 'positive' : 'negative' 
    },
    { 
      title: 'Total Sections', 
      value: currentTeacher ? currentTeacher.sections.length.toString() : '0', 
      icon: 'solar:users-group-rounded-line-duotone', 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-50', 
      change: currentTeacher ? 'Active' : 'No data', 
      changeType: 'positive' 
    },
  ];

  const recentActivities = [
    { id: 1, type: 'assignment', title: 'Math Assignment #3 submitted by John Doe', time: '2 minutes ago', icon: 'solar:document-text-line-duotone', color: 'text-blue-600' },
    { id: 2, type: 'grade', title: 'Science Quiz graded for Class 7A', time: '15 minutes ago', icon: 'solar:medal-star-line-duotone', color: 'text-green-600' },
    { id: 3, type: 'message', title: 'New message from Sarah Wilson', time: '1 hour ago', icon: 'solar:chat-round-line-duotone', color: 'text-purple-600' },
    { id: 4, type: 'attendance', title: 'Attendance marked for Class 8B', time: '2 hours ago', icon: 'solar:users-group-rounded-line-duotone', color: 'text-orange-600' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teacher Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {loading ? 'Loading profile...' : faculty ? `Welcome back, ${faculty.name}!` : 
              user?.user_metadata?.name || 
              (user?.user_metadata?.first_name && user?.user_metadata?.last_name ? 
                `${user.user_metadata.first_name} ${user.user_metadata.last_name}` : 
                user?.email?.split('@')[0]) || 'User'}
          </p>
          {!loading && faculty && (
            <div className="mt-2 flex gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span>{faculty.designation}</span>
              <span>•</span>
              <span>{faculty.department}</span>
              {faculty.specialization && (
                <>
                  <span>•</span>
                  <span>{faculty.specialization}</span>
                </>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={() => window.location.reload()} disabled={timetableLoading}>
            <Calendar className={`w-5 h-5 inline mr-2 ${timetableLoading ? 'animate-spin' : ''}`} />
            {timetableLoading ? 'Loading...' : 'Refresh Timetable'}
          </Button>
          <Button onClick={exportTeacherTimetablePDF} disabled={!currentTeacher}>
            <Download className="w-5 h-5 inline mr-2" />
            Export PDF
          </Button>
          <Button>
            <Icon icon="solar:add-circle-line-duotone" className="w-5 h-5 inline mr-2" />
            New Assignment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>{stat.change} from last month</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon icon={stat.icon} className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700`}>
                  <Icon icon={activity.icon} className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Today's Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingClasses.length > 0 ? (
              upcomingClasses.map((classItem) => (
                <div key={classItem.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <Icon icon="solar:book-2-line-duotone" className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{classItem.subject}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{classItem.class} • {classItem.room}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">{classItem.time}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{classItem.duration}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                <Calendar className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-lg font-medium mb-1">No upcoming classes today</p>
                <p className="text-sm text-center">
                  {currentTeacher 
                    ? "You have no classes scheduled for the rest of today."
                    : "Your timetable is not available yet."
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Teacher Timetable Section */}
      {timetableError && !timetableLoading && (
        <Card className="border-0 shadow-sm bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">Unable to load your timetable</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{timetableError}</p>
          </CardContent>
        </Card>
      )}

      {currentTeacher ? (
        <Card className={`border-0 shadow-sm ${isFullscreen ? 'fixed inset-0 z-50 m-4' : ''}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                My Timetable
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  {isFullscreen ? 'Exit' : 'Fullscreen'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{currentTeacher.courses.length} courses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{currentTeacher.total_classes} classes/week</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCurrentWeek(new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000))}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Week of {currentWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </h3>
                  <button
                    onClick={() => setCurrentWeek(new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000))}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[1000px]">
                <div className="grid grid-cols-12 border-b border-gray-200 bg-gray-50">
                  <div className="p-4 text-sm font-medium text-gray-500 border-r border-gray-200">Day</div>
                  {timeSlots.map((timeSlot) => (
                    <div key={timeSlot} className="p-4 text-sm font-medium text-gray-700 text-center border-r border-gray-200 last:border-r-0">
                      <div>{timeSlot}</div>
                    </div>
                  ))}
                </div>
                <div className="divide-y divide-gray-200">
                  {daysOrdered.map((day) => {
                    const cells: React.ReactNode[] = [];
                    for (let i = 0; i < timeSlots.length; ) {
                      const timeSlot = timeSlots[i];
                      const event = getEventForTimeSlot(day, timeSlot);
                      if (event) {
                        let span = 1;
                        for (let j = i + 1; j < timeSlots.length; j++) {
                          const nextEvent = getEventForTimeSlot(day, timeSlots[j]);
                          if (nextEvent && 
                              event.Course === nextEvent.Course &&
                              event.Part === nextEvent.Part &&
                              event.Section === nextEvent.Section &&
                              event.Room === nextEvent.Room) {
                            span += 1;
                          } else {
                            break;
                          }
                        }
                        cells.push(
                          <div
                            key={`${day}-${timeSlot}`}
                            className="p-2 border-r border-gray-200 last:border-r-0 relative"
                            style={{ gridColumn: `span ${span} / span ${span}` }}
                          >
                            <div className={`p-3 rounded-lg border-2 ${subjectColorMap[event.Course] || 'bg-gray-100 border-gray-200 text-gray-800'} h-full flex flex-col justify-between`}>
                              <div>
                                <div className="font-semibold text-sm mb-1 truncate">{event.Course}</div>
                                {event.Part && <div className="text-xs opacity-75 mb-1">{event.Part}</div>}
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-xs">
                                  <Users className="h-3 w-3" />
                                  <span className="truncate">{event.Section}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate">{event.Room}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                        i += span;
                      } else {
                        cells.push(
                          <div key={`${day}-${timeSlot}`} className="p-2 border-r border-gray-200 last:border-r-0 relative">
                            <div className="p-3 rounded-lg border-2 border-gray-200 bg-gray-50 h-full"></div>
                          </div>
                        );
                        i += 1;
                      }
                    }
                    return (
                      <div key={day} className="grid grid-cols-12 min-h-[80px]">
                        <div className="p-4 border-r border-gray-200 bg-gray-50 flex items-center">
                          <div className="text-sm font-medium text-gray-700">{day}</div>
                        </div>
                        {cells}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        !timetableLoading && (
          <Card className="border-0 shadow-sm bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">No timetable found for your account yet.</span>
              </div>
              <p className="text-yellow-800 text-sm mt-1">Ensure your Supabase profile name matches the instructor name in the timetable.</p>
            </CardContent>
          </Card>
        )
      )}

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <button className="flex flex-col items-center p-6 rounded-xl bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors">
              <Icon icon="solar:document-add-line-duotone" className="w-8 h-8 text-blue-600 mb-2" />
              <span className="font-medium text-gray-900 dark:text-white">Create Assignment</span>
            </button>
            <button className="flex flex-col items-center p-6 rounded-xl bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800 transition-colors">
              <Icon icon="solar:users-group-rounded-line-duotone" className="w-8 h-8 text-green-600 mb-2" />
              <span className="font-medium text-gray-900 dark:text-white">Mark Attendance</span>
            </button>
            <button className="flex flex-col items-center p-6 rounded-xl bg-purple-50 dark:bg-purple-900 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors">
              <Icon icon="solar:medal-star-line-duotone" className="w-8 h-8 text-purple-600 mb-2" />
              <span className="font-medium text-gray-900 dark:text-white">Grade Assignments</span>
            </button>
            <button className="flex flex-col items-center p-6 rounded-xl bg-orange-50 dark:bg-orange-900 hover:bg-orange-100 dark:hover:bg-orange-800 transition-colors">
              <Icon icon="solar:chat-round-line-duotone" className="w-8 h-8 text-orange-600 mb-2" />
              <span className="font-medium text-gray-900 dark:text-white">Send Message</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherDashboard;


