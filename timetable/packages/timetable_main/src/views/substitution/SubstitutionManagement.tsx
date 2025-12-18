import React, { useState, useEffect } from 'react';
import { Card } from 'src/components/shadcn-ui/Default-Ui/card';
import { Button } from 'src/components/shadcn-ui/Default-Ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeadCell,
} from 'flowbite-react';
import { 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  Search, 
  RefreshCw,
  UserPlus,
  BarChart3,
  CheckCircle,
  Filter,
  Download,
  Eye,
  Edit
} from 'lucide-react';
import { Teacher, Timetable } from 'src/types/substitution';
import AssignSubstituteDialog from './AssignSubstituteDialog';
import TitleIconCard from 'src/components/shared/TitleIconCard';
import CardBox from 'src/components/shared/CardBox';
import { Badge } from 'flowbite-react';
import { substitutionService } from 'src/services/substitutionService';

const SubstitutionManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedDate] = useState('2025-09-09');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timetable, setTimetable] = useState<Timetable | null>(null);

  // Fetch teacher timetable data from database
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        const teacherTimetablesData = await substitutionService.getTeacherTimetables();
        
        // Convert teacher timetable data to Teacher format
        const teachersData = Object.values(teacherTimetablesData.teacher_timetables).map(teacherData => 
          substitutionService.convertToTeacher(teacherData, teacherData.instructor_id)
        );
        
        setTeachers(teachersData);
        
        // Set first teacher as selected if available
        if (teachersData.length > 0) {
          setSelectedTeacher(teachersData[0]);
        }
      } catch (error) {
        console.error('Error fetching teacher timetables:', error);
        // Set empty state on error
        setTeachers([]);
        setSelectedTeacher(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  // Fetch timetable for selected teacher
  useEffect(() => {
    const fetchTimetable = async () => {
      if (!selectedTeacher) return;
      
      try {
        const teacherTimetableData = await substitutionService.getTeacherTimetable(selectedTeacher.id);
        const timetableData = substitutionService.convertToTimetable(
          teacherTimetableData.teacher_timetable, 
          selectedTeacher.id, 
          selectedDate
        );
        setTimetable(timetableData);
      } catch (error) {
        console.error('Error fetching timetable:', error);
        // Set empty timetable on error
        setTimetable(null);
      }
    };

    fetchTimetable();
  }, [selectedTeacher, selectedDate]);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // Normalize repeated section suffixes like "..._SEC-1__SEC-1" -> "..._SEC-1"
  const formatSectionName = (raw: string | undefined) => {
    if (!raw) return '';
    // Remove duplicate occurrences of the same SEC-<n>
    const seen = new Set<string>();
    let cleaned = raw.replace(/SEC-\d+/g, (m) => {
      if (seen.has(m)) return '';
      seen.add(m);
      return m;
    });
    // Collapse multiple underscores/spaces left by removals
    cleaned = cleaned
      .replace(/_{2,}/g, '_')
      .replace(/\s{2,}/g, ' ')
      .replace(/(_\s*|-\s*)$/g, '')
      .replace(/\s*(_){1}\s*/g, '_');
    return cleaned.trim();
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-lightgray dark:bg-darkgray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-darklink dark:text-bodytext">Loading faculty data...</p>
        </div>
      </div>
    );
  }

  if (!selectedTeacher && !loading) {
    return (
      <div className="min-h-screen bg-lightgray dark:bg-darkgray flex items-center justify-center">
        <div className="text-center">
          <p className="text-darklink dark:text-bodytext">No teacher data available</p>
          <p className="text-sm text-gray-500 mt-2">Please check your database connection</p>
        </div>
      </div>
    );
  }

  if (!selectedTeacher) {
    return null; // Still loading
  }

  return (
    <div className="min-h-screen bg-lightgray dark:bg-darkgray">
      {/* Header */}
      <div className="bg-white dark:bg-darkgray shadow-sm border-b border-ld">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-ld">
                Substitute Management
              </h1>
              <p className="text-darklink dark:text-bodytext mt-1">
                Manage staff absences and substitutions efficiently
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Teachers Table */}
          <div className="lg:col-span-5">
            <TitleIconCard title="Teachers Directory" className="h-full sticky top-24" contentClassName="pt-3 p-4">
              <div className="flex flex-col h-full">
                {/* Search Bar */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search teachers..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-ld focus:border-primary bg-transparent px-3 py-2 pl-10 file:border-0 file:rounded-sm file:text-sm file:font-medium file:text-primary file:bg-lightprimary placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 text-ld text-sm focus:ring-0"
                  />
                </div>

                {/* Teachers Table */}
                <div className="flex-grow border border-ld rounded-lg overflow-hidden">
                  <Table striped className="min-w-full">
                    <TableHead>
                      <TableRow>
                        <TableHeadCell className="text-sm font-semibold py-3">Teacher</TableHeadCell>
                        <TableHeadCell className="text-sm font-semibold py-3">Subject</TableHeadCell>
                        <TableHeadCell className="text-sm font-semibold py-3 text-right">Status</TableHeadCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className="divide-y divide-border dark:divide-darkborder">
                      {filteredTeachers.map((teacher) => (
                        <TableRow 
                          key={teacher.id}
                          className={`cursor-pointer transition-colors ${
                            selectedTeacher.id === teacher.id
                              ? 'bg-lightprimary hover:bg-lightprimary'
                              : 'hover:bg-lighthover'
                          }`}
                          onClick={() => setSelectedTeacher(teacher)}
                        >
                          <TableCell className="py-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full ${teacher.color} flex items-center justify-center text-white font-semibold text-sm`}>
                                {teacher.initial}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-ld text-sm">
                                    {teacher.name}
                                  </h4>
                                  {selectedTeacher.id === teacher.id && (
                                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-3">
                            <p className="text-sm text-darklink dark:text-bodytext">
                              {teacher.subject}
                            </p>
                          </TableCell>
                          <TableCell className="py-3 text-right">
                            <Badge 
                              color={teacher.isAvailable ? "success" : "error"}
                              className="text-xs"
                            >
                              {teacher.isAvailable ? 'Available' : 'Unavailable'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TitleIconCard>
          </div>

          {/* Right Column - Timetable and Details */}
          <div className="lg:col-span-7">
            <div className="space-y-6">
              {/* Teacher Details Card */}
              <CardBox>
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full ${selectedTeacher.color} flex items-center justify-center text-white font-bold text-lg`}>
                      {selectedTeacher.initial}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-ld">{selectedTeacher.name}</h2>
                      <p className="text-darklink dark:text-bodytext text-sm">{selectedTeacher.subject}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge color={selectedTeacher.isAvailable ? "success" : "error"} className="text-xs">
                          {selectedTeacher.isAvailable ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button variant="outline" size="sm" className="text-xs h-8 px-3 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400">
                      <Eye className="w-3 h-3 mr-1.5" />
                      View Profile
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs h-8 px-3 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400">
                      <Edit className="w-3 h-3 mr-1.5" />
                      Edit
                    </Button>
                    <Button 
                      size="sm"
                      className="flex items-center gap-1.5 text-xs h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
                      onClick={() => setIsAssignDialogOpen(true)}
                    >
                      <UserPlus className="w-3 h-3" />
                      Assign Substitute
                    </Button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Today's Load</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedTeacher.todayLoad} periods</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Weekly Load</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedTeacher.weeklyLoad} periods</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Classes</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedTeacher.classes.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBox>

              {/* Timetable Card */}
              <TitleIconCard 
                title={`Timetable - ${formatDate(selectedDate)}`}
                className="h-fit"
              >
                {/* Date Navigation */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Calendar className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium text-darklink dark:text-bodytext">
                        {selectedDate}
                      </span>
                      <Button variant="ghost" size="sm">
                        <Calendar className="w-4 h-4" />
                      </Button>
                    </div>
                    <Badge color="info" className="text-sm">
                      {timetable?.periods.length || 0} periods
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Today</Button>
                    <Button variant="outline" size="sm">Tomorrow</Button>
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Periods Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {timetable?.periods.map((period) => (
                    <Card 
                      key={period.id}
                      className={`p-4 transition-all duration-200 ${
                        period.isSubstituted
                          ? 'border-success bg-lightsuccess'
                          : 'border-ld hover:border-primary'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-ld">
                          Period {period.periodNumber}
                        </h3>
                        {period.isSubstituted && (
                          <Badge color="success" className="text-xs">
                            Substitute
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-darklink dark:text-bodytext">
                          <Clock className="w-4 h-4" />
                          {formatTime(period.startTime)} - {formatTime(period.endTime)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-darklink dark:text-bodytext break-words whitespace-normal">
                          <BookOpen className="w-4 h-4" />
                          <span className="break-words whitespace-normal">{period.subject}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-darklink dark:text-bodytext break-words whitespace-normal">
                          <Users className="w-4 h-4" />
                          <span className="break-words whitespace-normal">{formatSectionName(period.className)}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TitleIconCard>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Substitute Dialog */}
      {selectedTeacher && (
        <AssignSubstituteDialog
          isOpen={isAssignDialogOpen}
          onClose={() => setIsAssignDialogOpen(false)}
          teacher={selectedTeacher}
          date={selectedDate}
        />
      )}
    </div>
  );
};

export default SubstitutionManagement;
