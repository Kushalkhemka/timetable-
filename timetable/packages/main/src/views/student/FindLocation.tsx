import React from 'react';
import { Card, TextInput, Button, ListGroup } from 'flowbite-react';
import PageHeader from './components/PageHeader';

const FindLocation = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader title="Find Location" subtitle="Search rooms, labs, facilities" />
      <Card className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <TextInput placeholder="Search location" className="w-full sm:max-w-md" />
          <Button>Search</Button>
        </div>
        <div className="mt-4">
          <ListGroup>
            <ListGroup.Item>Room 201 - Academic Block</ListGroup.Item>
            <ListGroup.Item>Computer Lab - Tech Park</ListGroup.Item>
          </ListGroup>
        </div>
      </Card>
    </div>
  );
};

export default FindLocation;


