import React, { useEffect, useRef, useState } from 'react';
import { Tabs, TabItem, Button } from 'flowbite-react';
import { Input } from 'src/components/shadcn-ui/Default-Ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from 'src/components/shadcn-ui/Default-Ui/form';
import { useForm } from 'react-hook-form';

type Exam = {
  id: string;
  name: string;
  term?: string;
  department?: string;
  start_date?: string;
  end_date?: string;
};

type ExamSession = {
  id: string;
  exam_id: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  course_code?: string;
  course_name?: string;
  section?: string;
  room?: string;
  invigilator_id?: string;
  invigilator_name?: string;
  notes?: string;
};

const ExamSchedule: React.FC = () => {
  const API_BASE = ((import.meta as any).env?.VITE_BACKEND_URL || (import.meta as any).env?.VITE_TIMETABLE_API || '').replace(/\/$/, '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function cleanError(msg: unknown): string {
    const raw = String(msg || '');
    const stripped = raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return stripped.length > 180 ? stripped.slice(0, 177) + '...' : stripped;
  }

  // Data
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [sessions, setSessions] = useState<ExamSession[]>([]);

  // Wizard state inspired by /timetable/new
  const [activeTab, setActiveTab] = useState(0);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabs = ['General', 'Courses', 'Invigilators', 'Rooms', 'Sessions', 'Review'];

  // Temp collections for wizard (local modeling; you can later persist)
  const [courses, setCourses] = useState<string[]>(['']);
  const [invigilators, setInvigilators] = useState<string[]>(['']);
  const [rooms, setRooms] = useState<string[]>([]);

  // Forms
  const [newExam, setNewExam] = useState<Partial<Exam>>({ name: '', term: '', department: '' });
  const [newSession, setNewSession] = useState<Partial<ExamSession>>({ exam_date: '', start_time: '', end_time: '' });

  // shadcn Form for better UI/validation
  const examForm = useForm<{ name: string; term?: string; department?: string; start_date?: string; end_date?: string }>({
    defaultValues: { name: '', term: '', department: '', start_date: '', end_date: '' }
  });

  // Fetch exams
  useEffect(() => {
    let isCancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/api/exams`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Failed to load exams');
        }
        const json = await res.json();
        if (!isCancelled) setExams(json.exams || []);
      } catch (e: any) {
        if (!isCancelled) setError(cleanError(e?.message || 'Failed to load exams'));
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }
    load();
    return () => { isCancelled = true; };
  }, [API_BASE]);

  // Fetch sessions for selected exam
  useEffect(() => {
    let isCancelled = false;
    async function loadSessions() {
      if (!selectedExamId) { setSessions([]); return; }
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/api/exams/${selectedExamId}/sessions`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Failed to load sessions');
        }
        const json = await res.json();
        if (!isCancelled) setSessions(json.sessions || []);
      } catch (e: any) {
        if (!isCancelled) setError(cleanError(e?.message || 'Failed to load sessions'));
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }
    loadSessions();
    return () => { isCancelled = true; };
  }, [API_BASE, selectedExamId]);

  // Sync activeTab when user clicks tab headers
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

  function handleNext() {
    if (activeTab < tabs.length - 1) {
      const newIndex = activeTab + 1;
      setActiveTab(newIndex);
      const headers = tabsContainerRef.current?.querySelectorAll('[role="tab"]');
      const header = headers?.[newIndex] as HTMLElement | undefined;
      header?.click();
    }
  }
  function handlePrevious() {
    if (activeTab > 0) {
      const newIndex = activeTab - 1;
      setActiveTab(newIndex);
      const headers = tabsContainerRef.current?.querySelectorAll('[role="tab"]');
      const header = headers?.[newIndex] as HTMLElement | undefined;
      header?.click();
    }
  }

  async function createExam(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/api/exams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExam),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to create exam');
      }
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setExams((prev) => [json.exam, ...prev]);
      setSelectedExamId(json.exam.id);
    } catch (e: any) {
      setError(cleanError(e?.message || 'Failed to create exam'));
    } finally {
      setLoading(false);
    }
  }

  async function addSession(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedExamId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/api/exams/${selectedExamId}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSession),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to add session');
      }
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setSessions((prev) => [...json.sessions, ...prev]);
      setNewSession({ exam_date: '', start_time: '', end_time: '' });
    } catch (e: any) {
      setError(cleanError(e?.message || 'Failed to add session'));
    } finally {
      setLoading(false);
    }
  }

  async function deleteExam(id: string) {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/exams/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to delete exam');
      }
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setExams((prev) => prev.filter((e) => e.id !== id));
      if (selectedExamId === id) { setSelectedExamId(''); setSessions([]); }
    } catch (e: any) {
      setError(cleanError(e?.message || 'Failed to delete exam'));
    } finally {
      setLoading(false);
    }
  }

  async function deleteSession(id: string) {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/exam-sessions/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to delete session');
      }
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (e: any) {
      setError(cleanError(e?.message || 'Failed to delete session'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <h4 className="text-lg sm:text-xl font-semibold mb-4">Exam Scheduling</h4>
      {error && <div className="text-red-600 text-sm mb-3">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-1 border rounded p-3 h-max">
          <div className="text-sm font-medium mb-2">Exams</div>
          <Form {...examForm}>
            <form onSubmit={createExam} className="space-y-3 mb-3">
              <FormField
                control={examForm.control}
                name="name"
                render={() => (
              <FormItem>
                    <FormLabel className="text-xs">Exam name</FormLabel>
                    <FormControl>
                      <Input className="w-full text-sm" placeholder="e.g., Mid Term" value={newExam.name || ''} onChange={(e) => setNewExam((s) => ({ ...s, name: e.target.value }))} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-2">
                <FormItem>
                  <FormLabel className="text-xs">Term</FormLabel>
                  <FormControl>
                    <Input className="text-sm" placeholder="Odd/Even/Monsoon" value={newExam.term || ''} onChange={(e) => setNewExam((s) => ({ ...s, term: e.target.value }))} />
                  </FormControl>
                </FormItem>
                <FormItem>
                  <FormLabel className="text-xs">Department</FormLabel>
                  <FormControl>
                    <Input className="text-sm" placeholder="CSE, ECE..." value={newExam.department || ''} onChange={(e) => setNewExam((s) => ({ ...s, department: e.target.value }))} />
                  </FormControl>
                </FormItem>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <FormItem>
                  <FormLabel className="text-xs">Start date</FormLabel>
                  <FormControl>
                    <Input type="date" className="text-sm" value={newExam.start_date || ''} onChange={(e) => setNewExam((s) => ({ ...s, start_date: e.target.value }))} />
                  </FormControl>
                </FormItem>
                <FormItem>
                  <FormLabel className="text-xs">End date</FormLabel>
                  <FormControl>
                    <Input type="date" className="text-sm" value={newExam.end_date || ''} onChange={(e) => setNewExam((s) => ({ ...s, end_date: e.target.value }))} />
                  </FormControl>
                </FormItem>
              </div>
              <Button size="sm" color="primary" type="submit" className="w-full">Create</Button>
            </form>
          </Form>

          <ul className="space-y-1">
            {exams.map((e) => (
              <li key={e.id} className={`flex items-center justify-between px-2 py-1 rounded ${selectedExamId === e.id ? 'bg-blue-50' : ''}`}>
                <button className="text-left flex-1" onClick={() => setSelectedExamId(e.id)}>
                  <div className="font-medium text-sm">{e.name}</div>
                  <div className="text-xs text-gray-500">{e.term || ''} {e.department ? `• ${e.department}` : ''}</div>
                </button>
                <button className="text-red-600 text-xs" onClick={() => deleteExam(e.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4 border rounded p-3">
          <div className="overflow-x-auto" ref={tabsContainerRef}>
            <Tabs aria-label="Exam tabs" variant="fullWidth" className="w-full">
              <TabItem active={activeTab === 0} title="General">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded border p-3">
                    <div className="text-sm font-medium mb-2">Selected Exam</div>
                    {selectedExamId ? (
                      <div className="text-sm">Managing sessions for the selected exam.</div>
                    ) : (
                      <div className="text-sm text-gray-500">Create or select an exam from the left.</div>
                    )}
                  </div>
                  <div className="rounded border p-3">
                    <div className="text-sm font-medium mb-2">Date Range</div>
                    <div className="text-xs text-gray-600">Use start/end dates for schedule window.</div>
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <div />
                  <Button color="light" size="sm" onClick={handleNext}>Next</Button>
                </div>
              </TabItem>

              <TabItem active={activeTab === 1} title="Courses">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Courses</div>
                  {courses.map((c, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input className="flex-1 text-sm" value={c} onChange={(e) => setCourses((arr) => arr.map((v, i) => i === idx ? e.target.value : v))} placeholder="e.g., DAA" />
                      <button className="text-xs text-red-600" onClick={() => setCourses((arr) => arr.filter((_, i) => i !== idx))}>Remove</button>
                    </div>
                  ))}
                  <button className="text-xs text-blue-700" onClick={() => setCourses((arr) => [...arr, ''])}>Add Course</button>
                </div>
                <div className="flex justify-between mt-4">
                  <Button color="light" size="sm" onClick={handlePrevious}>Previous</Button>
                  <Button color="light" size="sm" onClick={handleNext}>Next</Button>
                </div>
              </TabItem>

              <TabItem active={activeTab === 2} title="Invigilators">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Invigilators</div>
                  {invigilators.map((c, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input className="flex-1 text-sm" value={c} onChange={(e) => setInvigilators((arr) => arr.map((v, i) => i === idx ? e.target.value : v))} placeholder="Name" />
                      <button className="text-xs text-red-600" onClick={() => setInvigilators((arr) => arr.filter((_, i) => i !== idx))}>Remove</button>
                    </div>
                  ))}
                  <button className="text-xs text-blue-700" onClick={() => setInvigilators((arr) => [...arr, ''])}>Add Invigilator</button>
                </div>
                <div className="flex justify-between mt-4">
                  <Button color="light" size="sm" onClick={handlePrevious}>Previous</Button>
                  <Button color="light" size="sm" onClick={handleNext}>Next</Button>
                </div>
              </TabItem>

              <TabItem active={activeTab === 3} title="Rooms">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Rooms</div>
                  {rooms.map((r, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input className="flex-1 text-sm" value={r} onChange={(e) => setRooms((arr) => arr.map((v, i) => i === idx ? e.target.value : v))} placeholder="Room name/number" />
                      <button className="text-xs text-red-600" onClick={() => setRooms((arr) => arr.filter((_, i) => i !== idx))}>Remove</button>
                    </div>
                  ))}
                  <button className="text-xs text-blue-700" onClick={() => setRooms((arr) => [...arr, ''])}>Add Room</button>
                </div>
                <div className="flex justify-between mt-4">
                  <Button color="light" size="sm" onClick={handlePrevious}>Previous</Button>
                  <Button color="light" size="sm" onClick={handleNext}>Next</Button>
                </div>
              </TabItem>

              <TabItem active={activeTab === 4} title="Sessions">
                {selectedExamId ? (
                  <>
                    <form onSubmit={addSession} className="grid grid-cols-6 gap-2 items-end mb-3">
                      <div>
                        <label className="block text-xs font-medium">Date</label>
                        <input type="date" className="mt-1 w-full border rounded px-2 py-1" value={newSession.exam_date || ''} onChange={(e) => setNewSession((s) => ({ ...s, exam_date: e.target.value }))} required />
                      </div>
                      <div>
                        <label className="block text-xs font-medium">Start</label>
                        <input type="time" className="mt-1 w-full border rounded px-2 py-1" value={newSession.start_time || ''} onChange={(e) => setNewSession((s) => ({ ...s, start_time: e.target.value }))} required />
                      </div>
                      <div>
                        <label className="block text-xs font-medium">End</label>
                        <input type="time" className="mt-1 w-full border rounded px-2 py-1" value={newSession.end_time || ''} onChange={(e) => setNewSession((s) => ({ ...s, end_time: e.target.value }))} required />
                      </div>
                      <div>
                        <label className="block text-xs font-medium">Course</label>
                        <input className="mt-1 w-full border rounded px-2 py-1" value={newSession.course_name || ''} onChange={(e) => setNewSession((s) => ({ ...s, course_name: e.target.value }))} placeholder="e.g., DAA" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium">Section</label>
                        <input className="mt-1 w-full border rounded px-2 py-1" value={newSession.section || ''} onChange={(e) => setNewSession((s) => ({ ...s, section: e.target.value }))} placeholder="Section A" />
                      </div>
                      <div>
                        <button className="bg-green-600 text-white px-3 py-2 rounded">Add</button>
                      </div>
                    </form>

                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="py-2">Date</th>
                          <th>Time</th>
                          <th>Course</th>
                          <th>Section</th>
                          <th>Room</th>
                          <th>Invigilator</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {sessions.map((s) => (
                          <tr key={s.id} className="border-b">
                            <td className="py-2">{s.exam_date}</td>
                            <td>{s.start_time} - {s.end_time}</td>
                            <td>{s.course_name || s.course_code || '-'}</td>
                            <td>{s.section || '-'}</td>
                            <td>{s.room || '-'}</td>
                            <td>{s.invigilator_name || '-'}</td>
                            <td>
                              <button className="text-red-600" onClick={() => deleteSession(s.id)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="flex justify-between mt-4">
                      <Button color="light" size="sm" onClick={handlePrevious}>Previous</Button>
                      <Button color="light" size="sm" onClick={handleNext}>Next</Button>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500 text-sm">Select an exam on the left to manage sessions.</div>
                )}
              </TabItem>

              <TabItem active={activeTab === 5} title="Review">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded border p-3">
                    <div className="text-sm font-medium">Exams</div>
                    <div className="text-2xl font-semibold">{exams.length}</div>
                  </div>
                  <div className="rounded border p-3">
                    <div className="text-sm font-medium">Sessions for selected</div>
                    <div className="text-2xl font-semibold">{sessions.length}</div>
                  </div>
                  <div className="rounded border p-3">
                    <div className="text-sm font-medium">Setup</div>
                    <div className="text-xs text-gray-600">Courses: {courses.filter((c) => c.trim()).length} • Invigilators: {invigilators.filter((i) => i.trim()).length} • Rooms: {rooms.filter((r) => r.trim()).length}</div>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <Button color="light" size="sm" onClick={handlePrevious}>Previous</Button>
                  <Button color="primary" size="sm" onClick={() => alert('Exam schedule saved!')}>Finish</Button>
                </div>
              </TabItem>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamSchedule;


