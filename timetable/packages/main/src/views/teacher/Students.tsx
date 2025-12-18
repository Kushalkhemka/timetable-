 

import React, { useState } from 'react';
import { Card, CardContent, Button, Badge, Table, Avatar } from 'flowbite-react';
import { Icon } from '@iconify/react/dist/iconify.js';

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');

  const students = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@school.edu',
      class: 'Mathematics 7A',
      grade: 'A+',
      attendance: 95,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      status: 'active'
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@school.edu',
      class: 'Science 8B',
      grade: 'A',
      attendance: 92,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      status: 'active'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@school.edu',
      class: 'English 7B',
      grade: 'B+',
      attendance: 88,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      status: 'active'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@school.edu',
      class: 'Mathematics 7A',
      grade: 'A-',
      attendance: 90,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
      status: 'active'
    },
    {
      id: 5,
      name: 'Alex Brown',
      email: 'alex.brown@school.edu',
      class: 'History 8A',
      grade: 'B',
      attendance: 85,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
      status: 'inactive'
    }
  ];

  const classes = ['all', 'Mathematics 7A', 'Science 8B', 'English 7B', 'History 8A'];

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 95) return 'text-green-600';
    if (attendance >= 90) return 'text-blue-600';
    if (attendance >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Students</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and track student progress</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Icon icon="solar:add-circle-line-duotone" className="w-5 h-5 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Icon icon="solar:magnifer-line-duotone" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {classes.map((classItem) => (
                  <option key={classItem} value={classItem}>
                    {classItem === 'all' ? 'All Classes' : classItem}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Student</Table.HeadCell>
              <Table.HeadCell>Class</Table.HeadCell>
              <Table.HeadCell>Grade</Table.HeadCell>
              <Table.HeadCell>Attendance</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {filteredStudents.map((student) => (
                <Table.Row key={student.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center space-x-3">
                      <Avatar img={student.avatar} size="sm" />
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{student.email}</div>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="text-gray-900 dark:text-white">
                    {student.class}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge className={`px-2 py-1 text-xs font-medium ${getGradeColor(student.grade)}`}>
                      {student.grade}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <span className={`font-medium ${getAttendanceColor(student.attendance)}`}>
                      {student.attendance}%
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={student.status === 'active' ? 'success' : 'gray'} size="sm">
                      {student.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2">
                      <Button size="sm" color="gray">
                        <Icon icon="solar:eye-line-duotone" className="w-4 h-4" />
                      </Button>
                      <Button size="sm" color="gray">
                        <Icon icon="solar:edit-line-duotone" className="w-4 h-4" />
                      </Button>
                      <Button size="sm" color="gray">
                        <Icon icon="solar:chat-round-line-duotone" className="w-4 h-4" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Icon icon="solar:users-group-rounded-line-duotone" className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{students.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Icon icon="solar:check-circle-line-duotone" className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {students.filter(s => s.status === 'active').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Students</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Icon icon="solar:medal-star-line-duotone" className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {students.filter(s => s.grade.startsWith('A')).length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">A Grade Students</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Icon icon="solar:clock-circle-line-duotone" className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / students.length)}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Attendance</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Students;
