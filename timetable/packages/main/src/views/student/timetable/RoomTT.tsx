import React from 'react';
import { Table, Card, TextInput } from 'flowbite-react';
import PageHeader from '../components/PageHeader';

const RoomTT = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader title="Room Timetable" subtitle="Find room-wise schedule" icon="solar:building-3-line-duotone" />
      <Card className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <TextInput placeholder="Room No." />
          <TextInput placeholder="Building" />
          <TextInput placeholder="Floor" />
        </div>
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Room</Table.HeadCell>
              <Table.HeadCell>Time</Table.HeadCell>
              <Table.HeadCell>Subject</Table.HeadCell>
              <Table.HeadCell>Faculty</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              <Table.Row>
                <Table.Cell>201</Table.Cell>
                <Table.Cell>10:00 - 10:45</Table.Cell>
                <Table.Cell>Physics</Table.Cell>
                <Table.Cell>Prof. Lee</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default RoomTT;


