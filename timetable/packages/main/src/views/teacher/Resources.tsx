import React from 'react';
import { Card, Button } from 'flowbite-react';
import { Icon } from '@iconify/react/dist/iconify.js';

const Resources = () => {
  const items = [
    { id: 1, title: 'Algebra Worksheet.pdf', type: 'PDF', size: '1.2 MB' },
    { id: 2, title: 'Photosynthesis Slides.pptx', type: 'Slides', size: '3.4 MB' },
    { id: 3, title: 'English Reading List.docx', type: 'Doc', size: '260 KB' },
  ];

  const iconFor = (t: string) => (t === 'PDF' ? 'solar:document-line-duotone' : t === 'Slides' ? 'solar:gallery-favourite-line-duotone' : 'solar:file-text-line-duotone');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resources</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Upload and manage teaching materials</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Icon icon="solar:cloud-upload-line-duotone" className="w-5 h-5 mr-2" />
          Upload
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((r) => (
          <Card key={r.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
                <Icon icon={iconFor(r.type)} className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">{r.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{r.type} • {r.size}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" color="gray"><Icon icon="solar:download-line-duotone" className="w-4 h-4 mr-1" />Download</Button>
              <Button size="sm" color="gray"><Icon icon="solar:edit-line-duotone" className="w-4 h-4 mr-1" />Rename</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Resources;





















