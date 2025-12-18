import React, { useState, useRef } from 'react';
import { 
  Button, 
  Label, 
  FileInput, 
  Badge, 
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  TextInput,
  Progress
} from 'flowbite-react';
import { 
  Icon 
} from '@iconify/react';
import CardBox from '../../components/shared/CardBox';
import { useCurriculum, CurriculumProvider } from '../../context/CurriculumContext';

// Use the interfaces from the context
import { UploadedFile, CurriculumData } from '../../context/CurriculumContext';

const IngestCurriculumContent: React.FC = () => {
  const {
    uploadedFiles,
    addUploadedFile,
    updateUploadedFile,
    deleteUploadedFile,
    processOCR,
    // @ts-ignore added in context for immediate processing
    processOCRDirect
  } = useCurriculum();
  
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [selectedCurriculum, setSelectedCurriculum] = useState<CurriculumData | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Subjects list UI removed

  const departments = [
    'Bio-Technology (BT)',
    'Chemical Engineering (CHE)',
    'Civil Engineering (CE)',
    'Computer Science & Engineering (CSE)',
    'Cyber Security (CS)',
    'Data Science and Analytics (DSA)',
    'Electrical Engineering (EE)',
    'Electronics & Communication Engineering (ECE)',
    'Engineering Physics (EP)',
    'Information Technology (IT)',
    'Mathematics & Computing (MC)',
    'Mechanical Engineering (ME)',
    'Mechanical Engineering with Specialization in Automotive Engineering (ME-AE)',
    'Production & Industrial Engineering (PIE)',
    'Software Engineering (SE)',
    'VLSI Design and Technology (VLSI)'
  ];


  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0,
      department: selectedDepartment,
      subject: '',
      fileBlob: file // Store the actual file for API upload
    }));

    // Add files to context
    newFiles.forEach(file => {
      addUploadedFile(file);
    });
    
    // Start real upload and processing (call server immediately with the new file to avoid stale state race)
    newFiles.forEach(file => {
      simulateUpload(file.id);
      if (typeof processOCRDirect === 'function') {
        processOCRDirect(file);
      } else {
        // fallback to id-based after a small delay
        setTimeout(() => processOCR(file.id), 100);
      }
    });
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      const file = uploadedFiles.find(f => f.id === fileId);
      if (file) {
        const newProgress = Math.min(file.progress + Math.random() * 20, 100);
        if (newProgress >= 100) {
          clearInterval(interval);
          updateUploadedFile(fileId, { progress: 100, status: 'processing' });
        } else {
          updateUploadedFile(fileId, { progress: newProgress });
        }
      }
    }, 200);
  };



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading': return 'info';
      case 'processing': return 'warning';
      case 'completed': return 'success';
      case 'error': return 'failure';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading': return 'solar:upload-line-duotone';
      case 'processing': return 'solar:settings-line-duotone';
      case 'completed': return 'solar:check-circle-line-duotone';
      case 'error': return 'solar:close-circle-line-duotone';
      default: return 'solar:file-line-duotone';
    }
  };

  const handleViewCurriculum = (file: UploadedFile) => {
    if (file.curriculumData) {
      setSelectedCurriculum(file.curriculumData);
      setShowCurriculumModal(true);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    // Optimistic UI removal
    deleteUploadedFile(fileId);
    // Also delete associated curriculum from DB if present
    try {
      if (file?.curriculumData) {
        const mod = await import('../../services/supabase');
        const ok = await mod.curriculumService.deleteCurriculum({ id: file.curriculumData.id, subjectName: file.curriculumData.subjectName, department: file.curriculumData.department });
        if (!ok) {
          console.warn('Failed to delete curriculum in database for', file.curriculumData.subjectName);
        }
      }
    } catch (e) {
      console.error('Delete failed:', e);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Ingest Curriculum
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Upload curriculum documents and extract structured data using OCR
          </p>
        </div>
        <div className="flex gap-2">
          <Button color="light" size="sm">
            <Icon icon="solar:download-line-duotone" className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button color="light" size="sm">
            <Icon icon="solar:refresh-line-duotone" className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Department Selection */}
      <CardBox>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Select Department</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => {
              const count = uploadedFiles.filter(file => file.department === dept).length;
              return (
                <Button
                  key={dept}
                  color={selectedDepartment === dept ? 'primary' : 'light'}
                  onClick={() => setSelectedDepartment(dept)}
                  className="h-auto p-4 text-left justify-start"
                >
                  <Icon 
                    icon="solar:buildings-2-line-duotone" 
                    className="w-5 h-5 mr-3" 
                  />
                  <div className="flex-1">
                    <div className="font-medium">{dept.split('(')[0].trim()}</div>
                    <div className="text-xs opacity-70">{dept.split('(')[1]?.replace(')', '')}</div>
                  </div>
                  <Badge color={count > 0 ? 'success' : 'gray'} size="sm">
                    {count} curriculum{count !== 1 ? 's' : ''}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>
      </CardBox>

      {/* File Upload Section */}
      {selectedDepartment && (
        <CardBox>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Upload Curriculum Documents</h3>
            
            {/* Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Icon 
                icon="solar:cloud-upload-line-duotone" 
                className="w-16 h-16 mx-auto text-gray-400 mb-4" 
              />
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Drop files here or click to browse
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Upload PDF documents or images of curriculum documents
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                Supported formats: PDF, PNG, JPG, JPEG (Max 10MB each)
              </p>
              <Button
                color="primary"
                onClick={() => fileInputRef.current?.click()}
                className="mb-2"
              >
                <Icon icon="solar:folder-open-line-duotone" className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
              <FileInput
                ref={fileInputRef}
                onChange={handleFileInput}
                accept=".pdf,.png,.jpg,.jpeg"
                multiple
                className="hidden"
              />
            </div>

          </div>
        </CardBox>
      )}

      {/* Available Subjects Section removed */}

      {/* Uploaded Files */}
      {selectedDepartment && uploadedFiles.filter(file => file.department === selectedDepartment).length > 0 && (
        <CardBox>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">
              Uploaded Files for {selectedDepartment} ({uploadedFiles.filter(file => file.department === selectedDepartment).length})
            </h3>
            <div className="space-y-4">
              {uploadedFiles.filter(file => file.department === selectedDepartment).map((file) => (
              <div
                key={file.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Icon 
                      icon={getStatusIcon(file.status)} 
                      className={`w-5 h-5 ${
                        file.status === 'completed' ? 'text-green-500' :
                        file.status === 'processing' ? 'text-yellow-500' :
                        file.status === 'error' ? 'text-red-500' :
                        'text-blue-500'
                      }`} 
                    />
                    <div>
                      <h4 className="font-medium">{file.name}</h4>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)} • {file.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge color={getStatusColor(file.status)} size="sm">
                      {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                    </Badge>
                    {file.status === 'completed' && (
                      <Button
                        size="sm"
                        color="light"
                        onClick={() => handleViewCurriculum(file)}
                      >
                        <Icon icon="solar:eye-line-duotone" className="w-4 h-4 mr-1" />
                        View Curriculum
                      </Button>
                    )}
                    {file.status === 'error' && file.errorMessage && (
                      <Badge color="failure" size="sm" title={file.errorMessage}>
                        Details
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      color="light"
                      onClick={() => handleDeleteFile(file.id)}
                    >
                      <Icon icon="solar:trash-bin-minimalistic-line-duotone" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                {(file.status === 'uploading' || file.status === 'processing') && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{Math.round(file.progress)}%</span>
                    </div>
                    <Progress progress={file.progress} color="blue" />
                  </div>
                )}

                {/* Error Details */}
                {file.status === 'error' && file.errorMessage && (
                  <div className="mt-2">
                    <div className="text-sm text-red-600 dark:text-red-400 break-words">
                      {file.errorMessage}
                    </div>
                  </div>
                )}

                {/* Extracted Text Preview */}
                {file.extractedText && (
                  <div className="mt-3">
                    <h5 className="font-medium mb-2">Extracted Text Preview:</h5>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 max-h-32 overflow-y-auto">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {file.extractedText.substring(0, 200)}...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            </div>
          </div>
        </CardBox>
      )}

      {/* Curriculum Modal */}
      <Modal show={showCurriculumModal} onClose={() => setShowCurriculumModal(false)} size="4xl">
        <ModalHeader>
          <div className="flex items-center gap-2">
            <Icon icon="solar:book-2-line-duotone" className="w-5 h-5" />
            Curriculum Details
          </div>
        </ModalHeader>
        <ModalBody>
          {selectedCurriculum && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subject-name" className="mb-2">Subject Name</Label>
                  <TextInput
                    id="subject-name"
                    value={selectedCurriculum.subjectName}
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor="total-hours" className="mb-2">Total Hours</Label>
                  <TextInput
                    id="total-hours"
                    value={selectedCurriculum.totalHours.toString()}
                    readOnly
                  />
                </div>
              </div>

              {/* Prerequisites */}
              <div>
                <Label className="mb-2">Prerequisites</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedCurriculum.prerequisites.map((prereq, index) => (
                    <Badge key={index} color="info" size="sm">
                      {prereq}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Objectives */}
              <div>
                <Label className="mb-2">Course Objectives</Label>
                <ul className="list-disc list-inside space-y-1">
                  {selectedCurriculum.objectives.map((objective, index) => (
                    <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Curriculum Structure */}
              <div>
                <Label className="mb-2">Curriculum Structure (60-minute slots)</Label>
                <div className="space-y-4">
                  {selectedCurriculum.topics.map((topic, unitIndex) => {
                    const totalSlots = Math.ceil(topic.hours);
                    const slotsPerSubtopic = Math.max(1, Math.floor(totalSlots / Math.max(1, topic.subtopics.length)));
                    
                    return (
                      <div key={topic.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Icon icon="solar:bookmark-line-duotone" className="w-5 h-5 text-blue-500" />
                            <h4 className="font-semibold text-lg">Unit {unitIndex + 1}: {topic.name}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge color="info" size="md" className="min-w-fit">{topic.hours} hours</Badge>
                            <Badge 
                              color={
                                topic.difficulty === 'beginner' ? 'success' :
                                topic.difficulty === 'intermediate' ? 'warning' : 'failure'
                              } 
                              size="sm"
                            >
                              {topic.difficulty}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Topics breakdown */}
                        <div className="ml-6 space-y-3">
                          {topic.subtopics.map((subtopic, subtopicIndex) => {
                            const subtopicSlots = subtopicIndex === topic.subtopics.length - 1 
                              ? totalSlots - (subtopicIndex * slotsPerSubtopic)
                              : slotsPerSubtopic;
                            
                            return (
                              <div key={subtopicIndex} className="border-l-2 border-gray-300 dark:border-gray-600 pl-4">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Icon icon="solar:document-text-line-duotone" className="w-4 h-4 text-green-500" />
                                    <span className="font-medium">{subtopic}</span>
                                  </div>
                                  <Badge 
                                    color={subtopicSlots === 1 ? "info" : "success"} 
                                    size="sm"
                                  >
                                    {subtopicSlots} slot{subtopicSlots > 1 ? 's' : ''}
                                  </Badge>
                                </div>
                                
                                {/* 60-minute slots */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 ml-6">
                                  {Array.from({ length: subtopicSlots }, (_, slotIndex) => (
                                    <div key={slotIndex} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded px-3 py-2">
                                      <Icon icon="solar:clock-circle-line-duotone" className="w-3 h-3 text-blue-500" />
                                      <span className="text-sm font-medium">Slot {slotIndex + 1}</span>
                                      <span className="text-xs text-gray-500">60 min</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={() => setShowCurriculumModal(false)}>
            Close
          </Button>
          <Button color="primary">
            <Icon icon="solar:check-circle-line-duotone" className="w-4 h-4 mr-2" />
            Approve Curriculum
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

const IngestCurriculum: React.FC = () => {
  return (
    <CurriculumProvider>
      <IngestCurriculumContent />
    </CurriculumProvider>
  );
};

export default IngestCurriculum;
