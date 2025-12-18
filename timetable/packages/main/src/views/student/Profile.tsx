import React from 'react';
import { Card } from 'flowbite-react';
import PageHeader from './components/PageHeader';

const StudentProfile = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader title="Profile" subtitle="Your account information" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="p-5 md:p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">John Student</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">john@student.edu</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Program</p>
              <p className="font-medium">B.Tech CSE</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Semester</p>
              <p className="font-medium">5</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Attendance</p>
              <p className="font-medium">92%</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">CGPA</p>
              <p className="font-medium">8.40</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Credits Earned</p>
              <p className="font-medium">72</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentProfile;


