import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/shadcn-ui/Default-Ui/card';
import { Avatar, AvatarFallback, AvatarImage } from 'src/components/shadcn-ui/Default-Ui/avatar';
import { Badge } from 'src/components/shadcn-ui/Default-Ui/badge';
import { Button } from 'src/components/shadcn-ui/Default-Ui/button';
import { Icon } from '@iconify/react';

const StudentProfile: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Student Avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">John Doe</CardTitle>
            <Badge variant="secondary" className="w-fit mx-auto">
              Student ID: STU001
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon icon="solar:mail-line-duotone" className="text-primary" />
                <span className="text-sm text-gray-600 dark:text-gray-300">john.doe@university.edu</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="solar:phone-line-duotone" className="text-primary" />
                <span className="text-sm text-gray-600 dark:text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="solar:calendar-line-duotone" className="text-primary" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Computer Science</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="solar:graduation-cap-line-duotone" className="text-primary" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Year 3</span>
              </div>
            </div>
            <Button className="w-full">
              <Icon icon="solar:pen-line-duotone" className="mr-2" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Student ID</label>
                <p className="text-lg font-semibold">STU001</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Roll Number</label>
                <p className="text-lg font-semibold">2021CS001</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</label>
                <p className="text-lg font-semibold">Computer Science</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Academic Year</label>
                <p className="text-lg font-semibold">2024-2025</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Semester</label>
                <p className="text-lg font-semibold">6th Semester</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">CGPA</label>
                <p className="text-lg font-semibold">8.5/10</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Personal Contact</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon icon="solar:mail-line-duotone" className="text-primary" />
                  <span>john.doe@email.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="solar:phone-line-duotone" className="text-primary" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="solar:home-2-line-duotone" className="text-primary" />
                  <span>123 University Ave, Campus City</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Emergency Contact</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon icon="solar:user-line-duotone" className="text-primary" />
                  <span>Jane Doe (Mother)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="solar:phone-line-duotone" className="text-primary" />
                  <span>+1 (555) 987-6543</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;
