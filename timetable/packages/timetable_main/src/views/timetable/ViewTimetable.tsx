import React, { useState, useEffect } from 'react';
import CardBox from 'src/components/shared/CardBox';
import TimetableCalendar from 'src/components/timetable/TimetableCalendar';
import { Button, Select } from 'flowbite-react';
import { RefreshCw, Upload, Calendar, Download, Users, User, BookOpen, MapPin, Clock, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

interface TimetableData {
  sections: Record<string, { grid: Record<string, Record<string, any>> }>;
  raw?: any[];
  log?: string;
}

interface TeacherTimetableData {
  instructor_id: string;
  instructor_name: string;
  grid: Record<string, Record<string, any>>;
  total_classes: number;
  courses: string[];
  sections: string[];
}

interface TeacherTimetablesResponse {
  teacher_timetables: Record<string, TeacherTimetableData>;
  metadata: {
    timetable_id: string;
    timetable_name: string;
    total_teachers: number;
    total_classes: number;
    generated_at: string;
  };
}

const ViewTimetable: React.FC = () => {
  const [timetableData, setTimetableData] = useState<TimetableData | null>(null);
  const [teacherTimetables, setTeacherTimetables] = useState<Record<string, TeacherTimetableData>>({});
  const [teacherMetadata, setTeacherMetadata] = useState<TeacherTimetablesResponse['metadata'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'localStorage' | 'database' | 'none'>('none');
  const [viewMode, setViewMode] = useState<'student' | 'teacher'>('student');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [subjectColorMap, setSubjectColorMap] = useState<Record<string, string>>({});
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fetch timetable data on component mount - prioritize database over localStorage
  useEffect(() => {
    const loadTimetableData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First, try to fetch from database
        const response = await fetch('/api/latest-timetable');
        
        if (response.ok) {
          const data = await response.json();
          setTimetableData(data);
          setDataSource('database');
          localStorage.setItem('timetableData', JSON.stringify(data));
          console.log('🗄️ Timetable loaded from database');
        } else {
          throw new Error('No timetable data available from database');
        }
      } catch (err) {
        console.log('Database fetch failed, trying localStorage:', err);
        
        // Fallback to localStorage if database fetch fails
        const savedData = localStorage.getItem('timetableData');
        if (savedData) {
          try {
            setTimetableData(JSON.parse(savedData));
            setDataSource('localStorage');
            console.log('📱 Timetable loaded from localStorage (fallback)');
          } catch (e) {
            console.error('Failed to parse saved timetable data:', e);
            setDataSource('none');
            setError('No timetable data found. Please generate a timetable first.');
          }
        } else {
          setDataSource('none');
          setError('No timetable data found. Please generate a timetable first.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadTimetableData();
  }, []);

  // Fetch teacher timetables when view mode changes to teacher
  useEffect(() => {
    if (viewMode === 'teacher') {
      fetchTeacherTimetables();
    }
  }, [viewMode]);

  const fetchLatestTimetable = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to fetch the latest generated timetable from the backend
      const response = await fetch('/api/latest-timetable');
      
      if (response.ok) {
        const data = await response.json();
        setTimetableData(data);
        setDataSource('database');
        localStorage.setItem('timetableData', JSON.stringify(data));
        console.log('🗄️ Timetable loaded from database');
      } else {
        throw new Error('No timetable data available');
      }
    } catch (err) {
      setError('No timetable data found. Please generate a timetable first.');
      console.error('Failed to fetch timetable:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherTimetables = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/teacher-timetables');
      
      if (!response.ok) {
        throw new Error('Failed to fetch teacher timetables');
      }
      
      const data: TeacherTimetablesResponse = await response.json();
      setTeacherTimetables(data.teacher_timetables);
      setTeacherMetadata(data.metadata);
      
      // Auto-select first teacher if none selected
      if (!selectedTeacher && Object.keys(data.teacher_timetables).length > 0) {
        setSelectedTeacher(Object.keys(data.teacher_timetables)[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load teacher timetables');
      console.error('Error fetching teacher timetables:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadTimetable = () => {
    if (!timetableData) return;
    
    // Create CSV content
    const csvContent = generateCSVContent(timetableData);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timetable_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const generateCSVContent = (data: TimetableData): string => {
    if (!data.raw || data.raw.length === 0) return '';
    
    const headers = Object.keys(data.raw[0]);
    const csvRows = [
      headers.join(','),
      ...data.raw.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ];
    
    return csvRows.join('\n');
  };

  // Time slots from 8 AM to 6 PM (same as student timetable)
  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  const daysOrdered = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Map time slots to periods
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
    '6:00 PM': 'P10' // Last period extends to 6 PM
  };

  const currentTeacher = selectedTeacher ? teacherTimetables[selectedTeacher] : null;

  // Generate color map for teacher's courses
  useEffect(() => {
    if (!currentTeacher) return;
    
    const courses = new Set(currentTeacher.courses);
    
    // Same color palette as student timetable
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

    const newColorMap: Record<string, string> = {};
    const courseArray = Array.from(courses);
    
    // Assign colors to courses ensuring uniqueness
    courseArray.forEach((course, index) => {
      newColorMap[course] = colorPalette[index % colorPalette.length];
    });

    setSubjectColorMap(newColorMap);
  }, [currentTeacher]);

  const getEventColor = (course: string) => {
    // Use the pre-generated unique color map for this course
    if (subjectColorMap[course]) {
      return subjectColorMap[course];
    }
    
    // Fallback color if course not found in map
    return 'bg-gray-100 border-gray-200 text-gray-800';
  };

  // PDF Export function for teacher timetable
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

      const getEventForTimeSlot = (day: string, timeSlot: string) => {
        const dayKey = day.toLowerCase();
        const timeKey = timeSlot.toLowerCase().replace(' ', '_');
        return currentTeacher?.grid?.[dayKey]?.[timeKey] || null;
      };

      const buildRow = (day: string) => {
        const cells = timeSlots.map(timeSlot => {
          const event = getEventForTimeSlot(day, timeSlot);
          if (event) {
            return `<td class="cell filled">
              <div class="cell-title">${event.Course}</div>
              <div class="cell-sub">${event.Part || ''}</div>
              <div class="cell-sub">${event.Section}</div>
              <div class="cell-sub">${event.Room}</div>
            </td>`;
          }
          return '<td class="cell"></td>';
        }).join('');
        return `<tr><th class="day-header">${day}</th>${cells}</tr>`;
      };

      const headerRow = `<tr><th class="day-header">Day</th>${timeSlots.map(t => `<th class="time">${t}</th>`).join('')}</tr>`;
      const rows = days.map(buildRow).join('');
      
      const legend = Object.keys(subjectColorMap).map(course => 
        `<span><span class="dot"></span>${course}</span>`
      ).join('');

      return `
        <section class="page">
          <div class="head">
            <div class="title">Teacher Timetable</div>
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
    // Give the browser a tick to render before printing
    setTimeout(() => { try { w.focus(); w.print(); } catch {} }, 200);
  };

  const getEventForTimeSlot = (day: string, timeSlot: string) => {
    if (!currentTeacher) return null;

    const period = timeToPeriodMap[timeSlot];
    if (!period) return null;

    return currentTeacher.grid[day]?.[period] || null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <CardBox className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Timetable View</h1>
            <p className="text-gray-600">
              View and manage your generated timetables in a beautiful calendar format
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* View Mode Selection */}
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <Select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as 'student' | 'teacher')}
                className="w-48"
              >
                <option value="student">Student Timetables</option>
                <option value="teacher">Teacher Timetables</option>
              </Select>
            </div>
            
            <div className="flex gap-3">
              <Button
                color="light"
                onClick={viewMode === 'student' ? fetchLatestTimetable : fetchTeacherTimetables}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
              
              {timetableData && viewMode === 'student' && (
                <Button
                  color="primary"
                  onClick={downloadTimetable}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download CSV
                </Button>
              )}
              
              <Button
                color="purple"
                onClick={() => window.location.href = '/timetable/generate'}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Generate New
              </Button>
            </div>
          </div>
        </div>
      </CardBox>


      {/* Loading State */}
      {loading && (
        <CardBox className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-2 text-blue-700">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span className="font-medium">Loading Timetable Data...</span>
          </div>
          <p className="text-blue-600 text-sm mt-1">Fetching latest timetable from database</p>
        </CardBox>
      )}

      {/* Status Messages */}
      {error && !loading && (
        <CardBox className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-2 text-red-700">
            <Calendar className="h-5 w-5" />
            <span className="font-medium">No Timetable Data</span>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <Button
            color="primary"
            size="sm"
            onClick={() => window.location.href = '/timetable/generate'}
            className="mt-3"
          >
            Go to Generate Timetable
          </Button>
        </CardBox>
      )}


      {/* Teacher Timetable Display */}
      {viewMode === 'teacher' && !loading && Object.keys(teacherTimetables).length > 0 && (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${isFullscreen ? 'fixed inset-0 z-50 m-4' : ''}`}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Teacher Timetable</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {currentTeacher ? `${currentTeacher.instructor_name}` : 'Select a teacher to view their timetable'}
                </p>
              </div>
              
              {/* Teacher Selector */}
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-500" />
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a teacher</option>
                  {Object.entries(teacherTimetables).map(([teacherId, teacher]) => (
                    <option key={teacherId} value={teacherId}>
                      {teacher.instructor_name} ({teacher.total_classes} classes)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Teacher Info */}
          {currentTeacher && (
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{currentTeacher.courses.length} courses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{currentTeacher.sections.length} sections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{currentTeacher.total_classes} classes/week</span>
                  </div>
                </div>
                
                {/* Week Navigation */}
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
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentWeek(new Date())}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Today
                  </button>
                  <button
                    onClick={exportTeacherTimetablePDF}
                    className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium flex items-center gap-2"
                    title="Export PDF"
                  >
                    <Download className="h-4 w-4" />
                    Export PDF
                  </button>
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium flex items-center gap-2"
                    title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    {isFullscreen ? 'Exit' : 'Fullscreen'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Timetable Grid or No Selection Message */}
          {currentTeacher ? (
            <div className="overflow-x-auto">
              <div className="min-w-[1000px]">
                {/* Hours Header (Columns) */}
                <div className="grid grid-cols-12 border-b border-gray-200 bg-gray-50">
                  <div className="p-4 text-sm font-medium text-gray-500 border-r border-gray-200">
                    Day
                  </div>
                  {timeSlots.map((timeSlot) => (
                    <div key={timeSlot} className="p-4 text-sm font-medium text-gray-700 text-center border-r border-gray-200 last:border-r-0">
                      <div>{timeSlot}</div>
                    </div>
                  ))}
                </div>

                {/* Rows per Day; Columns per Hour */}
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
                            <div className={`p-3 rounded-lg border-2 ${getEventColor(event.Course)} h-full flex flex-col justify-between`}>
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
                        {/* Day Label Column */}
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
          ) : (
            <div className="flex flex-col items-center justify-center h-96 bg-gray-50">
              <User className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Teacher</h3>
              <p className="text-sm text-gray-500 text-center max-w-md">
                Choose a teacher from the dropdown above to view their individual timetable.
              </p>
            </div>
          )}

          {/* Subject Color Legend */}
          {Object.keys(subjectColorMap).length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Subject Colors</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(subjectColorMap).map(([subject, colorClass]) => (
                    <div key={subject} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded border ${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]}`}></div>
                      <span className="text-xs text-gray-600">{subject}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* General Legend */}
              <div className="flex items-center gap-6 text-xs text-gray-600 pt-2 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Section</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Room</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Course</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Time Slot</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Student Timetable Calendar */}
      {viewMode === 'student' && !loading && timetableData && <TimetableCalendar data={timetableData} />}

      {/* Additional Info for Student View */}
      {viewMode === 'student' && !loading && timetableData && (
        <CardBox className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Timetable Information</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Sections:</strong> {Object.keys(timetableData.sections).length}</p>
                <p><strong>Total Classes:</strong> {timetableData.raw?.length || 0}</p>
                <p><strong>Time Range:</strong> 8:00 AM - 6:00 PM</p>
                <p><strong>Days:</strong> Monday - Friday</p>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  dataSource === 'database' ? 'bg-green-100 text-green-800' : 
                  dataSource === 'localStorage' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {dataSource === 'database' ? '🗄️ Database' : 
                   dataSource === 'localStorage' ? '📱 Local Storage' : 
                   '❌ No Data'}
                </span>
              </div>
            </div>
          </div>
        </CardBox>
      )}

      {/* Additional Info for Teacher View */}
      {viewMode === 'teacher' && !loading && teacherMetadata && (
        <CardBox className="p-4 bg-green-50 border-green-200">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-900 mb-1">Teacher Timetable Information</h3>
              <div className="text-sm text-green-800 space-y-1">
                <p><strong>Total Teachers:</strong> {teacherMetadata.total_teachers}</p>
                <p><strong>Total Classes:</strong> {teacherMetadata.total_classes}</p>
                <p><strong>Timetable:</strong> {teacherMetadata.timetable_name}</p>
                <p><strong>Generated:</strong> {new Date(teacherMetadata.generated_at).toLocaleDateString()}</p>
                <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                  🗄️ Database
                </span>
              </div>
            </div>
          </div>
        </CardBox>
      )}
    </div>
  );
};

export default ViewTimetable;