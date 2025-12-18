import React, { useState, useEffect, useRef } from 'react';
import { Building, Clock, Users, BookOpen, MapPin, ChevronLeft, ChevronRight, Maximize2, Minimize2, Download } from 'lucide-react';

interface TimetableData {
  sections: Record<string, { grid: Record<string, Record<string, any>> }>;
  raw?: any[];
  log?: string;
}

interface TimetableCalendarProps {
  data?: TimetableData;
}

const TimetableCalendar: React.FC<TimetableCalendarProps> = ({ data }) => {
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [subjectColorMap, setSubjectColorMap] = useState<Record<string, string>>({});

  // Time slots from 8 AM to 6 PM
  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Set default section when data changes
  useEffect(() => {
    if (data?.sections && Object.keys(data.sections).length > 0) {
      const sectionKeys = Object.keys(data.sections);
      // Prefer Electronics Communication Engineering Sec-2 if available
      const preferredKey = sectionKeys.find((key) =>
        key.includes('ELECTRONICS_COMMUNICATION_ENGINEERING') &&
        (key.includes('SEC-2') || key.includes('SEC_2'))
      );
      setSelectedSection(preferredKey || sectionKeys[0]);
    }
  }, [data]);

  // Generate unique colors for subjects in the current section
  useEffect(() => {
    if (!data?.sections || !selectedSection) return;
    
    const sectionData = data.sections[selectedSection];
    if (!sectionData) return;

    const subjects = new Set<string>();
    
    // Collect all unique subjects from the current section
    Object.values(sectionData.grid).forEach(dayData => {
      Object.values(dayData).forEach(event => {
        if (event?.Course) {
          subjects.add(event.Course);
        }
      });
    });

    // Generate color map for unique subjects
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
    const subjectArray = Array.from(subjects);
    
    // Assign colors to subjects ensuring uniqueness
    subjectArray.forEach((subject, index) => {
      newColorMap[subject] = colorPalette[index % colorPalette.length];
    });

    setSubjectColorMap(newColorMap);
  }, [data, selectedSection]);

  const getCurrentSectionData = () => {
    if (!data?.sections || !selectedSection) return null;
    return data.sections[selectedSection];
  };

  const getEventForTimeSlot = (day: string, timeSlot: string) => {
    const sectionData = getCurrentSectionData();
    if (!sectionData) return null;

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

    const period = timeToPeriodMap[timeSlot];
    if (!period) return null;

    return sectionData.grid[day]?.[period] || null;
  };

  const isSameEvent = (a: any, b: any) => {
    if (!a || !b) return false;
    return (
      a.Course === b.Course &&
      (a.Part || '') === (b.Part || '') &&
      (a['Instructor Name'] || '') === (b['Instructor Name'] || '') &&
      (a.Room || '') === (b.Room || '')
    );
  };

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        await containerRef.current?.requestFullscreen?.();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const getEventColor = (course: string) => {
    // Use the pre-generated unique color map for this subject
    if (subjectColorMap[course]) {
      return subjectColorMap[course];
    }
    
    // Fallback color if subject not found in map
    return 'bg-gray-100 border-gray-200 text-gray-800';
  };

  // No helper for time range required in current UI

  const buildSectionHTML = (sectionName: string, sectionData: { grid: Record<string, Record<string, any>> }) => {
    const buildRow = (day: string) => {
      let tds = '';
      for (let i = 0; i < timeSlots.length; ) {
        const slot = timeSlots[i];
        const event = sectionData.grid[day]?.[{
          '8:00 AM': 'P1','9:00 AM': 'P2','10:00 AM': 'P3','11:00 AM': 'P4','12:00 PM': 'P5','1:00 PM': 'P6','2:00 PM': 'P7','3:00 PM': 'P8','4:00 PM': 'P9','5:00 PM': 'P10','6:00 PM': 'P10'
        }[slot] as string] || null;

        if (event) {
          let span = 1;
          for (let j = i + 1; j < timeSlots.length; j++) {
            const nextSlot = timeSlots[j];
            const next = sectionData.grid[day]?.[{
              '8:00 AM': 'P1','9:00 AM': 'P2','10:00 AM': 'P3','11:00 AM': 'P4','12:00 PM': 'P5','1:00 PM': 'P6','2:00 PM': 'P7','3:00 PM': 'P8','4:00 PM': 'P9','5:00 PM': 'P10','6:00 PM': 'P10'
            }[nextSlot] as string] || null;
            if (isSameEvent(event, next)) span += 1; else break;
          }
          const text = `${event.Course || ''}${event.Part ? ` (${event.Part})` : ''}`;
          const instr = event['Instructor Name'] ? `<div class="cell-sub">${event['Instructor Name']}</div>` : '';
          const room = event.Room ? `<div class="cell-sub">${event.Room}</div>` : '';
          tds += `<td colspan="${span}" class="cell filled"><div class="cell-title">${text}</div>${instr}${room}</td>`;
          i += span;
        } else {
          tds += `<td class="cell"></td>`;
          i += 1;
        }
      }
      return `<tr><th class="day">${day}</th>${tds}</tr>`;
    };

    const headerRow = `<tr><th class="day-header">Day</th>${timeSlots.map(t => `<th class=\"time\">${t}</th>`).join('')}</tr>`;

    const table = `
      <table class="grid">
        ${headerRow}
        ${days.map(buildRow).join('')}
      </table>
    `;

    // Optional subjects summary
    const legend = `
      <div class="legend">
        <div><span class="dot"></span> Lecture</div>
        <div><span class="dot lab"></span> Lab/Tutorial</div>
      </div>
    `;

    const head = `
      <div class="head">
        <div class="title">DELHI TECHNOLOGICAL UNIVERSITY</div>
        <div class="subtitle">CENTRAL TIME TABLE • Week of ${currentWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
        <div class="meta">Section: ${sectionName}</div>
      </div>
    `;

    return `<section class="page">${head}${table}${legend}</section>`;
  };

  const exportAllSectionsPDF = () => {
    if (!data?.sections) return;
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

    const pages = Object.entries(data.sections).map(([name, section]) => buildSectionHTML(name, section as any)).join('');
    const html = `<!doctype html><html><head><meta charset=\"utf-8\">${styles}</head><body>${pages}</body></html>`;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    // Give the browser a tick to render before printing
    setTimeout(() => { try { w.focus(); w.print(); } catch {} }, 200);
  };

  if (!data?.sections || Object.keys(data.sections).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <Building className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Timetable Data</h3>
        <p className="text-sm text-gray-500 text-center max-w-md">
          Generate a timetable first by uploading an XML file in the Generate Timetable section.
        </p>
      </div>
    );
  }

  const sections = Object.keys(data.sections);

  return (
    <div ref={containerRef} className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Timetable View</h2>
            <p className="text-sm text-gray-600 mt-1">
              {selectedSection ? `Section: ${selectedSection}` : 'Select a section to view timetable'}
            </p>
          </div>
          
          {/* Section Selector */}
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-500" />
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between">
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
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentWeek(new Date())}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Today
            </button>
            <button
              onClick={exportAllSectionsPDF}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium flex items-center gap-2"
              title="Export PDF"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </button>
            <button
              onClick={toggleFullscreen}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium flex items-center gap-2"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              {isFullscreen ? 'Exit' : 'Fullscreen'}
            </button>
          </div>
        </div>
      </div>

      {/* Timetable Grid */}
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
            {days.map((day) => {
              const cells: React.ReactNode[] = [];
              for (let i = 0; i < timeSlots.length; ) {
                const timeSlot = timeSlots[i];
                const event = getEventForTimeSlot(day, timeSlot);
                if (event) {
                  let span = 1;
                  for (let j = i + 1; j < timeSlots.length; j++) {
                    const nextEvent = getEventForTimeSlot(day, timeSlots[j]);
                    if (isSameEvent(event, nextEvent)) {
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
                          {event['Instructor Name'] && (
                            <div className="flex items-center gap-1 text-xs">
                              <Users className="h-3 w-3" />
                              <span className="truncate">{event['Instructor Name']}</span>
                            </div>
                          )}
                          {event.Room && (
                            <div className="flex items-center gap-1 text-xs">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{event.Room}</span>
                            </div>
                          )}
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
              <span>Instructor</span>
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
  );
};

export default TimetableCalendar;
