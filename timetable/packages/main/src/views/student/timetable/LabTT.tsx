import React from 'react';
import { Table, Card, Select } from 'flowbite-react';
import PageHeader from '../components/PageHeader';

const LabTT = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader title="Lab Timetable" subtitle="Select lab and day" />
      <Card className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <Select>
            <option>Computer Lab</option>
          </Select>
          <Select>
            <option>Monday</option>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Lab</Table.HeadCell>
              <Table.HeadCell>Time</Table.HeadCell>
              <Table.HeadCell>Batch</Table.HeadCell>
              <Table.HeadCell>Faculty</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              <Table.Row>
                <Table.Cell>Computer Lab</Table.Cell>
                <Table.Cell>02:00 - 04:00</Table.Cell>
                <Table.Cell>Batch A</Table.Cell>
                <Table.Cell>Prof. Carter</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default LabTT;


