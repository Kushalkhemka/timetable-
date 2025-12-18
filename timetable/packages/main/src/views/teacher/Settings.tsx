import React from 'react';
import { Card, Checkbox, Button } from 'flowbite-react';

const Settings = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <Card className="p-6 space-y-4">
        <div className="font-semibold">Preferences</div>
        <div className="flex items-center gap-2">
          <Checkbox defaultChecked />
          <span>Email notifications</span>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox />
          <span>Enable weekly summary</span>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">Save</Button>
      </Card>
    </div>
  );
};

export default Settings;





















