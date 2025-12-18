import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/shadcn-ui/Default-Ui/card';
import { Badge } from 'src/components/shadcn-ui/Default-Ui/badge';
import { Button } from 'src/components/shadcn-ui/Default-Ui/button';
import { Input } from 'src/components/shadcn-ui/Default-Ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/shadcn-ui/Default-Ui/select';
import { Icon } from '@iconify/react';
import { listCurriculumFiles, CurriculumFile } from 'src/services/storage';

const Curriculum: React.FC = () => {
  const [activeTab, setActiveTab] = useState('resources');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [files, setFiles] = useState<CurriculumFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewerFile, setViewerFile] = useState<CurriculumFile | null>(null);

  const subjects = [
    {
      id: '1',
      name: 'Data Structures and Algorithms',
      code: 'CS301',
      credits: 4,
      semester: '6th',
      faculty: 'Dr. Smith',
      description: 'Study of fundamental data structures and algorithmic techniques',
      materials: [
        { name: 'Course Syllabus', type: 'pdf', size: '2.1 MB', uploaded: '2024-01-10' },
        { name: 'Lecture Notes - Week 1', type: 'pdf', size: '3.2 MB', uploaded: '2024-01-15' },
        { name: 'Assignment 1', type: 'pdf', size: '1.5 MB', uploaded: '2024-01-12' },
        { name: 'Lab Manual', type: 'pdf', size: '4.8 MB', uploaded: '2024-01-08' }
      ]
    },
    {
      id: '2',
      name: 'Database Systems',
      code: 'CS302',
      credits: 3,
      semester: '6th',
      faculty: 'Dr. Johnson',
      description: 'Introduction to database design and management systems',
      materials: [
        { name: 'Course Syllabus', type: 'pdf', size: '1.8 MB', uploaded: '2024-01-10' },
        { name: 'Textbook Chapter 1', type: 'pdf', size: '5.2 MB', uploaded: '2024-01-14' },
        { name: 'SQL Practice Questions', type: 'pdf', size: '2.3 MB', uploaded: '2024-01-16' }
      ]
    },
    {
      id: '3',
      name: 'Software Engineering',
      code: 'CS303',
      credits: 3,
      semester: '6th',
      faculty: 'Dr. Brown',
      description: 'Software development lifecycle and methodologies',
      materials: [
        { name: 'Course Syllabus', type: 'pdf', size: '2.5 MB', uploaded: '2024-01-10' },
        { name: 'Project Guidelines', type: 'pdf', size: '3.1 MB', uploaded: '2024-01-13' },
        { name: 'Case Study Examples', type: 'pdf', size: '4.2 MB', uploaded: '2024-01-17' }
      ]
    },
    {
      id: '4',
      name: 'Computer Networks',
      code: 'CS304',
      credits: 3,
      semester: '6th',
      faculty: 'Dr. Wilson',
      description: 'Network protocols, architectures, and security',
      materials: [
        { name: 'Course Syllabus', type: 'pdf', size: '2.0 MB', uploaded: '2024-01-10' },
        { name: 'Network Topology Diagrams', type: 'pdf', size: '1.9 MB', uploaded: '2024-01-15' },
        { name: 'Protocol Reference', type: 'pdf', size: '6.1 MB', uploaded: '2024-01-18' }
      ]
    },
    {
      id: '5',
      name: 'Operating Systems',
      code: 'CS305',
      credits: 3,
      semester: '6th',
      faculty: 'Dr. Davis',
      description: 'Operating system concepts and implementation',
      materials: [
        { name: 'Course Syllabus', type: 'pdf', size: '2.3 MB', uploaded: '2024-01-10' },
        { name: 'System Call Reference', type: 'pdf', size: '2.8 MB', uploaded: '2024-01-14' },
        { name: 'Process Management Notes', type: 'pdf', size: '3.5 MB', uploaded: '2024-01-19' }
      ]
    }
  ];

  // Load files from Supabase Storage bucket 'curriculum'
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list = await listCurriculumFiles('');
        if (!cancelled) setFiles(list);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredResources = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return files;
    return files.filter((f) => f.name.toLowerCase().includes(q));
  }, [files, searchTerm]);

  const semesters = ['6th', '5th', '4th', '3rd', '2nd', '1st'];

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.faculty.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(subject => 
    !selectedSemester || subject.semester === selectedSemester
  );

  const openViewer = (file: CurriculumFile) => setViewerFile(file);
  const closeViewer = () => setViewerFile(null);

  const buildViewerSrc = (file: CurriculumFile) => {
    const lower = file.name.toLowerCase();
    if (lower.endsWith('.pdf')) return file.url;
    const encoded = encodeURIComponent(file.url);
    return `https://docs.google.com/gview?embedded=1&url=${encoded}`;
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'solar:file-text-line-duotone';
      case 'doc':
      case 'docx':
        return 'solar:document-text-line-duotone';
      case 'ppt':
      case 'pptx':
        return 'solar:presentation-graph-line-duotone';
      case 'xls':
      case 'xlsx':
        return 'solar:tablet-line-duotone';
      case 'zip':
      case 'rar':
        return 'solar:archive-line-duotone';
      default:
        return 'solar:file-line-duotone';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Curriculum & Study Material</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('subjects')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'subjects'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Icon icon="solar:graduation-cap-line-duotone" className="mr-2" />
          Subjects
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'resources'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Icon icon="solar:book-2-line-duotone" className="mr-2" />
          Study Resources
        </button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder={`Search ${activeTab === 'subjects' ? 'subjects' : 'resources'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {activeTab === 'subjects' && (
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Semesters</SelectItem>
                  {semesters.map((semester) => (
                    <SelectItem key={semester} value={semester}>
                      {semester} Semester
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Subjects Tab */}
      {activeTab === 'subjects' && (
        <div className="space-y-4">
          {filteredSubjects.map((subject) => (
            <Card key={subject.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Icon icon="solar:graduation-cap-line-duotone" className="text-primary" />
                      {subject.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{subject.code}</Badge>
                      <Badge variant="secondary">{subject.credits} Credits</Badge>
                      <Badge variant="outline">{subject.semester} Semester</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Faculty: {subject.faculty}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {subject.description}
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Study Materials:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {subject.materials.map((material, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon icon={getFileIcon(material.type)} className="text-primary" />
                          <div>
                            <p className="font-medium text-sm">{material.name}</p>
                            <p className="text-xs text-gray-500">
                              {material.size} • {formatDate(material.uploaded)}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Icon icon="solar:download-line-duotone" className="mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Study Resources Tab (from Supabase Storage) */}
      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading && (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">Loading materials...</CardContent>
            </Card>
          )}
          {!loading && filteredResources.map((file) => (
            <Card key={file.path}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Icon icon={getFileIcon((file.name.split('.').pop() || '').toLowerCase())} className="text-primary text-xl" />
                    <div>
                      <CardTitle className="text-lg break-all">{file.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {file.updatedAt && <Badge variant="outline">{formatDate(file.updatedAt)}</Badge>}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <a href={file.url} target="_blank" rel="noreferrer" className="flex-1">
                    <Button size="sm" className="w-full">
                      <Icon icon="solar:download-line-duotone" className="mr-2" />
                      Open / Download
                    </Button>
                  </a>
                  <Button size="sm" variant="outline" onClick={() => openViewer(file)}>
                    <Icon icon="solar:eye-line-duotone" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && (activeTab === 'subjects' ? filteredSubjects : filteredResources).length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Icon icon="solar:book-2-line-duotone" className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No materials found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or check back later for new materials.
            </p>
          </CardContent>
        </Card>
      )}

      {viewerFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={closeViewer}>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-5xl h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 truncate">
                <Icon icon="solar:eye-line-duotone" className="text-primary" />
                <span className="font-medium truncate">{viewerFile.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <a href={viewerFile.url} target="_blank" rel="noreferrer">
                  <Button size="sm" variant="outline">
                    <Icon icon="solar:download-line-duotone" className="mr-1" />
                    Open
                  </Button>
                </a>
                <Button size="sm" variant="outline" onClick={closeViewer}>
                  <Icon icon="solar:close-circle-line-duotone" />
                </Button>
              </div>
            </div>
            <div className="w-full h-full">
              <iframe title={viewerFile.name} src={buildViewerSrc(viewerFile)} className="w-full h-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Curriculum;
