import React from 'react';
import { Card, TextInput, Badge } from 'flowbite-react';
import PageHeader from './components/PageHeader';

const StudyMaterial = () => {
  const items = [
    { title: 'Algorithms Notes', tag: 'PDF' },
    { title: 'Physics Lab Manual', tag: 'DOC' },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader title="Study Material" subtitle="Browse and download resources" />
      <div className="mb-2">
        <TextInput placeholder="Search materials" className="w-full sm:max-w-md" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {items.map((it, i) => (
          <Card key={i} className="p-5 md:p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{it.title}</h3>
              <Badge color="success">{it.tag}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudyMaterial;


