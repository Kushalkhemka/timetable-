import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/shadcn-ui/Default-Ui/card';
import { Badge } from 'src/components/shadcn-ui/Default-Ui/badge';
import { Input } from 'src/components/shadcn-ui/Default-Ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/shadcn-ui/Default-Ui/select';
import { Icon } from '@iconify/react';
import { supabase } from 'src/services/supabase';

const ALL_ROOMS_VALUE = '__ALL__';

const RoomTimetable: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState(ALL_ROOMS_VALUE);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [rooms, setRooms] = useState<Array<{ id: string; code: string; name?: string; type?: string; capacity?: number; building?: string }>>([]);
  const [sections, setSections] = useState<Array<{ id: string; name: string }>>([]);
  const [dbSchedule, setDbSchedule] = useState<Array<{ day: string; period: string; room: string; subject: string; faculty: string }>>([]);

  // Load rooms on mount
  useEffect(() => {
    let isActive = true;
    const loadRooms = async () => {
      try {
        setLoadingRooms(true);
        const { data, error } = await supabase
          .from('rooms')
          .select('id, code, name, type, capacity, building')
          .order('code');
        if (error) {
          console.error('Error loading rooms:', error);
          return;
        }
        if (!isActive) return;
        const mapped = (data || []).map((r: any) => ({
          id: r.id,
          code: r.code,
          name: r.name || r.code,
          type: r.type,
          capacity: r.capacity,
          building: r.building,
        }));
        setRooms(mapped);
        // Auto-select first room so timetable renders immediately
        if (selectedRoom === ALL_ROOMS_VALUE && mapped.length > 0) {
          const first = mapped[0];
          const value = String(first.name || first.code || first.id);
          setSelectedRoom(value);
        }
      } finally {
        if (isActive) setLoadingRooms(false);
      }
    };
    loadRooms();
    return () => {
      isActive = false;
    };
  }, []);

  // Load sections once (used for per-room mock fill)
  useEffect(() => {
    let isActive = true;
    const loadSectionsOnly = async () => {
      try {
        setLoadingSchedule(true);
        const { data, error } = await supabase
          .from('timetable_sections')
          .select('id, section_name')
          .order('section_name');
        if (error) {
          console.error('Error loading sections:', error);
          return;
        }
        if (!isActive) return;
        const secs = (data || []).map((s: any) => ({ id: s.id, name: s.section_name as string }));
        setSections(secs);
      } finally {
        if (isActive) setLoadingSchedule(false);
      }
    };
    loadSectionsOnly();
    return () => { isActive = false; };
  }, []);

  // Load real timetable classes once and cache locally
  useEffect(() => {
    let isActive = true;
    const loadDb = async () => {
      try {
        const { data, error } = await supabase
          .from('timetable_classes')
          .select('day, period, room, course, instructor_name')
          .order('day', { ascending: true })
          .order('period', { ascending: true })
          .limit(1000);
        if (error) {
          console.error('Error fetching timetable_classes:', error);
          return;
        }
        if (!isActive) return;
        const mapped = (data || []).map((row: any) => ({
          day: row.day || '-',
          period: row.period || '-',
          room: row.room || '-',
          subject: row.course || '-',
          faculty: row.instructor_name || '—',
        }));
        setDbSchedule(mapped);
      } finally {
        // no-op
      }
    };
    loadDb();
    return () => { isActive = false; };
  }, []);

  const filteredRooms = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return rooms.filter(room =>
      (room.name || '').toLowerCase().includes(q) ||
      (room.building || '').toLowerCase().includes(q) ||
      (room.type || '').toLowerCase().includes(q) ||
      (room.code || '').toLowerCase().includes(q)
    );
  }, [rooms, searchTerm]);

  // Build visible schedule for selected room: use DB rows, then fill gaps with client mock for that room only
  const visibleSchedule = useMemo(() => {
    const normalize = (s: string) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const matchesRoom = (rowRoom: string) => {
      if (selectedRoom === ALL_ROOMS_VALUE) return true;
      const a = normalize(selectedRoom);
      const b = normalize(rowRoom);
      if (!b) return false; // do not match rows with empty/unknown room
      return a === b; // strict match only to avoid over-inclusion
    };
    const db = dbSchedule.filter(r => matchesRoom(r.room));

    if (selectedRoom === ALL_ROOMS_VALUE) {
      // For All Rooms, show only DB rows with a non-empty room
      return dbSchedule.filter(r => (r.room || '').trim().length > 0);
    }

    // Create per-room mock only for the selected room to fill empty day/periods
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
    const periods = ['P1','P2','P3','P4','P5','P6','P7','P8'];
    const key = (x: { day: string; period: string }) => `${x.day}|${x.period}`;
    const taken = new Set(db.map(key));
    const merged = [...db];

    let secIdx = 0;
    for (const d of days) {
      for (const p of periods) {
        const k = `${d}|${p}`;
        if (!taken.has(k)) {
          const s = sections[secIdx % Math.max(1, sections.length)];
          merged.push({
            day: d,
            period: p,
            room: selectedRoom,
            subject: s ? s.name : 'Section',
            faculty: '—',
          });
          secIdx += 1;
        }
      }
    }
    return merged;
  }, [dbSchedule, selectedRoom, sections]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Room Timetable</h1>
      </div>

      {/* Search and Filter */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Search Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by room name, building, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedRoom} onValueChange={(v) => setSelectedRoom(v)}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select Room" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_ROOMS_VALUE}>All Rooms</SelectItem>
                {filteredRooms
                  .map((room) => {
                    const value = String(room.name || room.code || room.id || '');
                    return { room, value };
                  })
                  .filter(({ value }) => value.trim().length > 0)
                  .map(({ room, value }) => (
                  <SelectItem key={room.id} value={value}>
                    {(room.name || room.code || room.id)}{room.building ? ` - ${room.building}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Room List */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Available Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loadingRooms && (
              <div className="col-span-3 text-sm text-gray-500">Loading rooms…</div>
            )}
            {!loadingRooms && filteredRooms.length === 0 && (
              <div className="col-span-3 text-sm text-gray-500">No rooms available. Please add rooms in Supabase.</div>
            )}
            {!loadingRooms && filteredRooms.map((room) => (
              <div
                key={room.id}
                className={`p-4 rounded-lg cursor-pointer transition-colors shadow-sm ${
                  selectedRoom === String(room.name || room.code || room.id)
                    ? 'bg-primary/5 border border-primary/20'
                    : 'bg-white dark:bg-gray-800 hover:shadow-md'
                }`}
                onClick={() => setSelectedRoom(String(room.name || room.code || room.id))}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon 
                      icon={(room.type || '').toUpperCase() === 'LAB' || (room.type || '').toLowerCase().includes('lab') ? 'solar:monitor-line-duotone' : 'solar:home-2-line-duotone'} 
                      className="text-primary" 
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{room.name || room.code}</h3>
                    {room.building && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">{room.building}</p>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <Badge variant="secondary">{room.type || 'LECTURE'}</Badge>
                  {typeof room.capacity === 'number' && (
                    <span className="text-xs text-gray-500">Capacity: {room.capacity}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Room Timetable */}
      {selectedRoom && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon icon="solar:home-2-line-duotone" className="text-primary" />
              {selectedRoom} Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {loadingSchedule && (
                <div className="text-sm text-gray-500">Loading schedule…</div>
              )}
              {!loadingSchedule && visibleSchedule.length === 0 && (
                <div className="text-sm text-gray-500">No mock entries yet. Try another room or refresh.</div>
              )}
              {!loadingSchedule && visibleSchedule.length > 0 && (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Day</th>
                      <th className="text-left p-3 font-semibold">Period</th>
                      <th className="text-left p-3 font-semibold">Subject</th>
                      <th className="text-left p-3 font-semibold">Faculty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleSchedule.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3">
                          <Badge variant="outline">{item.day}</Badge>
                        </td>
                        <td className="p-3 font-medium">{item.period}</td>
                        <td className="p-3">{item.subject}</td>
                        <td className="p-3">{item.faculty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RoomTimetable;
