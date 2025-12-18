import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from 'src/components/shadcn-ui/Default-Ui/card';
import { Button } from 'src/components/shadcn-ui/Default-Ui/button';
import { useAuth } from 'src/context/AuthContext';
import TimetableCalendar from 'src/components/timetable/TimetableCalendar';
import { RefreshCw, Calendar, Download } from 'lucide-react';

interface TimetableData {
  sections: Record<string, { grid: Record<string, Record<string, any>> }>;
  raw?: any[];
  log?: string;
}

const MyTimetable: React.FC = () => {
  const { user } = useAuth();
  const [timetableData, setTimetableData] = useState<TimetableData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Get student's section from user metadata
  const studentSection = user?.user_metadata?.section || 'ELECTRICAL_ENGINEERING_SEC-2__SEC-2';

  // Fetch timetable data on component mount
  useEffect(() => {
    const loadTimetableData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch timetable data from database
        const response = await fetch('/api/latest-timetable');
        
        if (response.ok) {
          const data = await response.json();
          
          // Filter data for the student's section
          if (data.sections && data.sections[studentSection]) {
            const filteredData = {
              sections: {
                [studentSection]: data.sections[studentSection]
              },
              raw: data.raw?.filter((item: any) => item.Section === studentSection) || [],
              log: data.log
            };
            setTimetableData(filteredData);
            console.log(`📚 Timetable loaded for section: ${studentSection}`);
          } else {
            throw new Error(`No timetable data found for section: ${studentSection}`);
          }
        } else {
          throw new Error('No timetable data available from database');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load timetable data');
        console.error('Failed to fetch timetable:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTimetableData();
  }, [studentSection]);

  const fetchLatestTimetable = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/latest-timetable');
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.sections && data.sections[studentSection]) {
          const filteredData = {
            sections: {
              [studentSection]: data.sections[studentSection]
            },
            raw: data.raw?.filter((item: any) => item.Section === studentSection) || [],
            log: data.log
          };
          setTimetableData(filteredData);
          console.log(`📚 Timetable refreshed for section: ${studentSection}`);
        } else {
          throw new Error(`No timetable data found for section: ${studentSection}`);
        }
      } else {
        throw new Error('No timetable data available');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load timetable data');
      console.error('Failed to fetch timetable:', err);
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
    a.download = `timetable_${studentSection}_${new Date().toISOString().split('T')[0]}.csv`;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">My Timetable</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Your personal class schedule for {studentSection}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={fetchLatestTimetable}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
              
              {timetableData && (
                <Button
                  onClick={downloadTimetable}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download CSV
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="border-0 shadow-sm bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-700">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span className="font-medium">Loading Timetable Data...</span>
            </div>
            <p className="text-blue-600 text-sm mt-1">Fetching your section timetable from database</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="border-0 shadow-sm bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">No Timetable Data</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Timetable Calendar */}
      {!loading && timetableData && <TimetableCalendar data={timetableData} />}

      {/* Timetable Information */}
      {!loading && timetableData && (
        <Card className="border-0 shadow-sm bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-1">Timetable Information</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Section:</strong> {studentSection}</p>
                  <p><strong>Total Classes:</strong> {timetableData.raw?.length || 0}</p>
                  <p><strong>Time Range:</strong> 8:00 AM - 6:00 PM</p>
                  <p><strong>Days:</strong> Monday - Friday</p>
                  <p><strong>Semester:</strong> {user?.user_metadata?.semester || '6th'} Semester</p>
                  <p><strong>Department:</strong> {user?.user_metadata?.department || 'Electrical Engineering'}</p>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                    🗄️ Database
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyTimetable;
