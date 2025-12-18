import { useMemo, useState, useEffect } from 'react';
import { format } from 'date-fns';

// Components from local shadcn-ui library
import { Badge } from 'src/components/shadcn-ui/Default-Ui/badge';
import { Button } from 'src/components/shadcn-ui/Default-Ui/button';
import { Calendar } from 'src/components/shadcn-ui/Default-Ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/shadcn-ui/Default-Ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'src/components/shadcn-ui/Default-Ui/card';
import { Avatar, AvatarFallback } from 'src/components/shadcn-ui/Default-Ui/avatar';
import { Input } from 'src/components/shadcn-ui/Default-Ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/shadcn-ui/Default-Ui/tabs';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from 'src/components/shadcn-ui/Default-Ui/dialog';
import { Textarea } from 'src/components/shadcn-ui/Default-Ui/textarea';
import { Label } from 'src/components/shadcn-ui/Default-Ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/shadcn-ui/Default-Ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'src/components/shadcn-ui/Default-Ui/table';
import { facultyService, Faculty } from 'src/services/facultyService';

type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

type LeaveRequest = {
  id: string;
  employee: string;
  role: string;
  from: Date;
  to: Date;
  days: number;
  type: string;
  status: LeaveStatus;
};

const mockLeaves: LeaveRequest[] = [
  {
    id: 'LV-1021',
    employee: 'Ananya Sharma',
    role: 'Assistant Professor',
    from: new Date(),
    to: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    days: 3,
    type: 'Casual Leave',
    status: 'Pending',
  },
  {
    id: 'LV-1018',
    employee: 'Rahul Verma',
    role: 'Professor',
    from: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    to: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    days: 3,
    type: 'Medical Leave',
    status: 'Approved',
  },
  {
    id: 'LV-1007',
    employee: 'Neha Gupta',
    role: 'Lecturer',
    from: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    to: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    days: 3,
    type: 'Maternity',
    status: 'Rejected',
  },
];

const statusColor: Record<LeaveStatus, 'warning' | 'success' | 'error'> = {
  Pending: 'warning',
  Approved: 'success',
  Rejected: 'error',
};

export default function LeaveManagement() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [filter, setFilter] = useState<LeaveStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(mockLeaves);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch faculty data from Supabase
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setLoading(true);
        const facultyData = await facultyService.getFaculty();
        setFaculty(facultyData);
        
        // Set first faculty member as selected if available
        if (facultyData.length > 0) {
          setSelectedUser(facultyData[0].name);
        }
      } catch (error) {
        console.error('Error fetching faculty:', error);
        // Fallback to mock data
        setSelectedUser('Kushal Khemka');
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  const users = useMemo(
    () => faculty.map(f => ({
      name: f.name,
      email: f.email,
      role: f.designation,
      avatar: f.name.split(' ').map(n => n[0]).join('').toUpperCase(),
    })),
    [faculty],
  );

  const filteredUsers = useMemo(
    () => users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase())),
    [users, search],
  );

  const filteredLeaves = useMemo(() => {
    if (filter === 'All') return leaves;
    return leaves.filter((l) => l.status === filter);
  }, [leaves, filter]);

  const handleViewLeave = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setViewModalOpen(true);
  };

  const handleApproveLeave = (leaveId: string) => {
    setLeaves(prev => prev.map(l => 
      l.id === leaveId ? { ...l, status: 'Approved' as LeaveStatus } : l
    ));
  };

  const handleRejectLeave = (leaveId: string) => {
    setLeaves(prev => prev.map(l => 
      l.id === leaveId ? { ...l, status: 'Rejected' as LeaveStatus } : l
    ));
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Comprehensive leave tracking and approval system for all users</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
              </svg>
              Support
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">KK</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left users list */}
        <div className="col-span-12 lg:col-span-3">
          <Card className="h-fit">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Users</CardTitle>
                  <CardDescription className="text-sm text-gray-500 dark:text-gray-400">{users.length} total users</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input 
                  placeholder="Search users..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="max-h-[520px] overflow-auto space-y-1">
                {filteredUsers.map((user) => (
                  <button
                    key={user.name}
                    onClick={() => setSelectedUser(user.name)}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-3 text-left transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                      selectedUser === user.name 
                        ? 'bg-primary/5 border border-primary/20 shadow-sm' 
                        : 'border border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                    }`}
                  >
                    <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-gray-800">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm">
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
                      <div className="text-xs text-primary font-medium">{user.role}</div>
                    </div>
                    {selectedUser === user.name && (
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right panel */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 ring-4 ring-white dark:ring-gray-800">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-lg">
                    {selectedUser.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{selectedUser}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {users.find(u => u.name === selectedUser)?.email || `${selectedUser.toLowerCase()}@gmail.com`}
                  </div>
                  <div className="text-sm text-primary font-semibold">
                    {users.find(u => u.name === selectedUser)?.role || 'Employee'}
                  </div>
                </div>
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Leave
                  </Button>
                </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">Mark User Leave</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      {/* Duration Type Selection */}
                      <div>
                        <Label className="text-sm font-semibold text-gray-900 dark:text-white mb-3 block">Duration Type</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <Button 
                            variant="outline" 
                            className="h-auto p-4 flex flex-col items-start border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-200"
                          >
                            <span className="font-semibold text-gray-900 dark:text-white mb-1">Full Day</span>
                            <span className="text-xs text-gray-600 dark:text-gray-400 text-left">Complete day off</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            className="h-auto p-4 flex flex-col items-start border-2 border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 transition-all duration-200"
                          >
                            <span className="font-semibold text-gray-900 dark:text-white mb-1">Half Day</span>
                            <span className="text-xs text-gray-600 dark:text-gray-400 text-left">First half or second half</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            className="h-auto p-4 flex flex-col items-start border-2 border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 transition-all duration-200"
                          >
                            <span className="font-semibold text-gray-900 dark:text-white mb-1">Long Duration</span>
                            <span className="text-xs text-gray-600 dark:text-gray-400 text-left">Multiple days with mixed types</span>
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Date Selection */}
                        <div>
                          <Label className="text-sm font-semibold text-gray-900 dark:text-white mb-3 block">Select Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal border-2 border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5"
                              >
                                <svg className="mr-2 h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {date ? format(date, 'PPP') : 'Pick a date'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar 
                                mode="single" 
                                selected={date} 
                                onSelect={setDate} 
                                initialFocus
                                className="rounded-md border border-gray-200 dark:border-gray-700"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        {/* Leave Type */}
                        <div>
                          <Label className="text-sm font-semibold text-gray-900 dark:text-white mb-3 block">Leave Type *</Label>
                          <Select>
                            <SelectTrigger className="w-full border-2 border-gray-200 dark:border-gray-700 hover:border-primary focus:border-primary">
                              <SelectValue placeholder="Select Leave Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="casual">Casual Leave</SelectItem>
                              <SelectItem value="sick">Sick Leave</SelectItem>
                              <SelectItem value="maternity">Maternity Leave</SelectItem>
                              <SelectItem value="personal">Personal Leave</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Reason and Notes */}
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-semibold text-gray-900 dark:text-white mb-3 block">Reason for Leave *</Label>
                          <Textarea 
                            className="border-2 border-gray-200 dark:border-gray-700 hover:border-primary focus:border-primary resize-none" 
                            placeholder="Enter reason for leave..." 
                            rows={3} 
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-900 dark:text-white mb-3 block">Additional Notes</Label>
                          <Textarea 
                            className="border-2 border-gray-200 dark:border-gray-700 hover:border-primary focus:border-primary resize-none" 
                            placeholder="Any additional notes..." 
                            rows={3} 
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button 
                        variant="outline" 
                        onClick={() => setOpen(false)}
                        className="border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={() => setOpen(false)}
                        className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Mark Leave
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { 
                label: 'Total Leaves', 
                value: 0, 
                icon: (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )
              },
              { 
                label: 'Total Days', 
                value: 0, 
                icon: (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              },
              { 
                label: 'Full Days', 
                value: 0, 
                icon: (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )
              },
              { 
                label: 'Half Days', 
                value: 0, 
                icon: (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )
              },
            ].map((stat) => (
              <Card key={stat.label} className="relative overflow-hidden bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-base font-semibold text-gray-900 dark:text-white leading-none">{stat.value}</div>
                      <div className="text-[11px] font-medium text-gray-600 dark:text-gray-400 mt-1 leading-none">{stat.label}</div>
                    </div>
                    <div className="p-1 rounded-md bg-primary/10">
                      <div className="text-primary/70">
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Leave Records Section */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <Tabs defaultValue="all">
                <div className="flex items-center justify-between mb-6">
                  <TabsList className="bg-gray-100 dark:bg-gray-800">
                    <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">All Leaves</TabsTrigger>
                    <TabsTrigger value="today" className="data-[state=active]:bg-primary data-[state=active]:text-white">Today</TabsTrigger>
                    <TabsTrigger value="upcoming" className="data-[state=active]:bg-primary data-[state=active]:text-white">Upcoming</TabsTrigger>
                    <TabsTrigger value="past" className="data-[state=active]:bg-primary data-[state=active]:text-white">Past</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-2">
                      {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((s) => (
                        <Button 
                          key={s} 
                          variant={filter === s ? 'default' : 'outline'} 
                          onClick={() => setFilter(s)}
                          className={filter === s ? 'bg-primary text-white' : ''}
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{format(new Date(), 'PPP')}</div>
                  </div>

                  {filteredLeaves.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No leave records found</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">This user hasn't taken any leaves yet. Create their first leave record to get started.</p>
                      <Button className="bg-primary hover:bg-primary/90 text-white">
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add First Leave
                      </Button>
                    </div>
                  ) : (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                            <TableRow>
                              <TableHead className="font-semibold text-gray-900 dark:text-white">Request ID</TableHead>
                              <TableHead className="font-semibold text-gray-900 dark:text-white">Employee</TableHead>
                              <TableHead className="font-semibold text-gray-900 dark:text-white">Period</TableHead>
                              <TableHead className="font-semibold text-gray-900 dark:text-white">Type</TableHead>
                              <TableHead className="font-semibold text-gray-900 dark:text-white">Status</TableHead>
                              <TableHead className="text-right font-semibold text-gray-900 dark:text-white">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredLeaves.map((l) => (
                              <TableRow key={l.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <TableCell className="font-medium text-gray-900 dark:text-white">{l.id}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">{l.employee[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="font-medium text-gray-900 dark:text-white">{l.employee}</div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">{l.role}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium text-gray-900 dark:text-white">{format(l.from, 'MMM dd, yyyy')}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      {format(l.to, 'MMM dd, yyyy')} ({l.days} days)
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-gray-900 dark:text-white">{l.type}</TableCell>
                                <TableCell>
                                  <Badge variant={statusColor[l.status]} className="font-medium">{l.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex gap-2 justify-end">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleViewLeave(l)}
                                      className="hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                      View
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="default"
                                      onClick={() => handleApproveLeave(l.id)}
                                      disabled={l.status === 'Approved'}
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      Approve
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="destructive"
                                      onClick={() => handleRejectLeave(l.id)}
                                      disabled={l.status === 'Rejected'}
                                    >
                                      Reject
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="today" className="mt-6">
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No leaves today</h3>
                    <p className="text-gray-500 dark:text-gray-400">No leave requests scheduled for today.</p>
                  </div>
                </TabsContent>
                <TabsContent value="upcoming" className="mt-6">
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No upcoming leaves</h3>
                    <p className="text-gray-500 dark:text-gray-400">No upcoming leave requests found.</p>
                  </div>
                </TabsContent>
                <TabsContent value="past" className="mt-6">
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No past leaves</h3>
                    <p className="text-gray-500 dark:text-gray-400">No past leave records found.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* View Leave Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
          </DialogHeader>
          {selectedLeave && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Request ID</Label>
                  <div className="mt-1 text-lg font-semibold">{selectedLeave.id}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge variant={statusColor[selectedLeave.status]}>{selectedLeave.status}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Employee</Label>
                  <div className="mt-1 flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{selectedLeave.employee[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{selectedLeave.employee}</div>
                      <div className="text-sm text-muted-foreground">{selectedLeave.role}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Leave Type</Label>
                  <div className="mt-1 text-lg">{selectedLeave.type}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Start Date</Label>
                  <div className="mt-1 text-lg">{format(selectedLeave.from, 'PPP')}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">End Date</Label>
                  <div className="mt-1 text-lg">{format(selectedLeave.to, 'PPP')}</div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Duration</Label>
                <div className="mt-1 text-lg">{selectedLeave.days} days</div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Reason</Label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  Sample reason for leave request...
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Additional Notes</Label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  No additional notes provided.
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>Close</Button>
            {selectedLeave && selectedLeave.status === 'Pending' && (
              <>
                <Button 
                  variant="default"
                  onClick={() => {
                    handleApproveLeave(selectedLeave.id);
                    setViewModalOpen(false);
                  }}
                >
                  Approve
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    handleRejectLeave(selectedLeave.id);
                    setViewModalOpen(false);
                  }}
                >
                  Reject
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


