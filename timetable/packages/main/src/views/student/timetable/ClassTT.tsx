import React from 'react';
import { Table, Card, Select } from 'flowbite-react';
import PageHeader from '../components/PageHeader';

const ClassTT = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader title="Class Timetable" subtitle="Select class and section" />
      <Card className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <Select>
            <option>Class 7</option>
          </Select>
          <Select>
            <option>Section A</option>
          </Select>
          <Select>
            <option>Semester 1</option>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Day</Table.HeadCell>
              <Table.HeadCell>Time</Table.HeadCell>
              <Table.HeadCell>Subject</Table.HeadCell>
              <Table.HeadCell>Faculty</Table.HeadCell>
              <Table.HeadCell>Room</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              <Table.Row>
                <Table.Cell>Monday</Table.Cell>
                <Table.Cell>09:00 - 09:45</Table.Cell>
                <Table.Cell>Math</Table.Cell>
                <Table.Cell>Prof. Smith</Table.Cell>
                <Table.Cell>201</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default ClassTT;


