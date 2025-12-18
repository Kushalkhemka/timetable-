// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useEffect, useMemo, useRef, useState } from 'react';
import CardBox from 'src/components/shared/CardBox';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from 'src/components/shadcn-ui/Default-Ui/form';
import { Input } from 'src/components/shadcn-ui/Default-Ui/input';
import { Button, Tabs, TabItem, TextInput, ToggleSwitch } from 'flowbite-react';
import { Trash2, Building, Plus, Info, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { useForm } from 'react-hook-form';

type TimetableForm = {
  name: string;
  periodsPerDay: number;
};

const GenerateTimetable: React.FC = () => {
  const form = useForm<TimetableForm>({
    defaultValues: { name: '', periodsPerDay: 8 },
  });

  const periodsPerDay = form.watch('periodsPerDay');
  const [showTimings, setShowTimings] = useState<boolean>(true);
  const [activeDays, setActiveDays] = useState<Record<string, boolean>>({
    Sun: false,
    Mon: true,
    Tue: true,
    Wed: true,
    Thu: true,
    Fri: true,
    Sat: false,
  });

  // Tab navigation state
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    'General Settings',
    'Subjects/Courses', 
    'Teachers/Instructors',
    'Classes/Grades',
    'Rooms',
    'Lessons',
    'Review & Generate'
  ];

  const schoolDays = useMemo(() => Object.keys(activeDays).filter((d) => activeDays[d]), [activeDays]);
  const offDays = useMemo(() => Object.keys(activeDays).filter((d) => !activeDays[d]), [activeDays]);

  // Ref to control Flowbite Tabs by clicking headers
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Lists for subsequent tabs
  const [subjects, setSubjects] = useState<string[]>(['', '', '']);
  const [teachers, setTeachers] = useState<string[]>(['', '']);
  const [classes, setClasses] = useState<Array<{name: string, batchSize: number}>>([{name: '', batchSize: 75}]);
  
  // Rooms state
  const [buildingMode, setBuildingMode] = useState(false);
  const [rooms, setRooms] = useState<Array<{name: string, homeRoom: string}>>([]);
  // Constraints parsed from XML
  const [hardConstraints, setHardConstraints] = useState<Array<{ id: string; name: string; description?: string; weight?: string; mandatory?: string }>>([]);
  const [softConstraints, setSoftConstraints] = useState<Array<{ id: string; name: string; description?: string; weight?: string; priority?: string }>>([]);
  // Subjects per class parsed from XML: map class -> ["CODE - NAME"]
  const [classSubjects, setClassSubjects] = useState<Record<string, string[]>>({});
  
  // Lessons state
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [lessonView, setLessonView] = useState<'classes' | 'teachers' | 'subjects' | 'rooms'>('classes');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [sectionsData, setSectionsData] = useState<Record<string, { grid: Record<string, Record<string, any>> }>>({});
  const [activeSection, setActiveSection] = useState<string>('');
  
  // Export helpers based on generated sectionsData
  const exportAllSectionsCSV = () => {
    if (!sectionsData || Object.keys(sectionsData).length === 0) return;
    const headers = ['Section', 'Day', 'Period', 'Course', 'Part', 'Room', 'Instructor Name'];
    const rows: string[][] = [headers];
    Object.entries(sectionsData).forEach(([sectionName, section]) => {
      daysOrdered.forEach((day) => {
        periodsOrdered.forEach((period) => {
          const cell = (section as any)?.grid?.[day]?.[period] || null;
          if (cell) {
            rows.push([
              sectionName,
              day,
              period,
              String(cell['Course'] ?? ''),
              String(cell['Part'] ?? ''),
              String(cell['Room'] ?? ''),
              String(cell['Instructor Name'] ?? ''),
            ]);
          }
        });
      });
    });
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}` + '"').join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${timetableName || 'timetable'}_all_sections.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAllSectionsExcel = () => {
    if (!sectionsData || Object.keys(sectionsData).length === 0) return;
    // Build a simple HTML workbook that Excel can open
    const tableRows: string[] = [];
    tableRows.push('<tr><th>Section</th><th>Day</th><th>Period</th><th>Course</th><th>Part</th><th>Room</th><th>Instructor Name</th></tr>');
    Object.entries(sectionsData).forEach(([sectionName, section]) => {
      daysOrdered.forEach((day) => {
        periodsOrdered.forEach((period) => {
          const cell = (section as any)?.grid?.[day]?.[period] || null;
          if (cell) {
            const cols = [
              sectionName,
              day,
              period,
              String(cell['Course'] ?? ''),
              String(cell['Part'] ?? ''),
              String(cell['Room'] ?? ''),
              String(cell['Instructor Name'] ?? ''),
            ].map((v) => `<td>${String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;')}</td>`).join('');
            tableRows.push(`<tr>${cols}</tr>`);
          }
        });
      });
    });
    const html = `<!doctype html><html><head><meta charset="utf-8"></head><body><table>${tableRows.join('')}</table></body></html>`;
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${timetableName || 'timetable'}_all_sections.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAllSectionsPDF = () => {
    if (!sectionsData || Object.keys(sectionsData).length === 0) return;
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

    const buildSectionHTML = (sectionName: string, section: { grid: Record<string, Record<string, any>> }) => {
      const legend = `<div class="legend"><div><span class="dot"></span>Lecture</div><div><span class="dot lab"></span>Lab</div></div>`;
      const header = `
        <section class="page">
          <div class="head">
            <div class="title">${timetableName || 'Timetable'} — Section: ${sectionName}</div>
            <div class="subtitle">Generated on ${new Date().toLocaleString()}</div>
          </div>
          <table class="grid">
            <thead>
              <tr>
                <th class="day">Period/Day</th>
                ${daysOrdered.map((d) => `<th class="day">${d}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
      `;
      const rows = periodsOrdered.map((p) => {
        const cells = daysOrdered.map((d) => {
          const cell = (section as any)?.grid?.[d]?.[p] || null;
          if (!cell) return `<td class="cell"></td>`;
          const title = `${cell['Course'] ?? ''}`;
          const sub = [cell['Part'], cell['Instructor Name'], cell['Room']].filter(Boolean).join(' • ');
          return `<td class="cell filled"><div class="cell-title">${title}</div><div class="cell-sub">${sub}</div></td>`;
        }).join('');
        return `<tr><td class="cell"><strong>${p}</strong></td>${cells}</tr>`;
      }).join('');
      const footer = `</tbody></table>${legend}</section>`;
      return header + rows + footer;
    };

    const pages = Object.entries(sectionsData).map(([name, section]) => buildSectionHTML(name, section as any)).join('');
    const html = `<!doctype html><html><head><meta charset=\"utf-8\">${styles}</head><body>${pages}</body></html>`;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    setTimeout(() => { try { w.focus(); w.print(); } catch {} }, 200);
  };

  // Calculate dynamic data for Review & Generate
  const timetableName = form.watch('name') || 'Untitled';
  const totalPeriodsPerWeek = schoolDays.length * (Number(periodsPerDay) || 0);
  
  const subjectsCount = subjects.filter(s => s.trim() !== '').length;
  const teachersCount = teachers.filter(t => t.trim() !== '').length;
  const classesCount = classes.filter(c => c.name.trim() !== '').length;
  const roomsCount = rooms.length;
  const lessonsCount = 0; // Will be updated when lessons are added
  
  const workloadData = {
    classes: classes.filter(c => c.name.trim() !== '').map(cls => ({
      name: cls.name,
      batchSize: cls.batchSize,
      available: totalPeriodsPerWeek,
      used: 0, // Will be updated when lessons are added
      utilization: 0
    })),
    teachers: teachers.filter(t => t.trim() !== '').map(teacher => ({
      name: teacher,
      available: totalPeriodsPerWeek,
      used: 0, // Will be updated when lessons are added
      utilization: 0
    })),
    rooms: rooms.map(room => ({
      name: room.name || 'Unnamed Room',
      available: totalPeriodsPerWeek,
      used: 0, // Will be updated when lessons are added
      utilization: 0
    }))
  };

  // Navigation functions
  const handleNext = () => {
    if (activeTab < tabs.length - 1) {
      const newIndex = activeTab + 1;
      setActiveTab(newIndex);
      const headers = tabsContainerRef.current?.querySelectorAll('[role="tab"]');
      const header = headers?.[newIndex] as HTMLElement | undefined;
      header?.click();
    }
  };

  const handlePrevious = () => {
    if (activeTab > 0) {
      const newIndex = activeTab - 1;
      setActiveTab(newIndex);
      const headers = tabsContainerRef.current?.querySelectorAll('[role="tab"]');
      const header = headers?.[newIndex] as HTMLElement | undefined;
      header?.click();
    }
  };

  // Sync activeTab when user clicks a tab header manually
  useEffect(() => {
    const container = tabsContainerRef.current;
    if (!container) return;
    const headers = Array.from(container.querySelectorAll('[role="tab"]')) as HTMLElement[];
    const handler = (e: Event) => {
      const idx = headers.indexOf(e.currentTarget as HTMLElement);
      if (idx >= 0) setActiveTab(idx);
    };
    headers.forEach((h) => h.addEventListener('click', handler));
    return () => headers.forEach((h) => h.removeEventListener('click', handler));
  }, []);

  // Hydrate from localStorage if available (parsed XML)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('timetableParsed');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.periodsPerDay) form.setValue('periodsPerDay', parsed.periodsPerDay);
      if (parsed?.name) form.setValue('name', parsed.name);
      if (parsed?.activeDays) setActiveDays(parsed.activeDays);
      if (Array.isArray(parsed?.subjects) && parsed.subjects.length) setSubjects(parsed.subjects);
      if (Array.isArray(parsed?.teachers) && parsed.teachers.length) setTeachers(parsed.teachers);
      if (Array.isArray(parsed?.classes) && parsed.classes.length) setClasses(parsed.classes.map((n: string) => ({ name: n, batchSize: 75 })));
      if (Array.isArray(parsed?.rooms) && parsed.rooms.length) setRooms(parsed.rooms.map((n: string) => ({ name: n, homeRoom: '' })));
      if (parsed?.classSubjects) setClassSubjects(parsed.classSubjects);
      if (Array.isArray(parsed?.hardConstraints)) setHardConstraints(parsed.hardConstraints);
      if (Array.isArray(parsed?.softConstraints)) setSoftConstraints(parsed.softConstraints);
    } catch {}
  }, []);

  return (
    <CardBox className="p-0">
      <div className="p-2 sm:p-4">
        <h4 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Edit Timetable</h4>

        <div className="overflow-x-auto" ref={tabsContainerRef}>
          <Tabs aria-label="Full width tabs" variant="fullWidth" className="w-full">
            <TabItem active={activeTab === 0} title="General Settings">
            <Form {...form}>
              <form className="space-y-4 sm:space-y-6 max-w-6xl mx-auto px-2">
                <div>
                  <h5 className="text-sm sm:text-base font-semibold mb-3">Set up basic timetable parameters</h5>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timetable Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Untitled" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* XML Upload Section */}
                <div className="mt-4 sm:mt-6">
                  <h5 className="text-sm sm:text-base font-semibold mb-3">Upload Timetable Data</h5>
                  <div className="rounded-md border border-black/10 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Building className="h-5 w-5 text-gray-600" />
                      <h6 className="text-sm font-semibold">XML File Upload</h6>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">Upload your timetable XML file to generate the schedule automatically.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                      <input
                        type="file"
                        accept=".xml"
                        onChange={(e) => setXmlFile(e.target.files?.[0] || null)}
                        className="w-full sm:w-auto text-sm border border-gray-300 rounded-md px-3 py-2"
                      />
                      <Button
                        color="light"
                        size="sm"
                        className="w-full sm:w-auto"
                        disabled={!xmlFile || isGenerating}
                        onClick={async () => {
                          if (!xmlFile) return;
                          try {
                            setIsGenerating(true);
                            const text = await xmlFile.text();
                            const parsed = parseTimetableXml(text);
                            // Prefill: periods per day
                            if (parsed.periodsPerDay) {
                              form.setValue('periodsPerDay', parsed.periodsPerDay);
                            }
                            // Prefill: timetable name
                            if (parsed.name) {
                              form.setValue('name', parsed.name);
                            }
                            // Prefill: days
                            if (parsed.activeDays) {
                              setActiveDays(parsed.activeDays);
                            }
                            // Prefill: subjects, teachers, classes, rooms
                            if (parsed.subjects && parsed.subjects.length) setSubjects(parsed.subjects);
                            if (parsed.teachers && parsed.teachers.length) setTeachers(parsed.teachers);
                            if (parsed.classes && parsed.classes.length) setClasses(parsed.classes.map((n) => ({ name: n, batchSize: 75 })));
                            if (parsed.rooms && parsed.rooms.length) setRooms(parsed.rooms.map((n) => ({ name: n, homeRoom: '' })));
                            // Constraints
                            setHardConstraints(parsed.hardConstraints || []);
                            setSoftConstraints(parsed.softConstraints || []);
                            // Class subjects
                            setClassSubjects(parsed.classSubjects || {});
                            // Persist
                            try {
                              localStorage.setItem('timetableParsed', JSON.stringify(parsed));
                            } catch {}
                            alert('XML parsed and fields pre-filled successfully.');
                          } catch (err) {
                            console.error(err);
                            alert('Failed to parse XML. See console for details.');
                          } finally {
                            setIsGenerating(false);
                          }
                        }}
                      >
                        Prefill From XML
                      </Button>
                      <Button
                        color="primary"
                        size="sm"
                        className="w-full sm:w-auto"
                        disabled={!xmlFile || isGenerating}
                        onClick={async () => {
                          if (!xmlFile) return;
                          try {
                            setIsGenerating(true);
                            const formData = new FormData();
                            formData.append('xml', xmlFile);
                            const envBackend = (import.meta as any).env?.VITE_BACKEND_URL || (import.meta as any).env?.VITE_TIMETABLE_API || '';
                            const windowBackend = typeof (window as any).__TT_BACKEND__ === 'string' ? (window as any).__TT_BACKEND__ : '';
                            const apiBase = (envBackend || windowBackend).toString();
                            const baseUrl = (apiBase ? apiBase.replace(/\/$/, '') : '') + '/api/generate';
                            const urlToCall = baseUrl || '/api/generate';
                            const resp = await fetch(urlToCall, {
                              method: 'POST',
                              body: formData,
                            });
                            if (!resp.ok) {
                              const txt = await resp.text();
                              throw new Error(txt || 'Failed to generate');
                            }
                            const data = await resp.json();
                            const sections = data?.sections || {};
                            setSectionsData(sections);
                            const first = Object.keys(sections)[0] || '';
                            setActiveSection(first);
                            
                            // Save to localStorage for ViewTimetable component
                            localStorage.setItem('timetableData', JSON.stringify(data));
                            
                            // Show success message
                            alert('Timetable generated successfully! Check the Review & Generate tab to view results.');
                          } catch (e) {
                            console.error(e);
                            alert('Generation failed. Check console for details.');
                          } finally {
                            setIsGenerating(false);
                          }
                        }}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        {isGenerating ? 'Generating…' : 'Generate Timetable'}
                      </Button>
                    </div>
                    
                    {xmlFile && (
                      <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="text-xs text-blue-700">
                          <strong>Selected file:</strong> {xmlFile.name}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm sm:text-base font-semibold mb-3">Time Settings</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="periodsPerDay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Periods Per Day</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} max={20} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Period & Break Timings */}
                <div className="mt-4 sm:mt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <h5 className="text-sm sm:text-base font-semibold">Period & Break Timings</h5>
                    <button
                      type="button"
                      onClick={() => setShowTimings((s) => !s)}
                      className="text-xs text-primary hover:underline self-start sm:self-auto"
                    >
                      {showTimings ? 'Hide Period & Break Timings' : 'Show Period & Break Timings'}
                    </button>
                  </div>
                  {showTimings ? (
                    <div className="mt-3 space-y-3 sm:space-y-4">
                      {Array.from({ length: Math.max(0, Number(periodsPerDay) || 0) }).map((_, idx) => (
                        <div key={idx} className="rounded-md border border-black/10 p-3 sm:p-4">
                          <div className="text-sm font-medium mb-3">{`Period ${idx + 1}`}</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input type="time" className="w-full" defaultValue={getDefaultPeriodTime(idx).start} />
                            <Input type="time" className="w-full" defaultValue={getDefaultPeriodTime(idx).end} />
                          </div>
                          <div className="mt-3">
                            <button type="button" className="text-xs text-primary hover:underline">
                              {`Add Break After Period ${idx + 1}`}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                {/* Days Configuration */}
                <div className="mt-6 sm:mt-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <h5 className="text-sm sm:text-base font-semibold">Days Configuration</h5>
                    <button type="button" className="text-xs text-primary hover:underline self-start sm:self-auto">Switch to Fortnightly</button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Select which days are college days. The remaining days will be considered days off.</p>

                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {Object.keys(activeDays).map((day) => (
                      <button
                        type="button"
                        key={day}
                        onClick={() => setActiveDays((prev) => ({ ...prev, [day]: !prev[day] }))}
                        className={
                          activeDays[day]
                            ? 'rounded-md bg-blue-100 text-blue-700 border border-blue-300 py-2 sm:py-3 text-sm sm:text-base'
                            : 'rounded-md bg-gray-100 text-gray-600 border border-gray-300 py-2 sm:py-3 text-sm sm:text-base'
                        }
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div className="rounded-md bg-blue-50 p-3">
                      <div className="text-sm font-medium text-blue-700">College/School Days</div>
                      <div className="mt-2 flex flex-wrap gap-1 sm:gap-2">
                        {schoolDays.map((d) => (
                          <span key={d} className="text-xs px-2 py-1 rounded-md bg-white/80 text-blue-700 ring-1 ring-blue-300">
                            {fullDayName(d)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-md bg-gray-50 p-3">
                      <div className="text-sm font-medium text-gray-600">Days Off</div>
                      <div className="mt-2 flex flex-wrap gap-1 sm:gap-2">
                        {offDays.map((d) => (
                          <span key={d} className="text-xs px-2 py-1 rounded-md bg-white/80 text-gray-600 ring-1 ring-gray-300">
                            {fullDayName(d)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>


                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                  <Button color="light" className="w-full sm:w-auto" onClick={handlePrevious} disabled={activeTab === 0}>Previous</Button>
                  <div className="text-center text-sm text-gray-600 py-2">Step {activeTab + 1} of {tabs.length}</div>
                  <Button color="primary" className="w-full sm:w-auto" onClick={handleNext} disabled={activeTab === tabs.length - 1}>Next</Button>
                </div>
              </form>
            </Form>
            </TabItem>
            {/* Subjects / Courses */}
            <TabItem active={activeTab === 1} title="Subjects/Courses">
              <div className="space-y-4 max-w-6xl mx-auto px-2">
                <div>
                  <h5 className="text-sm sm:text-base font-semibold">Add all subjects or courses taught</h5>
                </div>
                <div className="rounded-md border border-black/10 overflow-x-auto">
                  <div className="min-w-[600px]">
                  <div className="grid grid-cols-12 text-xs text-neutral-500 px-4 py-3 border-b border-black/10">
                    <div className="col-span-8">NAME</div>
                    <div className="col-span-3">AVAILABILITY</div>
                    <div className="col-span-1 text-right">ACTIONS</div>
                  </div>
                  <div className="divide-y divide-black/10">
                    {subjects.map((s, i) => (
                      <div key={i} className="grid grid-cols-12 gap-3 items-center px-4 py-3">
                        <div className="col-span-8">
                          <TextInput placeholder="e.g., Physics" value={s} onChange={(e) => {
                            const c = [...subjects];
                            c[i] = e.target.value;
                            setSubjects(c);
                          }} />
                        </div>
                        <div className="col-span-3">
                          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs">
                            <span>All Available</span>
                          </div>
                        </div>
                        <div className="col-span-1 text-right">
                          <button type="button" onClick={() => setSubjects((arr) => arr.filter((_, idx) => idx !== i))} className="text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-end gap-2">
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center sm:justify-end">
                    <Button color="light" className="text-xs sm:text-sm">Sort A-Z</Button>
                    <Button color="light" className="text-xs sm:text-sm">Bulk Import</Button>
                  </div>
                  <Button color="primary" onClick={() => setSubjects((arr) => [...arr, ''])} className="w-full sm:w-auto">Add Subject</Button>
                </div>
                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
                  <Button color="light" className="w-full sm:w-auto" onClick={handlePrevious} disabled={activeTab === 0}>Previous</Button>
                  <div className="text-center text-sm text-gray-600 py-2">Step {activeTab + 1} of {tabs.length}</div>
                  <Button color="primary" className="w-full sm:w-auto" onClick={handleNext} disabled={activeTab === tabs.length - 1}>Next</Button>
                </div>
              </div>
            </TabItem>

            {/* Teachers / Instructors */}
            <TabItem active={activeTab === 2} title="Teachers/Instructors">
              <div className="space-y-4 max-w-6xl mx-auto px-2">
                <div>
                  <h5 className="text-sm sm:text-base font-semibold">Add teacher/instructor information</h5>
                </div>
                <div className="rounded-md border border-black/10 overflow-x-auto">
                  <div className="min-w-[600px]">
                  <div className="grid grid-cols-12 text-xs text-neutral-500 px-4 py-3 border-b border-black/10">
                    <div className="col-span-8">NAME</div>
                    <div className="col-span-3">AVAILABILITY</div>
                    <div className="col-span-1 text-right">ACTIONS</div>
                  </div>
                  <div className="divide-y divide-black/10">
                    {teachers.map((t, i) => (
                      <div key={i} className="grid grid-cols-12 gap-3 items-center px-4 py-3">
                        <div className="col-span-8">
                          <TextInput placeholder="e.g., John Doe" value={t} onChange={(e) => {
                            const c = [...teachers];
                            c[i] = e.target.value;
                            setTeachers(c);
                          }} />
                        </div>
                        <div className="col-span-3">
                          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs">
                            <span>All Available</span>
                          </div>
                        </div>
                        <div className="col-span-1 text-right">
                          <button type="button" onClick={() => setTeachers((arr) => arr.filter((_, idx) => idx !== i))} className="text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-end gap-2">
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center sm:justify-end">
                    <Button color="light" className="text-xs sm:text-sm">Sort A-Z</Button>
                    <Button color="light" className="text-xs sm:text-sm">Bulk Import</Button>
                  </div>
                  <Button color="primary" onClick={() => setTeachers((arr) => [...arr, ''])} className="w-full sm:w-auto">Add Teacher</Button>
                </div>
                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
                  <Button color="light" className="w-full sm:w-auto" onClick={handlePrevious} disabled={activeTab === 0}>Previous</Button>
                  <div className="text-center text-sm text-gray-600 py-2">Step {activeTab + 1} of {tabs.length}</div>
                  <Button color="primary" className="w-full sm:w-auto" onClick={handleNext} disabled={activeTab === tabs.length - 1}>Next</Button>
                </div>
              </div>
            </TabItem>

            {/* Classes / Grades */}
            <TabItem active={activeTab === 3} title="Classes/Grades">
              <div className="space-y-4 max-w-6xl mx-auto px-2">
                <div>
                  <h5 className="text-sm sm:text-base font-semibold">Define classes or grades</h5>
                </div>
                <div className="rounded-md border border-black/10 overflow-x-auto">
                  <div className="min-w-[700px]">
                  <div className="grid grid-cols-12 text-xs text-neutral-500 px-4 py-3 border-b border-black/10">
                    <div className="col-span-6">NAME</div>
                    <div className="col-span-3">Batch Size</div>
                    <div className="col-span-2">AVAILABILITY</div>
                    <div className="col-span-1 text-right">ACTIONS</div>
                  </div>
                  <div className="divide-y divide-black/10">
                    {classes.map((c, i) => (
                      <div key={i} className="grid grid-cols-12 gap-3 items-center px-4 py-3">
                        <div className="col-span-6">
                          <TextInput placeholder="e.g., 12th Grade" value={c.name} onChange={(e) => {
                            const list = [...classes];
                            list[i] = { ...list[i], name: e.target.value };
                            setClasses(list);
                          }} />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            min="1"
                            max="200"
                            placeholder="75"
                            value={c.batchSize}
                            onChange={(e) => {
                              const list = [...classes];
                              list[i] = { ...list[i], batchSize: parseInt(e.target.value) || 75 };
                              setClasses(list);
                            }}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs">
                            <span>All Available</span>
                          </div>
                        </div>
                        <div className="col-span-1 text-right">
                          <button type="button" onClick={() => setClasses((arr) => arr.filter((_, idx) => idx !== i))} className="text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-end gap-2">
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center sm:justify-end">
                    <Button color="light" className="text-xs sm:text-sm">Sort A-Z</Button>
                    <Button color="light" className="text-xs sm:text-sm">Bulk Import</Button>
                  </div>
                  <Button color="primary" onClick={() => setClasses((arr) => [...arr, {name: '', batchSize: 75}] )} className="w-full sm:w-auto">Add Class</Button>
                </div>
                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
                  <Button color="light" className="w-full sm:w-auto" onClick={handlePrevious} disabled={activeTab === 0}>Previous</Button>
                  <div className="text-center text-sm text-gray-600 py-2">Step {activeTab + 1} of {tabs.length}</div>
                  <Button color="primary" className="w-full sm:w-auto" onClick={handleNext} disabled={activeTab === tabs.length - 1}>Next</Button>
                </div>
              </div>
            </TabItem>
             <TabItem active={activeTab === 4} title="Rooms">
               <div className="space-y-6 max-w-6xl mx-auto px-2">
                 <div>
                   <h5 className="text-sm sm:text-base font-semibold">Add your rooms</h5>
                 </div>
                 
                 {/* Buildings & Rooms Section */}
                 <div className="rounded-md border border-black/10 p-4">
                   <div className="flex items-center gap-2 mb-3">
                     <Building className="h-5 w-5 text-gray-600" />
                     <h6 className="text-sm font-semibold">Buildings & Rooms</h6>
                   </div>
                   <p className="text-xs text-muted-foreground mb-4">Add rooms and assign them as home rooms for specific classes (optional).</p>
                   
                   {/* Info Box */}
                   <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                     <div className="flex items-start gap-2">
                       <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                       <div className="text-xs text-blue-800">
                         <div className="font-semibold mb-1">Rooms are Optional</div>
                         <div className="mb-2">Only add rooms if your institution has:</div>
                         <ul className="list-disc list-inside space-y-1 ml-2">
                           <li>Shared facilities (labs, computer rooms, music rooms)</li>
                           <li>Rooms with limited capacity that need scheduling coordination</li>
                           <li>Classes that require specific room assignments</li>
                         </ul>
                         <div className="mt-2">For regular classrooms assigned to specific classes, you don't need to add them here.</div>
                       </div>
                     </div>
                   </div>
                   
                   {/* Building Mode Toggle */}
                   <div className="flex items-center gap-3 mb-4">
                     <span className="text-sm font-medium">Building Mode:</span>
                     <ToggleSwitch checked={buildingMode} onChange={setBuildingMode} />
                     <span className="text-sm text-gray-600">{buildingMode ? 'Multiple Buildings' : 'Single Building'}</span>
                   </div>
                   
                   {/* Empty State */}
                   {rooms.length === 0 ? (
                     <div className="text-center py-8 text-gray-500">
                       <Building className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                       <div className="text-sm">No rooms added yet</div>
                       <div className="text-xs">Add your first room to get started</div>
                       <Button color="primary" size="sm" className="mt-2" onClick={() => {
                         setRooms([...rooms, {name: '', homeRoom: ''}]);
                       }}>
                         <Plus className="h-4 w-4 mr-1" />
                         Add First Room
                       </Button>
                     </div>
                   ) : (
                     <div className="min-w-[600px]">
                       <div className="grid grid-cols-12 text-xs text-neutral-500 px-4 py-3 border-b border-black/10">
                         <div className="col-span-5">ROOM NAME</div>
                         <div className="col-span-4">HOME ROOM FOR</div>
                         <div className="col-span-2">AVAILABILITY</div>
                         <div className="col-span-1 text-right">ACTIONS</div>
                       </div>
                       <div className="divide-y divide-black/10">
                         {rooms.map((room, index) => (
                           <div key={index} className="grid grid-cols-12 gap-3 items-center px-4 py-3">
                             <div className="col-span-5">
                               <TextInput placeholder="e.g., Room 101" value={room.name} onChange={(e) => {
                                 const updatedRooms = [...rooms];
                                 updatedRooms[index] = { ...updatedRooms[index], name: e.target.value };
                                 setRooms(updatedRooms);
                               }} />
                             </div>
                             <div className="col-span-4">
                               <select
                                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                 value={room.homeRoom || ''}
                                 onChange={(e) => {
                                   const updatedRooms = [...rooms];
                                   updatedRooms[index] = { ...updatedRooms[index], homeRoom: e.target.value };
                                   setRooms(updatedRooms);
                                 }}
                               >
                                 <option value="">Shared Room</option>
                                 {classes.filter(c => c.name.trim() !== '').map((c, i) => (
                                   <option key={i} value={c.name}>{c.name}</option>
                                 ))}
                               </select>
                             </div>
                             <div className="col-span-2">
                               <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs">
                                 <span>All Available</span>
                               </div>
                             </div>
                             <div className="col-span-1 text-right">
                               <button type="button" onClick={() => setRooms((arr) => arr.filter((_, idx) => idx !== index))} className="text-red-500">
                                 <Trash2 className="h-4 w-4" />
                               </button>
                             </div>
                           </div>
                         ))}
                       </div>
                       <div className="flex flex-col sm:flex-row items-center justify-end gap-2 mt-3">
                         <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center sm:justify-end">
                           <Button color="light" className="text-xs sm:text-sm">Sort A-Z</Button>
                           <Button color="light" className="text-xs sm:text-sm">Bulk Import</Button>
                         </div>
                         <Button color="primary" onClick={() => setRooms((arr) => [...arr, { name: '', homeRoom: '' }])} className="w-full sm:w-auto">
                           Add Next Room
                         </Button>
                       </div>
                     </div>
                   )}
                 </div>
                 
                 <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
                   <Button color="light" className="w-full sm:w-auto" onClick={handlePrevious} disabled={activeTab === 0}>Previous</Button>
                   <Button color="primary" className="w-full sm:w-auto" onClick={handleNext} disabled={activeTab === tabs.length - 1}>Next</Button>
                 </div>
               </div>
             </TabItem>
            <TabItem active={activeTab === 5} title="Lessons">
              <div className="space-y-6 max-w-6xl mx-auto px-2">
                <div>
                  <h5 className="text-sm sm:text-base font-semibold">Configure class-wise lessons</h5>
                </div>
                
                {/* Lessons Section */}
                <div className="rounded-md border border-black/10 p-4">
                  <div className="flex items-center gap-2 mb-3">
                     <Building className="h-5 w-5 text-gray-600" />
                     <h6 className="text-sm font-semibold">Lessons</h6>
                   </div>
                   <p className="text-xs text-muted-foreground mb-4">Add lessons for each class with subject(s), teacher(s), and frequency/length per week (or timetable cycle).</p>
                   
                   {/* View Tabs */}
                   <div className="flex gap-1 mb-4">
                     {(['classes', 'teachers', 'subjects', 'rooms'] as const).map((view) => (
                       <button
                         key={view}
                         type="button"
                         onClick={() => setLessonView(view)}
                         className={`px-3 py-1 text-xs rounded-md transition-colors ${
                           lessonView === view 
                             ? 'bg-lightprimary text-primary border border-primary' 
                             : 'bg-muted text-muted-foreground hover:bg-lighthover'
                         }`}
                       >
                         {view.charAt(0).toUpperCase() + view.slice(1)}
                       </button>
                     ))}
                   </div>
                   <p className="text-xs text-muted-foreground mb-4">Different ways to view and organize the same lesson data.</p>
                   
                   {/* Lesson Data Display */}
                   <div className="min-h-[200px] bg-muted rounded-md p-4">
                     {lessonView === 'classes' && (
                       <div className="space-y-3">
                         {classes.filter(cls => cls.name.trim() !== '').map((cls, index) => (
                           <div key={index} className="bg-white rounded-md p-3 border border-border">
                             <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                 <Building className="h-4 w-4 text-gray-600" />
                                 <span className="text-sm font-medium">{cls.name}</span>
                                 <span className="text-xs text-gray-500">({cls.batchSize} students)</span>
                               </div>
                               <div className="flex gap-4 text-xs text-gray-600">
                                 <span>0 Lessons</span>
                                 <span>0 Total Periods</span>
                                 <span>0 Teachers</span>
                                 <span>{(classSubjects[cls.name] || []).length} Subjects</span>
                               </div>
                             </div>
                             {(classSubjects[cls.name] || []).length > 0 && (
                               <div className="mt-2 flex flex-wrap gap-2">
                                 {(classSubjects[cls.name] || []).map((subj, si) => (
                                   <span key={si} className="text-[11px] px-2 py-1 rounded-md bg-blue-50 text-blue-700 ring-1 ring-blue-200">{subj}</span>
                                 ))}
                               </div>
                             )}
                           </div>
                         ))}
                         {classes.filter(cls => cls.name.trim() !== '').length === 0 && (
                           <div className="text-center py-8 text-gray-500">
                             <Building className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                             <div className="text-sm">No classes configured yet</div>
                             <div className="text-xs">Add classes in the Classes/Grades tab first</div>
                           </div>
                         )}
                       </div>
                     )}
                   </div>
                   
                   {/* Action Buttons */}
                   <div className="flex justify-between items-center mt-4">
                     <div className="flex gap-2">
                       <Button color="light" size="sm">Expand All</Button>
                       <Button color="light" size="sm">Collapse All</Button>
                     </div>
                     <div className="flex gap-2">
                       <Button color="light" size="sm">Bulk Import</Button>
                       <Button color="light" size="sm" onClick={() => setShowLessonModal(true)}>+ Add Lesson</Button>
                       <Button color="primary" size="sm" onClick={() => setShowLessonModal(true)}>Add New Lesson</Button>
                     </div>
                   </div>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
                   <Button color="light" className="w-full sm:w-auto" onClick={handlePrevious} disabled={activeTab === 0}>Previous</Button>
                   <Button color="primary" className="w-full sm:w-auto" onClick={handleNext} disabled={activeTab === tabs.length - 1}>Next</Button>
                 </div>
               </div>
            </TabItem>
            <TabItem active={activeTab === 6} title="Review & Generate">
              <div className="space-y-6 max-w-6xl mx-auto px-2">
                <div>
                  <h5 className="text-sm sm:text-base font-semibold">Verify and create your timetable</h5>
                </div>
                
                {/* General Settings Summary */}
                <div className="rounded-md border border-black/10 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Building className="h-5 w-5 text-gray-600" />
                    <h6 className="text-sm font-semibold">General Settings</h6>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Timetable Name: {timetableName}</div>
                    <div>Working Days: {schoolDays.map(d => fullDayName(d)).join(', ')}</div>
                    <div>Periods Per Day: {periodsPerDay}</div>
                  </div>
                </div>
                
                {/* Setup Overview */}
                <div className="rounded-md border border-black/10 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Building className="h-5 w-5 text-gray-600" />
                    <h6 className="text-sm font-semibold">Setup Overview</h6>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-blue-50 rounded-md p-3 text-center">
                      <Building className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                      <div className="text-sm font-medium">{subjectsCount} Subjects/Courses</div>
                    </div>
                    <div className="bg-blue-50 rounded-md p-3 text-center">
                      <Building className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                      <div className="text-sm font-medium">{classesCount} Classes/Groups</div>
                    </div>
                    <div className="bg-indigo-50 rounded-md p-3 text-center">
                      <Building className="h-6 w-6 mx-auto mb-1 text-indigo-600" />
                      <div className="text-sm font-medium">{teachersCount} Teachers</div>
                    </div>
                    <div className="bg-gray-50 rounded-md p-3 text-center">
                      <Building className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                      <div className="text-sm font-medium">{roomsCount} Rooms</div>
                    </div>
                    <div className="bg-red-50 rounded-md p-3 text-center">
                      <Building className="h-6 w-6 mx-auto mb-1 text-red-600" />
                      <div className="text-sm font-medium">{lessonsCount} Lessons</div>
                    </div>
                    <div className="bg-muted rounded-md p-3 text-center">
                      <Zap className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-sm font-medium">{lessonsCount} Total Lesson Periods</div>
                    </div>
                  </div>
                </div>
                
                {/* Workload Analysis */}
                <div className="rounded-md border border-black/10 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Building className="h-5 w-5 text-gray-600" />
                    <h6 className="text-sm font-semibold">Workload Analysis</h6>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">Period distribution across classes, teachers, and rooms, considering their time-off schedules. Items with time-off will have reduced available periods for scheduling.</p>
                  
                  {/* Class Period Distribution */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">Class Period Distribution</span>
                    </div>
                    <div className="space-y-2">
                      {workloadData.classes.length > 0 ? (
                        workloadData.classes.map((cls, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{cls.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full" 
                                  style={{ width: `${cls.utilization}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600">{cls.used}/{cls.available} available ({cls.utilization}% utilization)</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 italic">No classes configured yet</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Teacher Period Distribution */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">Teacher Period Distribution</span>
                    </div>
                    <div className="space-y-2">
                      {workloadData.teachers.length > 0 ? (
                        workloadData.teachers.map((teacher, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{teacher.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full" 
                                  style={{ width: `${teacher.utilization}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600">{teacher.used}/{teacher.available} available ({teacher.utilization}% utilization)</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 italic">No teachers configured yet</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Room Period Distribution */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">Room Period Distribution</span>
                    </div>
                    <div className="space-y-2">
                      {workloadData.rooms.length > 0 ? (
                        workloadData.rooms.map((room, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{room.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full" 
                                  style={{ width: `${room.utilization}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600">{room.used}/{room.available} available ({room.utilization}% utilization)</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 italic">No rooms configured yet</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Understanding Workload Analysis */}
                  <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-orange-800">
                        <div className="font-semibold mb-1">Understanding Workload Analysis</div>
                        <ul className="space-y-1">
                          <li><strong>Available Periods:</strong> Total periods minus time-off periods for each class/teacher/room</li>
                          <li><strong>Utilization:</strong> Percentage of available periods that have been assigned lessons</li>
                          <li><strong>Time-off Impact:</strong> Classes, teachers, and rooms with time-off will have fewer available periods for scheduling</li>
                          <li><strong>Overloaded Items:</strong> Have more lesson periods assigned than their available capacity</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Scheduling Constraints Analysis */}
                <div className="rounded-md border border-black/10 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Building className="h-5 w-5 text-gray-600" />
                    <h6 className="text-sm font-semibold">Scheduling Constraints Analysis</h6>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">Analyzed {subjectsCount + teachersCount + classesCount + roomsCount} entity combinations - no scheduling conflicts detected!</p>
                  
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-green-800">
                        <div className="font-semibold mb-1">No Scheduling Conflicts</div>
                        <div>All entity combinations have sufficient available periods considering their time-off schedules. Timetable generation should proceed without scheduling constraint conflicts.</div>
                      </div>
                    </div>
                  </div>
                  {/* Parsed Constraints Summary */}
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-md border border-black/10 p-3">
                      <div className="text-sm font-medium mb-2">Hard Constraints ({hardConstraints.length})</div>
                      <div className="max-h-48 overflow-auto space-y-1">
                        {hardConstraints.length === 0 ? (
                          <div className="text-xs text-muted-foreground">No hard constraints parsed.</div>
                        ) : (
                          hardConstraints.map((c) => (
                            <div key={c.id} className="text-xs">
                              <span className="font-semibold">{c.name}</span>
                              {c.description ? <span className="text-muted-foreground"> — {c.description}</span> : null}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    <div className="rounded-md border border-black/10 p-3">
                      <div className="text-sm font-medium mb-2">Soft Constraints ({softConstraints.length})</div>
                      <div className="max-h-48 overflow-auto space-y-1">
                        {softConstraints.length === 0 ? (
                          <div className="text-xs text-muted-foreground">No soft constraints parsed.</div>
                        ) : (
                          softConstraints.map((c) => (
                            <div key={c.id} className="text-xs">
                              <span className="font-semibold">{c.name}</span>
                              {c.description ? <span className="text-muted-foreground"> — {c.description}</span> : null}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Generated Timetable Results */}
                <div className="rounded-md border border-black/10 p-4">
                  <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                    <h6 className="text-sm font-semibold">Generated Timetable Results</h6>
                    <div className="flex items-center gap-2">
                      <Button color="light" size="sm" onClick={exportAllSectionsPDF}>Export PDF</Button>
                      <Button color="light" size="sm" onClick={exportAllSectionsExcel}>Export Excel</Button>
                      <Button color="light" size="sm" onClick={exportAllSectionsCSV}>Export CSV</Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">View your generated timetable below. Upload an XML file in the General Settings tab to generate a new timetable.</p>
                  {Object.keys(sectionsData).length > 0 && (
                    <div className="mt-6">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {Object.keys(sectionsData).map((sec) => (
                          <button
                            key={sec}
                            type="button"
                            onClick={() => setActiveSection(sec)}
                            className={
                              activeSection === sec
                                ? 'px-3 py-1 rounded-md bg-primary text-white text-xs'
                                : 'px-3 py-1 rounded-md bg-muted text-muted-foreground text-xs'
                            }
                          >
                            {sec}
                          </button>
                        ))}
                      </div>
                      {activeSection && (
                        <TimetableGrid section={activeSection} grid={sectionsData[activeSection]?.grid} />
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
                  <Button color="light" className="w-full sm:w-auto" onClick={handlePrevious} disabled={activeTab === 0}>Previous</Button>
                  <div className="text-center text-sm text-gray-600 py-2">Step {activeTab + 1} of {tabs.length}</div>
                  <Button color="light" disabled className="w-full sm:w-auto">Next</Button>
                </div>
              </div>
            </TabItem>
        </Tabs>
        </div>
      </div>
      
      {/* Add New Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-2xl w-full mx-2 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New Lesson</h3>
              <button onClick={() => setShowLessonModal(false)} className="text-gray-400 hover:text-gray-600">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Classes */}
              <div>
                <label className="block text-sm font-medium text-ld mb-1">Classes *</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                  <option>Select...</option>
                  {classes.map((cls, index) => (
                    <option key={index} value={cls.name}>{cls.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Teachers */}
              <div>
                <label className="block text-sm font-medium text-ld mb-1">Teachers *</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                  <option>Select...</option>
                  {teachers.map((teacher, index) => (
                    <option key={index} value={teacher}>{teacher}</option>
                  ))}
                </select>
              </div>
              
              {/* Subjects */}
              <div>
                <label className="block text-sm font-medium text-ld mb-1">Subjects *</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                  <option>Select...</option>
                  {subjects.map((subject, index) => (
                    <option key={index} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              
              {/* Assign Specific Rooms */}
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm font-medium text-ld">Assign Specific Rooms</span>
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-2">
                  <option>Select Rooms</option>
                </select>
              </div>
              
              {/* Scheduling Formats */}
              <div>
                <h6 className="text-sm font-semibold mb-2">Scheduling Formats</h6>
                <p className="text-xs text-gray-600 mb-3">Define how often this lesson occurs (e.g., 3 times per week with 1 period each, or once per week with 2 periods).</p>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-4">
                      <label className="block text-xs font-medium text-ld mb-1">Times per Week *</label>
                      <input type="number" value="1" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="col-span-6">
                      <label className="block text-xs font-medium text-ld mb-1">Duration *</label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                        <option>Single Period</option>
                        <option>Double Period</option>
                        <option>Triple Period</option>
                      </select>
                    </div>
                    <div className="col-span-2 text-right">
                      <button type="button" className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <Button color="light" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Format
                  </Button>
                </div>
              </div>
              
              {/* Additional Options */}
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground">To split into groups, please select at least one class for this lesson first.</div>
                
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm font-medium text-ld">Enable Fixed Placement</span>
                      <Info className="h-4 w-4 text-muted-foreground" />
                </label>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button color="light" onClick={() => setShowLessonModal(false)}>Cancel</Button>
              <Button color="primary" onClick={() => setShowLessonModal(false)}>Add Lesson</Button>
            </div>
          </div>
        </div>
      )}
    </CardBox>
  );
};

export default GenerateTimetable;

const daysOrdered = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const periodsOrdered = ['P1','P2','P3','P4','P5','P6','P7','P8','P9','P10'];

function getDefaultPeriodTime(index: number): { start: string; end: string } {
  // 08:00 to 18:00, 60-minute slots
  const startMinutes = 8 * 60 + index * 60;
  const endMinutes = startMinutes + 60;
  const toHHMM = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };
  return { start: toHHMM(startMinutes), end: toHHMM(endMinutes) };
}

function parseTimetableXml(xmlString: string): {
  periodsPerDay?: number;
  activeDays?: Record<string, boolean>;
  subjects?: string[];
  teachers?: string[];
  classes?: string[];
  rooms?: string[];
  hardConstraints?: Array<{ id: string; name: string; description?: string; weight?: string; mandatory?: string }>;
  softConstraints?: Array<{ id: string; name: string; description?: string; weight?: string; priority?: string }>;
  name?: string;
  classSubjects?: Record<string, string[]>;
} {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');

  // Problem meta
  const problem = doc.querySelector('problem');
  const periodsPerDayAttr = problem?.getAttribute('slotsPerDay');
  const name = problem?.getAttribute('name') || undefined;

  // Working days
  const daysNodeList = Array.from(doc.querySelectorAll('workingHours > day')) as Element[];
  const dayNames = new Set<string>(daysNodeList.map((d) => d.getAttribute('name') || ''));
  const activeDays: Record<string, boolean> = {
    Sun: dayNames.has('Sunday'),
    Mon: dayNames.has('Monday'),
    Tue: dayNames.has('Tuesday'),
    Wed: dayNames.has('Wednesday'),
    Thu: dayNames.has('Thursday'),
    Fri: dayNames.has('Friday'),
    Sat: dayNames.has('Saturday'),
  };

  // Subjects from <courses><course>
  const subjects = Array.from(doc.querySelectorAll('courses > course')).map((c) => {
    const id = c.getAttribute('id') || '';
    const label = c.getAttribute('name') || '';
    return label ? `${id} - ${label}` : id;
  });

  // Teachers from <instructors><instructor>
  const teachers = Array.from(doc.querySelectorAll('instructors > instructor'))
    .map((i) => i.getAttribute('name') || '')
    .filter((n) => n);

  // Classes from <students><student>
  const classNodes = Array.from(doc.querySelectorAll('students > student')) as Element[];
  const classes = classNodes
    .map((s) => s.getAttribute('name') || s.getAttribute('id') || '')
    .filter((n) => n);
  // Build mapping of class -> subjects with codes
  const courseIdToLabel: Record<string, string> = {};
  Array.from(doc.querySelectorAll('courses > course')).forEach((c) => {
    const id = c.getAttribute('id') || '';
    const label = c.getAttribute('name') || id;
    if (id) courseIdToLabel[id] = label;
  });
  const classSubjects: Record<string, string[]> = {};
  classNodes.forEach((s) => {
    const className = s.getAttribute('name') || s.getAttribute('id') || '';
    const subs = Array.from(s.querySelectorAll('course'))
      .map((c) => c.getAttribute('course') || '')
      .filter((id) => id)
      .map((id) => `${id} - ${courseIdToLabel[id] || ''}`.trim());
    if (className) classSubjects[className] = subs;
  });

  // Rooms from class room attributes
  const rooms = Array.from(doc.querySelectorAll('classes > class[room]'))
    .map((c) => c.getAttribute('room') || '')
    .filter((r) => r)
    .filter((v, i, a) => a.indexOf(v) === i);

  // Constraints
  const hardConstraints = Array.from(doc.querySelectorAll('hardConstraints > constraint')).map((c) => ({
    id: c.getAttribute('id') || '',
    name: c.getAttribute('name') || '',
    description: c.getAttribute('description') || undefined,
    weight: c.getAttribute('weight') || undefined,
    mandatory: c.getAttribute('mandatory') || undefined,
  }));
  const softConstraints = Array.from(doc.querySelectorAll('softConstraints > constraint')).map((c) => ({
    id: c.getAttribute('id') || '',
    name: c.getAttribute('name') || '',
    description: c.getAttribute('description') || undefined,
    weight: c.getAttribute('weight') || undefined,
    priority: c.getAttribute('priority') || undefined,
  }));

  const result = {
    periodsPerDay: periodsPerDayAttr ? Number(periodsPerDayAttr) : undefined,
    activeDays,
    subjects,
    teachers,
    classes,
    rooms,
    hardConstraints,
    softConstraints,
    name,
    classSubjects,
  };

  return result;
}

function TimetableGrid({ section, grid }: { section: string; grid: Record<string, Record<string, any>> }) {
  if (!grid) return null;
  return (
    <div className="mt-2">
      <div className="text-sm font-semibold mb-2">Section: {section}</div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-border">
              <th className="p-2 text-left text-xs">Period/Day</th>
              {daysOrdered.map((d) => (
                <th key={d} className="p-2 text-left text-xs">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periodsOrdered.map((p) => (
              <tr key={p} className="border-b border-gray-100">
                <td className="p-2 text-xs font-medium">{p}</td>
                {daysOrdered.map((d) => {
                  const cell = grid?.[d]?.[p] || null;
                  return (
                    <td key={d+p} className="p-2 align-top">
                      {cell ? (
                        <div className="text-xs">
                          <div className="font-semibold">{cell['Course']} <span className="text-gray-500">({cell['Part']})</span></div>
                          {cell['Instructor Name'] && (<div className="text-gray-600">{cell['Instructor Name']}</div>)}
                          {cell['Room'] && (<div className="text-gray-500">{cell['Room']}</div>)}
                        </div>
                      ) : (
                        <div className="text-[11px] text-gray-400">&nbsp;</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function fullDayName(short: string): string {
  switch (short) {
    case 'Sun':
      return 'Sunday';
    case 'Mon':
      return 'Monday';
    case 'Tue':
      return 'Tuesday';
    case 'Wed':
      return 'Wednesday';
    case 'Thu':
      return 'Thursday';
    case 'Fri':
      return 'Friday';
    case 'Sat':
      return 'Saturday';
    default:
      return short;
  }
}