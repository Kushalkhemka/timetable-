import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from 'src/components/shadcn-ui/Default-Ui/dialog';
import { Button } from 'src/components/shadcn-ui/Default-Ui/button';
import { Card, CardContent } from 'src/components/shadcn-ui/Default-Ui/card';
import {
  Calendar,
  Clock,
  BookOpen,
  Users,
  RefreshCw,
  Check,
  Lightbulb,
  UserCheck,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
} from 'lucide-react';
import { Teacher, SubstituteRecommendation, Timetable } from 'src/types/substitution';
import { substitutionService } from 'src/services/substitutionService';

interface AssignSubstituteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher;
  date: string;
}

const AssignSubstituteDialog: React.FC<AssignSubstituteDialogProps> = ({
  isOpen,
  onClose,
  teacher,
  date,
}) => {
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<SubstituteRecommendation[]>([]);
  const [selectedSubstitute, setSelectedSubstitute] = useState<Teacher | null>(null);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timetable, setTimetable] = useState<Timetable | null>(null);

  // Fetch timetable data when component mounts or teacher/date changes
  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const teacherTimetableData = await substitutionService.getTeacherTimetable(teacher.id);
        const timetableData = substitutionService.convertToTimetable(
          teacherTimetableData.teacher_timetable, 
          teacher.id, 
          date
        );
        setTimetable(timetableData);
      } catch (error) {
        console.error('Error fetching timetable:', error);
        setTimetable(null);
      }
    };

    if (isOpen && teacher.id) {
      fetchTimetable();
    }
  }, [isOpen, teacher.id, date]);

  // Mock substitute recommendations function
  const getSubstituteRecommendations = (_teacherId: string, _periodIds: string[], _date: string): SubstituteRecommendation[] => {
    // This is a simplified mock implementation
    // In a real app, this would query the database for available teachers
    return [
      {
        teacher: {
          id: 'substitute-1',
          name: 'Dr. Jane Smith',
          subject: 'Mathematics',
          color: 'bg-blue-500',
          initial: 'JS',
          isAvailable: true,
          todayLoad: 2,
          weeklyLoad: 15,
          classes: ['CSE-A', 'CSE-B']
        },
        matchScore: 95,
        reason: 'Same subject expertise',
        conflicts: []
      },
      {
        teacher: {
          id: 'substitute-2',
          name: 'Prof. John Doe',
          subject: 'Physics',
          color: 'bg-green-500',
          initial: 'JD',
          isAvailable: true,
          todayLoad: 3,
          weeklyLoad: 18,
          classes: ['CSE-C', 'CSE-D']
        },
        matchScore: 85,
        reason: 'Available during requested time',
        conflicts: []
      }
    ];
  };

  useEffect(() => {
    if (selectedPeriods.length > 0) {
      const recs = getSubstituteRecommendations(teacher.id, selectedPeriods, date);
      setRecommendations(recs);
    } else {
      setRecommendations([]);
    }
  }, [selectedPeriods, teacher.id, date]);

  const handlePeriodSelect = (periodId: string) => {
    setSelectedPeriods(prev => 
      prev.includes(periodId) 
        ? prev.filter(id => id !== periodId)
        : [...prev, periodId]
    );
  };

  const handleSubstituteSelect = (substitute: Teacher) => {
    setSelectedSubstitute(substitute);
  };

  const handleConfirm = async () => {
    if (!selectedSubstitute || selectedPeriods.length === 0) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    // Close dialog and reset state
    onClose();
    setSelectedPeriods([]);
    setSelectedSubstitute(null);
    setNotes('');
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Assign Substitute for {teacher.initial}
          </DialogTitle>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            {formatDate(date)}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Select Periods Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Select Periods
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">TIME TABLE</span>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-sm">
                  {selectedPeriods.length} period(s)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {timetable?.periods.map((period) => (
                <div
                  key={period.id}
                  onClick={() => handlePeriodSelect(period.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedPeriods.includes(period.id)
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Period {period.periodNumber}
                    </h4>
                    {selectedPeriods.includes(period.id) && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(period.startTime)} - {formatTime(period.endTime)}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {period.subject}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {period.className}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Tip: Click to select periods you want to assign a substitute for. Periods with conflicts or already assigned substitutes cannot be selected.
              </p>
            </div>
          </div>

          {/* Recommended Substitutes Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recommended Substitutes
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Class Familiarity - Teaching the same class
                </p>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh List
              </Button>
            </div>

            {selectedPeriods.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No available substitutes found</p>
                <p className="text-sm">Please select periods first</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <Card
                    key={rec.teacher.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedSubstitute?.id === rec.teacher.id
                        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => handleSubstituteSelect(rec.teacher)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${rec.teacher.color} flex items-center justify-center text-white font-semibold`}>
                            {rec.teacher.initial}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {rec.teacher.initial}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {rec.teacher.subject}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 px-2 py-1 rounded-full text-xs font-medium">
                            {rec.reason}
                          </span>
                          {selectedSubstitute?.id === rec.teacher.id && (
                            <Check className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <CalendarIcon className="w-4 h-4" />
                          <span>Works in: TIME TABLE</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <BookOpen className="w-4 h-4" />
                          <span>Subjects: {rec.teacher.subject}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>Classes: {rec.teacher.classes.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <CalendarIcon className="w-4 h-4" />
                          <span>Today's Load: {rec.teacher.todayLoad} lessons</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <ClockIcon className="w-4 h-4" />
                          <span>Experience: {rec.teacher.weeklyLoad} lessons/week</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Additional Notes Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Additional Notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional instructions or notes for the substitute teacher..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedSubstitute || selectedPeriods.length === 0 || isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4 mr-2" />
                Confirm Substitute
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignSubstituteDialog;
