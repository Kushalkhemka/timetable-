import React from 'react';
import { Card, Table, Badge } from 'flowbite-react';

const Gradebook = () => {
  const rows = [
    { student: 'John Doe', a1: 95, a2: 88, quiz: 90, exam: 92, grade: 'A' },
    { student: 'Sarah Wilson', a1: 89, a2: 91, quiz: 94, exam: 88, grade: 'A' },
    { student: 'Mike Johnson', a1: 78, a2: 82, quiz: 76, exam: 80, grade: 'B' },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gradebook</h1>
      <Card className="p-0 overflow-auto">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Student</Table.HeadCell>
            <Table.HeadCell>Assignment 1</Table.HeadCell>
            <Table.HeadCell>Assignment 2</Table.HeadCell>
            <Table.HeadCell>Quiz</Table.HeadCell>
            <Table.HeadCell>Exam</Table.HeadCell>
            <Table.HeadCell>Final Grade</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {rows.map((r, idx) => (
              <Table.Row key={idx} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{r.student}</Table.Cell>
                <Table.Cell>{r.a1}</Table.Cell>
                <Table.Cell>{r.a2}</Table.Cell>
                <Table.Cell>{r.quiz}</Table.Cell>
                <Table.Cell>{r.exam}</Table.Cell>
                <Table.Cell>
                  <Badge color={r.grade.startsWith('A') ? 'success' : r.grade.startsWith('B') ? 'info' : 'warning'}>{r.grade}</Badge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>
    </div>
  );
};

export default Gradebook;





















