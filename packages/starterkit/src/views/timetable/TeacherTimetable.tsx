import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Calendar, Users, BookOpen, MapPin } from 'lucide-react';

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

const TeacherTimetable: React.FC = () => {
  const [teacherTimetables, setTeacherTimetables] = useState<Record<string, TeacherTimetableData>>({});
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [metadata, setMetadata] = useState<any>(null);

  const daysOrdered = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periodsOrdered = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10'];

  useEffect(() => {
    fetchTeacherTimetables();
  }, []);

  const fetchTeacherTimetables = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/teacher-timetables');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: TeacherTimetablesResponse = await response.json();
      setTeacherTimetables(data.teacher_timetables);
      setMetadata(data.metadata);
      
      // Set first teacher as default selection
      const teacherIds = Object.keys(data.teacher_timetables);
      if (teacherIds.length > 0) {
        setSelectedTeacher(teacherIds[0]);
      }
    } catch (err) {
      console.error('Error fetching teacher timetables:', err);
      setError('Failed to load teacher timetables. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPeriodTime = (period: string): string => {
    const timeMap: Record<string, string> = {
      'P1': '8:00-9:00 AM',
      'P2': '9:00-10:00 AM',
      'P3': '10:00-11:00 AM',
      'P4': '11:00-12:00 PM',
      'P5': '12:00-1:00 PM',
      'P6': '1:00-2:00 PM',
      'P7': '2:00-3:00 PM',
      'P8': '3:00-4:00 PM',
      'P9': '4:00-5:00 PM',
      'P10': '5:00-6:00 PM'
    };
    return timeMap[period] || period;
  };

  const getClassTypeColor = (part: string): string => {
    switch (part?.toLowerCase()) {
      case 'l':
      case 'lecture':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 't':
      case 'tutorial':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'p':
      case 'practical':
      case 'lab':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const currentTeacher = selectedTeacher ? teacherTimetables[selectedTeacher] : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading teacher timetables...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (Object.keys(teacherTimetables).length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No teacher timetables found. Please generate a timetable first.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teacher Timetables</h1>
          <p className="text-muted-foreground">
            View individual teacher schedules and workload distribution
          </p>
        </div>
        <Button onClick={fetchTeacherTimetables} variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Metadata */}
      {metadata && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{metadata.total_teachers}</div>
                <div className="text-sm text-muted-foreground">Total Teachers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{metadata.total_classes}</div>
                <div className="text-sm text-muted-foreground">Total Classes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{metadata.timetable_name}</div>
                <div className="text-sm text-muted-foreground">Timetable Name</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {new Date(metadata.generated_at).toLocaleDateString()}
                </div>
                <div className="text-sm text-muted-foreground">Generated</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Teacher Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Teacher</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a teacher to view their timetable" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(teacherTimetables).map(([teacherId, teacher]) => (
                <SelectItem key={teacherId} value={teacherId}>
                  <div className="flex items-center justify-between w-full">
                    <span>{teacher.instructor_name}</span>
                    <Badge variant="secondary" className="ml-2">
                      {teacher.total_classes} classes
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Teacher Details */}
      {currentTeacher && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {currentTeacher.instructor_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Courses</div>
                  <div className="text-sm text-muted-foreground">
                    {currentTeacher.courses.join(', ')}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Sections</div>
                  <div className="text-sm text-muted-foreground">
                    {currentTeacher.sections.join(', ')}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Total Classes</div>
                  <div className="text-sm text-muted-foreground">
                    {currentTeacher.total_classes} per week
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timetable Grid */}
      {currentTeacher && (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-3 text-left text-sm font-medium bg-muted/50">Time/Day</th>
                    {daysOrdered.map((day) => (
                      <th key={day} className="p-3 text-center text-sm font-medium bg-muted/50">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {periodsOrdered.map((period) => (
                    <tr key={period} className="border-b border-border/50">
                      <td className="p-3 text-sm font-medium bg-muted/30">
                        <div>{period}</div>
                        <div className="text-xs text-muted-foreground">
                          {getPeriodTime(period)}
                        </div>
                      </td>
                      {daysOrdered.map((day) => {
                        const cell = currentTeacher.grid?.[day]?.[period] || null;
                        return (
                          <td key={`${day}-${period}`} className="p-2 align-top">
                            {cell ? (
                              <div className={`p-2 rounded-lg border text-xs ${getClassTypeColor(cell.Part)}`}>
                                <div className="font-semibold mb-1">
                                  {cell.Course} ({cell.Part})
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    <span>{cell.Students}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>{cell.Room}</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-xs text-muted-foreground text-center py-2">
                                Free
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-100 border border-blue-200"></div>
              <span className="text-sm">Lecture (L)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100 border border-green-200"></div>
              <span className="text-sm">Tutorial (T)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-100 border border-purple-200"></div>
              <span className="text-sm">Practical/Lab (P)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherTimetable;
