import React, { useState } from 'react';
import { Card, Button, Table, Badge, Tabs } from 'flowbite-react';
import { Icon } from '@iconify/react/dist/iconify.js';

const Grades = () => {
  const [activeClass, setActiveClass] = useState('Mathematics 7A');

  const classes = ['Mathematics 7A', 'Science 8B', 'English 7B'];
  const grades = [
    { id: 1, student: 'John Doe', roll: '7A-12', assignment: 'Algebra Fundamentals', score: 95, total: 100, grade: 'A+' },
    { id: 2, student: 'Sarah Wilson', roll: '7A-07', assignment: 'Algebra Fundamentals', score: 89, total: 100, grade: 'A' },
    { id: 3, student: 'Mike Johnson', roll: '7A-21', assignment: 'Algebra Fundamentals', score: 78, total: 100, grade: 'B' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Grades</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage grades for assignments and exams</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Icon icon="solar:export-line-duotone" className="w-5 h-5 mr-2" />
            Export CSV
          </Button>
          <Button color="gray">
            <Icon icon="solar:medal-star-line-duotone" className="w-5 h-5 mr-2" />
            Curve Grades
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <Tabs aria-label="Classes" variant="default">
          {classes.map((c) => (
            <Tabs.Item
              key={c}
              title={c}
              active={activeClass === c}
              onClick={() => setActiveClass(c)}
            >
              <div className="mt-4 overflow-x-auto">
                <Table hoverable>
                  <Table.Head>
                    <Table.HeadCell>Student</Table.HeadCell>
                    <Table.HeadCell>Roll</Table.HeadCell>
                    <Table.HeadCell>Assessment</Table.HeadCell>
                    <Table.HeadCell>Score</Table.HeadCell>
                    <Table.HeadCell>Grade</Table.HeadCell>
                    <Table.HeadCell>Actions</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {grades.map((g) => (
                      <Table.Row key={g.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {g.student}
                        </Table.Cell>
                        <Table.Cell>{g.roll}</Table.Cell>
                        <Table.Cell>{g.assignment}</Table.Cell>
                        <Table.Cell>
                          <span className="font-medium text-gray-900 dark:text-white">{g.score}/{g.total}</span>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge color={g.grade.startsWith('A') ? 'success' : g.grade.startsWith('B') ? 'info' : 'warning'}>
                            {g.grade}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex gap-2">
                            <Button size="xs" color="gray"><Icon icon="solar:edit-line-duotone" className="w-4 h-4" /></Button>
                            <Button size="xs" color="gray"><Icon icon="solar:history-2-line-duotone" className="w-4 h-4" /></Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            </Tabs.Item>
          ))}
        </Tabs>
      </Card>
    </div>
  );
};

export default Grades;





















