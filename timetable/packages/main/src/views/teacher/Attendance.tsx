import React, { useState } from 'react';
import { Card, Button, Table, Badge } from 'flowbite-react';
import { Icon } from '@iconify/react/dist/iconify.js';

const Attendance = () => {
  const [date] = useState<string>(new Date().toISOString().slice(0, 10));
  const students = [
    { id: 1, name: 'John Doe', roll: '7A-12', status: 'present' },
    { id: 2, name: 'Sarah Wilson', roll: '7A-07', status: 'present' },
    { id: 3, name: 'Mike Johnson', roll: '7A-21', status: 'absent' },
  ];

  const statusColor = (s: string) => (s === 'present' ? 'success' : s === 'late' ? 'warning' : 'failure');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Attendance</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Mark and review student attendance</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Icon icon="solar:save-minimalistic-line-duotone" className="w-5 h-5 mr-2" />
            Save
          </Button>
          <Button color="gray">
            <Icon icon="solar:export-line-duotone" className="w-5 h-5 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm text-gray-600 dark:text-gray-400">Date</label>
          <input type="date" defaultValue={date} className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white" />
          <select className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white">
            <option>Mathematics 7A</option>
            <option>Science 8B</option>
            <option>English 7B</option>
          </select>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Student</Table.HeadCell>
            <Table.HeadCell>Roll</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {students.map((s) => (
              <Table.Row key={s.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{s.name}</Table.Cell>
                <Table.Cell>{s.roll}</Table.Cell>
                <Table.Cell>
                  <Badge color={statusColor(s.status)} className="capitalize">{s.status}</Badge>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    <Button size="xs" color="gray">Present</Button>
                    <Button size="xs" color="gray">Late</Button>
                    <Button size="xs" color="gray">Absent</Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>
    </div>
  );
};

export default Attendance;





















