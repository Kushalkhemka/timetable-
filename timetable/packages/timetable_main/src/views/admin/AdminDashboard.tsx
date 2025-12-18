import React, { useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/shadcn-ui/Default-Ui/card';
import { Button } from 'src/components/shadcn-ui/Default-Ui/button';

type TeacherGridCell = {
  Course?: string;
  Section?: string;
  Students?: string;
  Room?: string;
  Day?: string;
  Period?: string;
};

type TeacherTimetableData = {
  instructor_id: string;
  instructor_name: string;
  grid: Record<string, Record<string, TeacherGridCell | null>>; // Day -> Period -> cell
  teacher_timetable_classes: any[];
  sections: string[];
  courses: string[];
  total_classes: number;
};

type TeacherTimetablesResponse = {
  teacher_timetables: Record<string, TeacherTimetableData>;
  metadata?: any;
};

const WEEK_DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];

function countWeeklyLoad(grid: TeacherTimetableData['grid']): number {
  let total = 0;
  for (const day of Object.keys(grid)) {
    const dayGrid = grid[day] || {};
    for (const period of Object.keys(dayGrid)) {
      if (dayGrid[period]) total += 1;
    }
  }
  return total;
}

function aggregateLoadByDay(grid: TeacherTimetableData['grid']): number[] {
  return WEEK_DAYS.map((d) => {
    const dayGrid = grid[d] || {};
    return Object.values(dayGrid).filter(Boolean).length;
  });
}

function aggregateSubjectDistribution(teachers: TeacherTimetableData[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const t of teachers) {
    // Prefer explicit classes list if available
    if (Array.isArray(t.teacher_timetable_classes) && t.teacher_timetable_classes.length > 0) {
      for (const cls of t.teacher_timetable_classes) {
        const subject = (cls.course || cls.Course || '').trim();
        const name = subject || 'Unknown';
        counts[name] = (counts[name] || 0) + 1;
      }
      continue;
    }
    // Fallback: walk the grid to collect subjects
    const grid = t.grid || {};
    for (const day of Object.keys(grid)) {
      const dayGrid = grid[day] || {};
      for (const period of Object.keys(dayGrid)) {
        const cell = dayGrid[period];
        if (!cell) continue;
        const subject = (cell as any).Course || (cell as any).course || '';
        const name = (subject || '').trim() || 'Unknown';
        counts[name] = (counts[name] || 0) + 1;
      }
    }
  }
  return counts;
}

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<TeacherTimetablesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/teacher-timetables');
        if (!res.ok) throw new Error('Failed to fetch teacher timetables');
        const json: TeacherTimetablesResponse = await res.json();
        if (!alive) return;
        setData(json);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || 'Failed to load');
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  const teachers: TeacherTimetableData[] = useMemo(() => {
    return data ? Object.values(data.teacher_timetables || {}) : [];
  }, [data]);

  const topLoad = useMemo(() => {
    // Aggregate by normalized name to avoid duplicates
    const byName: Record<string, { name: string; load: number }> = {};
    for (const t of teachers) {
      const name = (t.instructor_name || '').trim();
      const key = name.toLowerCase();
      const load = t.total_classes ?? countWeeklyLoad(t.grid || {});
      if (!byName[key]) byName[key] = { name: name || t.instructor_id, load: 0 };
      byName[key].load += load;
    }
    const list = Object.values(byName);
    return list.sort((a, b) => b.load - a.load).slice(0, 8);
  }, [teachers]);

  const subjectDist = useMemo(() => aggregateSubjectDistribution(teachers), [teachers]);

  const dailyTotals = useMemo(() => {
    // Sum loads across teachers per day
    const totals = WEEK_DAYS.map(() => 0);
    for (const t of teachers) {
      const arr = aggregateLoadByDay(t.grid || {});
      for (let i = 0; i < WEEK_DAYS.length; i++) totals[i] += arr[i];
    }
    return totals;
  }, [teachers]);

  const teacherCount = teachers.length;
  const totalClasses = teachers.reduce((acc, t) => acc += (t.total_classes ?? countWeeklyLoad(t.grid || {})), 0);
  const avgLoad = teacherCount > 0 ? Math.round((totalClasses / teacherCount) * 10) / 10 : 0;

  if (loading) return <div className="p-6">Loading dashboard…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{teacherCount}</div>
            <div className="text-sm text-muted-foreground">Active instructors</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Total Weekly Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalClasses}</div>
            <div className="text-sm text-muted-foreground">Sum across all teachers</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Avg Load / Teacher</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgLoad}</div>
            <div className="text-sm text-muted-foreground">Periods per week</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle>Top Teacher Workload</CardTitle>
              <Button size="sm" onClick={() => window.location.reload()}>Refresh</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Chart
              options={{
                chart: { type: 'bar', foreColor: '#6b7280', toolbar: { show: false }, fontFamily: 'inherit' },
                plotOptions: { bar: { horizontal: true, borderRadius: 6 } },
                xaxis: { categories: topLoad.map((t) => t.name), axisBorder: { show: false }, axisTicks: { show: false } },
                dataLabels: { enabled: false },
                grid: { borderColor: 'rgba(0,0,0,0.06)' },
                colors: ['var(--color-primary)'],
                tooltip: { theme: 'dark' }
              }}
              series={[{ name: 'Weekly periods', data: topLoad.map((t) => t.load) }]}
              type="bar"
              height={360}
            />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Subject Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(subjectDist).length === 0 ? (
              <div className="h-[360px] flex items-center justify-center text-muted-foreground">
                No subject data available
              </div>
            ) : (
              <Chart
                options={{
                  labels: Object.keys(subjectDist),
                  legend: { position: 'bottom' },
                  dataLabels: { enabled: false },
                  chart: { type: 'donut', foreColor: '#6b7280', fontFamily: 'inherit' },
                  tooltip: { theme: 'dark' }
                }}
                series={Object.values(subjectDist)}
                type="donut"
                height={360}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Daily Total Load</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={{
                chart: { type: 'line', foreColor: '#6b7280', toolbar: { show: false }, fontFamily: 'inherit' },
                stroke: { curve: 'straight', width: 2 },
                markers: { size: 3 },
                grid: { borderColor: 'rgba(0,0,0,0.06)' },
                xaxis: { categories: WEEK_DAYS, axisBorder: { show: false } },
                colors: ['var(--color-secondary)'],
                tooltip: { theme: 'dark' }
              }}
              series={[{ name: 'Total periods', data: dailyTotals }]}
              type="line"
              height={360}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;


