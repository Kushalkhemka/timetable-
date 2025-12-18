 

import React, { useState } from 'react';
import { Card, CardContent, Button, Badge, Table } from 'flowbite-react';
import { Icon } from '@iconify/react/dist/iconify.js';

const Assignments = () => {
  const [activeTab, setActiveTab] = useState('all');

  const assignments = [
    {
      id: 1,
      title: 'Algebra Fundamentals',
      subject: 'Mathematics',
      class: 'Mathematics 7A',
      dueDate: '2024-01-15',
      status: 'active',
      submissions: 25,
      totalStudents: 28,
      type: 'homework',
      points: 100
    },
    {
      id: 2,
      title: 'Photosynthesis Lab Report',
      subject: 'Science',
      class: 'Science 8B',
      dueDate: '2024-01-18',
      status: 'active',
      submissions: 20,
      totalStudents: 25,
      type: 'lab',
      points: 150
    },
    {
      id: 3,
      title: 'Shakespeare Analysis Essay',
      subject: 'English',
      class: 'English 7B',
      dueDate: '2024-01-12',
      status: 'graded',
      submissions: 30,
      totalStudents: 30,
      type: 'essay',
      points: 200
    },
    {
      id: 4,
      title: 'World War II Timeline',
      subject: 'History',
      class: 'History 8A',
      dueDate: '2024-01-20',
      status: 'draft',
      submissions: 0,
      totalStudents: 22,
      type: 'project',
      points: 300
    }
  ];

  const tabs = [
    { id: 'all', label: 'All Assignments', count: assignments.length },
    { id: 'active', label: 'Active', count: assignments.filter(a => a.status === 'active').length },
    { id: 'graded', label: 'Graded', count: assignments.filter(a => a.status === 'graded').length },
    { id: 'draft', label: 'Draft', count: assignments.filter(a => a.status === 'draft').length }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { color: 'success', text: 'Active' },
      graded: { color: 'info', text: 'Graded' },
      draft: { color: 'warning', text: 'Draft' }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap];
    return <Badge color={statusInfo.color as any} size="sm">{statusInfo.text}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    const typeMap = {
      homework: 'solar:document-text-line-duotone',
      lab: 'solar:flask-line-duotone',
      essay: 'solar:pen-new-square-line-duotone',
      project: 'solar:folder-line-duotone'
    };
    return typeMap[type as keyof typeof typeMap] || 'solar:document-text-line-duotone';
  };

  const getSubmissionProgress = (submissions: number, total: number) => {
    const percentage = (submissions / total) * 100;
    return {
      percentage: Math.round(percentage),
      color: percentage >= 80 ? 'text-green-600' : percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && assignments.find(a => a.dueDate === dueDate)?.status === 'active';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assignments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage student assignments</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Icon icon="solar:add-circle-line-duotone" className="w-5 h-5 mr-2" />
          Create Assignment
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments
          .filter(a => activeTab === 'all' || a.status === activeTab)
          .map((assignment) => {
            const progress = getSubmissionProgress(assignment.submissions, assignment.totalStudents);
            const overdue = isOverdue(assignment.dueDate);
            
            return (
              <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Icon icon={getTypeIcon(assignment.type)} className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                        {assignment.type}
                      </span>
                    </div>
                    {getStatusBadge(assignment.status)}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {assignment.title}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Icon icon="solar:book-2-line-duotone" className="w-4 h-4 mr-2" />
                      {assignment.class}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Icon icon="solar:calendar-line-duotone" className="w-4 h-4 mr-2" />
                      <span className={overdue ? 'text-red-600 font-medium' : ''}>
                        Due: {formatDate(assignment.dueDate)}
                        {overdue && ' (Overdue)'}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Icon icon="solar:medal-star-line-duotone" className="w-4 h-4 mr-2" />
                      {assignment.points} points
                    </div>
                  </div>
                  
                  {/* Submission Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Submissions</span>
                      <span className={`font-medium ${progress.color}`}>
                        {assignment.submissions}/{assignment.totalStudents} ({progress.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          progress.percentage >= 80 ? 'bg-green-500' : 
                          progress.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${progress.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <Icon icon="solar:eye-line-duotone" className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" color="gray" className="flex-1">
                      <Icon icon="solar:edit-line-duotone" className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Icon icon="solar:document-text-line-duotone" className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{assignments.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Assignments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Icon icon="solar:check-circle-line-duotone" className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {assignments.filter(a => a.status === 'active').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Assignments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Icon icon="solar:clock-circle-line-duotone" className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {assignments.filter(a => isOverdue(a.dueDate)).length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Icon icon="solar:medal-star-line-duotone" className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(assignments.reduce((sum, a) => sum + (a.submissions / a.totalStudents) * 100, 0) / assignments.length)}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Submission Rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Assignments;
