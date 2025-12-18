import React from 'react';
import { Card, Button } from 'flowbite-react';

const Profile = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
      <Card className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-sm text-gray-600 dark:text-gray-400">Full Name</label>
          <input className="border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white" defaultValue="Professor Smith" />
          <label className="text-sm text-gray-600 dark:text-gray-400">Email</label>
          <input className="border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white" defaultValue="prof.smith@school.edu" />
        </div>
        <div className="space-y-3">
          <label className="text-sm text-gray-600 dark:text-gray-400">Department</label>
          <input className="border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white" defaultValue="Mathematics" />
          <label className="text-sm text-gray-600 dark:text-gray-400">Phone</label>
          <input className="border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white" defaultValue="+1 555-0100" />
        </div>
        <div className="md:col-span-2">
          <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
        </div>
      </Card>
    </div>
  );
};

export default Profile;





















