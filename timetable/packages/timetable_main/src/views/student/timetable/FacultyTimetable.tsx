import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/shadcn-ui/Default-Ui/card';
import { Badge } from 'src/components/shadcn-ui/Default-Ui/badge';
import { Button } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { RefreshCw } from 'lucide-react';

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

const FacultyTimetable: React.FC = () => {
  const [selectedFacultyId, setSelectedFacultyId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teacherTimetables, setTeacherTimetables] = useState<Record<string, TeacherTimetableData>>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/teacher-timetables');
        if (!res.ok) throw new Error('Failed to fetch teacher timetables');
        const data: TeacherTimetablesResponse = await res.json();
        setTeacherTimetables(data.teacher_timetables);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load teacher timetables');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const teacherList = useMemo(() => Object.entries(teacherTimetables).map(([id, t]) => ({
    id,
    name: t.instructor_name,
    specializations: t.courses,
  })), [teacherTimetables]);

  const specializationOptions = useMemo(() => {
    const set = new Set<string>();
    teacherList.forEach(t => t.specializations.forEach(s => set.add(s)));
    return Array.from(set).sort();
  }, [teacherList]);

  const filteredTeachers = useMemo(() => teacherList.filter(t => {
    const matchesSearch = !searchTerm || t.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = !selectedSpecialization || t.specializations.includes(selectedSpecialization);
    return matchesSearch && matchesSpec;
  }), [teacherList, searchTerm, selectedSpecialization]);

  const currentTeacher = selectedFacultyId ? teacherTimetables[selectedFacultyId] : null;

  function flattenGridToRows() {
    if (!currentTeacher) return [] as { day: string; time: string; subject: string; room: string }[];
    const rows: { day: string; time: string; subject: string; room: string }[] = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const periods = [
      { time: '8:00 AM', key: 'P1' },
      { time: '9:00 AM', key: 'P2' },
      { time: '10:00 AM', key: 'P3' },
      { time: '11:00 AM', key: 'P4' },
      { time: '12:00 PM', key: 'P5' },
      { time: '1:00 PM', key: 'P6' },
      { time: '2:00 PM', key: 'P7' },
      { time: '3:00 PM', key: 'P8' },
      { time: '4:00 PM', key: 'P9' },
      { time: '5:00 PM', key: 'P10' },
    ];
    days.forEach(day => {
      periods.forEach(p => {
        const ev = currentTeacher.grid?.[day]?.[p.key];
        if (ev) {
          rows.push({ day, time: p.time, subject: ev.Course, room: ev.Room });
        }
      });
    });
    return rows;
  }

  const flattened = flattenGridToRows();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Faculty Timetable</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled={loading} onClick={() => window.location.reload()} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Search Faculty</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1">
              <input
                placeholder="Search by faculty name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-64 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Specializations</option>
              {specializationOptions.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
            <select
              value={selectedFacultyId}
              onChange={(e) => setSelectedFacultyId(e.target.value)}
              className="w-72 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Faculty</option>
              {filteredTeachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} {t.specializations.length ? `• ${t.specializations.join(', ')}` : ''}
                </option>
              ))}
            </select>
          </div>
          {error && (
            <div className="mt-3 text-sm text-red-600">{error}</div>
          )}
        </CardContent>
      </Card>

      {/* Faculty List */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Faculty Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeachers.map((t) => (
              <div
                key={t.id}
                className={`p-4 rounded-lg cursor-pointer transition-colors shadow-sm ${
                  selectedFacultyId === t.id
                    ? 'bg-primary/5 border border-primary/20'
                    : 'bg-white dark:bg-gray-800 hover:shadow-md'
                }`}
                onClick={() => setSelectedFacultyId(t.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon icon="solar:user-line-duotone" className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{t.specializations.join(', ') || '—'}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Subjects:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {t.specializations.map((s, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Faculty Timetable */}
      {selectedFacultyId && currentTeacher && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon icon="solar:calendar-line-duotone" className="text-primary" />
              {currentTeacher.instructor_name}'s Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Day</th>
                    <th className="text-left p-3 font-semibold">Time</th>
                    <th className="text-left p-3 font-semibold">Subject</th>
                    <th className="text-left p-3 font-semibold">Room</th>
                  </tr>
                </thead>
                <tbody>
                  {flattened.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">
                        <Badge variant="outline">{item.day}</Badge>
                      </td>
                      <td className="p-3 font-medium">{item.time}</td>
                      <td className="p-3">{item.subject}</td>
                      <td className="p-3">{item.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FacultyTimetable;
