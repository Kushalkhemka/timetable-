import React from 'react';
import { Table, Card, TextInput, Button } from 'flowbite-react';
import PageHeader from '../components/PageHeader';

const FacultyTT = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader title="Faculty Timetable" subtitle="Lookup faculty schedules" />
      <Card className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
          <TextInput placeholder="Search faculty" className="w-full sm:max-w-xs" />
          <Button>Search</Button>
        </div>
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Faculty</Table.HeadCell>
              <Table.HeadCell>Subject</Table.HeadCell>
              <Table.HeadCell>Day</Table.HeadCell>
              <Table.HeadCell>Time</Table.HeadCell>
              <Table.HeadCell>Room</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              <Table.Row>
                <Table.Cell>Prof. Smith</Table.Cell>
                <Table.Cell>Mathematics</Table.Cell>
                <Table.Cell>Mon/Wed</Table.Cell>
                <Table.Cell>09:00 - 10:00</Table.Cell>
                <Table.Cell>201</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Prof. Wilson</Table.Cell>
                <Table.Cell>Science</Table.Cell>
                <Table.Cell>Tue/Thu</Table.Cell>
                <Table.Cell>11:00 - 12:00</Table.Cell>
                <Table.Cell>203</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default FacultyTT;


