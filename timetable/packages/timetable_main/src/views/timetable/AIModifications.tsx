import React, { useState, useRef, useEffect } from 'react';
import { 
  Button, 
  TextInput, 
  Badge, 
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Spinner,
  Select,
  Label
} from 'flowbite-react';
import { 
  IconCalendarPlus,
  IconCalendarMinus,
  IconCalendarEvent,
  IconRefresh,
  IconSearch,
  IconCalendar,
  IconTrash,
  IconEdit,
  IconDownload,
  IconMessageCircle,
  IconUsers,
  IconUser,
  IconHome
} from '@tabler/icons-react';
import CardBox from '../../components/shared/CardBox';
import { formatDistanceToNow } from 'date-fns';
import { useAIModifications, AIModificationsProvider } from '../../context/AIModificationsContext';
import QuickActionButton from '../../components/shared/QuickActionButton';
import { supabase } from '../../lib/supabaseClient';

interface AIModificationsProps {}

const AIModificationsContent: React.FC<AIModificationsProps> = () => {
  const {
    messages,
    timetableData,
    isLoading,
    currentAction,
    processUserInput,
    confirmAction,
    cancelAction,
    getMentionSuggestions
  } = useAIModifications();
  
  const [inputMessage, setInputMessage] = useState('');
  const [selectedView, setSelectedView] = useState<'chat' | 'timetable'>('chat');
  const [filterType, setFilterType] = useState<'batch' | 'teacher' | 'room'>('batch');
  const [filterValue, setFilterValue] = useState('');
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [mentionResults, setMentionResults] = useState<{ id: string; label: string; type: any }[]>([]);
  const [showMentionList, setShowMentionList] = useState(false);
  const [batches, setBatches] = useState<string[]>([]);
  const [teachers, setTeachers] = useState<string[]>([]);
  const [rooms, setRooms] = useState<string[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [filterError, setFilterError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch filter data from Supabase
  const fetchFilterData = async () => {
    setLoadingFilters(true);
    try {
      console.log('🔄 Fetching filter data from Supabase...');
      
      // Fetch batches (students/sections)
      const { data: batchData, error: batchError } = await supabase
        .from('timetable_classes')
        .select('students')
        .not('students', 'is', null)
        .not('students', 'eq', '');

      if (batchError) {
        console.error('❌ Batch data error:', batchError);
        throw batchError;
      }

      console.log('✅ Batch data fetched:', batchData?.length || 0, 'records');

      const uniqueBatches = [...new Set(batchData?.map(item => item.students) || [])]
        .sort()
        .map(batch => {
          // Convert from "COMPUTER_SCIENCE_ENGINEERING_SEC-1__SEC-1" to "Computer Science Engineering SEC-1"
          const parts = batch.split('_');
          if (parts.length >= 3) {
            const dept = parts.slice(0, -2).join(' ').replace(/_/g, ' ');
            const section = parts[parts.length - 2];
            return `${dept} ${section}`;
          }
          return batch;
        });

      setBatches(uniqueBatches);
      console.log('✅ Batches processed:', uniqueBatches.length);

      // Fetch teachers
      const { data: teacherData, error: teacherError } = await supabase
        .from('timetable_classes')
        .select('instructor_name')
        .not('instructor_name', 'is', null)
        .not('instructor_name', 'eq', '');

      if (teacherError) {
        console.error('❌ Teacher data error:', teacherError);
        throw teacherError;
      }

      console.log('✅ Teacher data fetched:', teacherData?.length || 0, 'records');

      const uniqueTeachers = [...new Set(teacherData?.map(item => item.instructor_name) || [])]
        .sort()
        .filter(teacher => teacher && teacher.trim() !== '');

      setTeachers(uniqueTeachers);
      console.log('✅ Teachers processed:', uniqueTeachers.length);

      // Fetch rooms
      const { data: roomData, error: roomError } = await supabase
        .from('timetable_classes')
        .select('room')
        .not('room', 'is', null)
        .not('room', 'eq', '');

      if (roomError) {
        console.error('❌ Room data error:', roomError);
        throw roomError;
      }

      console.log('✅ Room data fetched:', roomData?.length || 0, 'records');

      const uniqueRooms = [...new Set(roomData?.map(item => item.room) || [])]
        .sort()
        .filter(room => room && room.trim() !== '');

      setRooms(uniqueRooms);
      console.log('✅ Rooms processed:', uniqueRooms.length);

    } catch (error) {
      console.error('❌ Error fetching filter data:', error);
      setFilterError(error instanceof Error ? error.message : 'Failed to load filter data');
      // Set empty arrays as fallback
      setBatches([]);
      setTeachers([]);
      setRooms([]);
    } finally {
      setLoadingFilters(false);
    }
  };

  // Load filter data on component mount
  useEffect(() => {
    fetchFilterData();
  }, []);

  // Filter data based on selected criteria - fetch from Supabase
  useEffect(() => {
    if (!filterValue) {
      setFilteredData([]);
      return;
    }

    const fetchFilteredTimetableData = async () => {
      try {
        console.log('🔄 Fetching filtered timetable data for:', filterType, filterValue);
        
        let query = supabase
          .from('timetable_classes')
          .select(`
            id,
            students,
            course,
            part,
            day,
            period,
            room,
            instructor_name,
            timetable_sections(section_name)
          `);

        switch (filterType) {
          case 'batch':
            // Find the original batch name from the display name
            const originalBatchName = batches.find(batch => batch === filterValue);
            if (originalBatchName) {
              // Convert back to database format
              const batchParts = originalBatchName.split(' ');
              const deptPart = batchParts.slice(0, -1).join('_').toUpperCase();
              const sectionPart = batchParts[batchParts.length - 1];
              const dbBatchName = `${deptPart}_${sectionPart}__${sectionPart}`;
              console.log('🔍 Searching for batch:', dbBatchName);
              query = query.eq('students', dbBatchName);
            } else {
              console.warn('⚠️ Original batch name not found for:', filterValue);
              setFilteredData([]);
              return;
            }
            break;
          case 'teacher':
            console.log('🔍 Searching for teacher:', filterValue);
            query = query.eq('instructor_name', filterValue);
            break;
          case 'room':
            console.log('🔍 Searching for room:', filterValue);
            query = query.eq('room', filterValue);
            break;
        }

        const { data, error } = await query.order('day').order('period');

        if (error) {
          console.error('❌ Filtered data error:', error);
          throw error;
        }

        console.log('✅ Filtered data fetched:', data?.length || 0, 'records');

        // Transform data to match expected format
        const transformedData = data?.map(item => ({
          id: item.id,
          class: item.students,
          subject: item.course,
          teacher: item.instructor_name,
          room: item.room,
          period: item.period,
          day: item.day,
          type: item.part || 'Lecture',
          status: 'scheduled'
        })) || [];

        setFilteredData(transformedData);
        console.log('✅ Transformed data:', transformedData.length, 'records');
      } catch (error) {
        console.error('❌ Error fetching filtered timetable data:', error);
        setFilteredData([]);
      }
    };

    fetchFilteredTimetableData();
  }, [filterType, filterValue]);

  const getFilterOptions = () => {
    switch (filterType) {
      case 'batch': return batches;
      case 'teacher': return teachers;
      case 'room': return rooms;
      default: return [];
    }
  };

  const getFilterLabel = () => {
    switch (filterType) {
      case 'batch': return 'Batch/Class';
      case 'teacher': return 'Teacher';
      case 'room': return 'Room';
      default: return 'Select Filter';
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    await processUserInput(inputMessage);
    setInputMessage('');
    setShowMentionList(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputMessage(val);
    const match = val.match(/@([^\s@:]*)$/);
    if (match) {
      const q = match[1];
      try {
        const results = await getMentionSuggestions(q);
        setMentionResults(results.map(m => ({ id: m.id, label: m.label, type: m.type })));
        setShowMentionList(true);
      } catch (error) {
        console.error('Error getting mention suggestions:', error);
        setShowMentionList(false);
        setMentionResults([]);
      }
    } else {
      setShowMentionList(false);
      setMentionResults([]);
    }
  };

  const pickMention = (item: { id: string; label: string; type: any }) => {
    const replaced = inputMessage.replace(/@([^\s@:]*)$/, `@${item.label} `);
    setInputMessage(replaced);
    setShowMentionList(false);
  };

  const getStatusColor = (_status: string) => {
    return 'primary';
  };

  const getTypeColor = (_type?: string) => {
    return 'primary';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            AI Timetable Modifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Advanced AI agent with Chain of Thought reasoning, Tree of Thought exploration, and context-aware @mentions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            color={selectedView === 'chat' ? 'primary' : 'light'}
            onClick={() => setSelectedView('chat')}
            className="flex items-center gap-2"
          >
            <IconCalendar className="w-4 h-4" />
            Chat Interface
          </Button>
          <Button
            color={selectedView === 'timetable' ? 'primary' : 'light'}
            onClick={() => setSelectedView('timetable')}
            className="flex items-center gap-2"
          >
            <IconCalendar className="w-4 h-4" />
            Timetable View
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <CardBox>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <QuickActionButton
              label="Schedule Class"
              tone="primary"
              onClick={() => setInputMessage('Schedule a new class')}
              icon={<IconCalendarPlus className="w-5 h-5 text-blue-600 dark:text-blue-300" />}
            />
            <QuickActionButton
              label="Cancel Class"
              tone="failure"
              onClick={() => setInputMessage('Cancel a class')}
              icon={<IconCalendarMinus className="w-5 h-5 text-red-600 dark:text-red-300" />}
            />
            <QuickActionButton
              label="Reschedule"
              tone="warning"
              onClick={() => setInputMessage('Reschedule a class')}
              icon={<IconCalendarEvent className="w-5 h-5 text-orange-600 dark:text-orange-300" />}
            />
            <QuickActionButton
              label="Swap Classes"
              tone="info"
              onClick={() => setInputMessage('Swap classes between teachers')}
              icon={<IconRefresh className="w-5 h-5 text-cyan-600 dark:text-cyan-300" />}
            />
            <QuickActionButton
              label="Check Availability"
              tone="success"
              onClick={() => setInputMessage('Check free slots')}
              icon={<IconSearch className="w-5 h-5 text-green-600 dark:text-green-300" />}
            />
          </div>
        </div>
      </CardBox>

      {/* Main Content */}
      {selectedView === 'chat' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <CardBox className="p-0 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">AI Assistant</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Advanced AI with reasoning transparency and database integration
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge color="primary" size="sm" className="flex items-center gap-2">
                      
                      <span>AcadSync AI</span>
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      {message.metadata?.mentions?.length ? (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.metadata.mentions.map((m: any) => (
                            <Badge key={m.id} color="light" size="xs">@{m.label}</Badge>
                          ))}
                        </div>
                      ) : null}
                      
                      {/* AI Reasoning Display */}
                      {message.type === 'ai' && message.metadata?.thoughts && message.metadata.thoughts.length > 0 && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <IconMessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              AI Reasoning Process
                            </span>
                          </div>
                          <div className="space-y-2">
                            {message.metadata.thoughts.slice(0, 3).map((thought: any, index: number) => (
                              <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Step {thought.step}:</span> {thought.thought}
                                {thought.confidence && (
                                  <span className="ml-2 text-blue-600 dark:text-blue-400">
                                    ({Math.round(thought.confidence * 100)}% confidence)
                                  </span>
                                )}
                              </div>
                            ))}
                            {message.metadata.thoughts.length > 3 && (
                              <div className="text-xs text-gray-500 dark:text-gray-500 italic">
                                +{message.metadata.thoughts.length - 3} more reasoning steps...
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Tree of Thought Display */}
                      {message.type === 'ai' && message.metadata?.treeOfThought && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <IconCalendar className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                              Solution Exploration
                            </span>
                          </div>
                          <div className="text-xs text-blue-600 dark:text-blue-400">
                            {message.metadata.treeOfThought.content}
                            {message.metadata.treeOfThought.confidence && (
                              <span className="ml-1">
                                ({Math.round(message.metadata.treeOfThought.confidence * 100)}%)
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Entity Context Display */}
                      {message.type === 'ai' && message.metadata?.entities && message.metadata.entities.length > 0 && (
                        <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <IconUsers className="w-3 h-3 text-green-600 dark:text-green-400" />
                            <span className="text-xs font-medium text-green-700 dark:text-green-300">
                              Context from @mentions
                            </span>
                          </div>
                          <div className="space-y-1">
                            {message.metadata.entities.slice(0, 2).map((entity: any) => (
                              <div key={entity.id} className="text-xs text-green-600 dark:text-green-400">
                                <span className="font-medium">@{entity.label}</span>
                                {entity.context && (
                                  <span className="ml-1">
                                    ({entity.context.totalClasses || 0} classes)
                                  </span>
                                )}
                              </div>
                            ))}
                            {message.metadata.entities.length > 2 && (
                              <div className="text-xs text-green-500 dark:text-green-500 italic">
                                +{message.metadata.entities.length - 2} more entities...
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <p className="text-xs opacity-70 mt-1">
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </p>
                      {message.actionType && (
                        <Badge
                          color="info"
                          size="sm"
                          className="mt-2"
                        >
                          {message.actionType}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Spinner size="sm" />
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="relative flex gap-2">
                  <TextInput
                    value={inputMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here... (e.g., 'Schedule @CSE-A Data Structures with @Dr.Smith for P1', or 'Show me @LAB-1 availability')"
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    color="primary"
                  >
                    <IconMessageCircle className="w-4 h-4" />
                  </Button>

                  {showMentionList && mentionResults.length > 0 && (
                    <div className="absolute bottom-12 left-0 w-full max-w-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-2 z-10">
                      <div className="text-xs text-gray-500 mb-1 px-1">Mention to set context</div>
                      <ul className="max-h-60 overflow-y-auto">
                        {mentionResults.map(item => (
                          <li key={item.id}>
                            <button
                              type="button"
                              className="w-full text-left px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                              onClick={() => pickMention(item)}
                            >
                              <span className="font-medium">@{item.label}</span>
                              <span className="ml-2 text-xs opacity-60">{item.type}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </CardBox>
          </div>

          {/* Quick Timetable Preview */}
          <div className="lg:col-span-1">
            <CardBox>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Quick Preview</h3>
                <div className="space-y-3">
                  {timetableData.slice(0, 3).map((slot) => (
                    <div
                      key={slot.id}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge color={getStatusColor(slot.status)} size="sm">
                          {slot.status}
                        </Badge>
                        <Badge color={getTypeColor(slot.type)} size="sm">
                          {slot.type}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{slot.class} - {slot.period}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {slot.subject}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {slot.teacher} • {slot.room}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-2">
                    <Button 
                      color="light" 
                      size="sm" 
                      onClick={() => setSelectedView('timetable')}
                      className="w-full"
                    >
                      <IconCalendar className="w-4 h-4 mr-2" />
                      View Full Timetable
                    </Button>
                  </div>
                </div>
              </div>
            </CardBox>
          </div>
        </div>
      ) : (
        /* Timetable View with Filters */
        <div className="space-y-6">
          {/* Filters */}
          <CardBox>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filter Timetable</h3>
                {loadingFilters && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Spinner size="sm" />
                    Loading data...
                  </div>
                )}
                {filterError && (
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <span>⚠️ {filterError}</span>
                    <Button
                      size="sm"
                      color="light"
                      onClick={() => {
                        setFilterError(null);
                        fetchFilterData();
                      }}
                    >
                      Retry
                    </Button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="filter-type" className="mb-2 block">Filter By</Label>
                  <Select
                    id="filter-type"
                    value={filterType}
                    onChange={(e) => {
                      setFilterType(e.target.value as 'batch' | 'teacher' | 'room');
                      setFilterValue('');
                    }}
                    disabled={loadingFilters}
                  >
                    <option value="batch">Batch/Class</option>
                    <option value="teacher">Teacher</option>
                    <option value="room">Room</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="filter-value" className="mb-2 block">{getFilterLabel()}</Label>
                  <Select
                    id="filter-value"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    disabled={!filterType || loadingFilters}
                  >
                    <option value="">Select {getFilterLabel()}</option>
                    {getFilterOptions().map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    color="light"
                    onClick={() => {
                      setFilterValue('');
                      setFilteredData([]);
                    }}
                    className="w-full"
                    disabled={loadingFilters}
                  >
                    <IconRefresh className="w-4 h-4 mr-2" />
                    Clear Filter
                  </Button>
                </div>
              </div>
            </div>
          </CardBox>

          {/* Timetable Grid */}
          {filterValue ? (
            <CardBox>
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">
                    Timetable for {filterType === 'batch' ? 'Batch' : filterType === 'teacher' ? 'Teacher' : 'Room'}: {filterValue}
                  </h3>
                  <div className="flex gap-2">
                    <Button color="light" size="sm">
                      <IconDownload className="w-4 h-4" />
                      Export
                    </Button>
                    <Button color="light" size="sm">
                      <IconRefresh className="w-4 h-4" />
                      Refresh
                    </Button>
                  </div>
                </div>

                {filteredData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left p-3 font-medium">Day</th>
                          <th className="text-left p-3 font-medium">Period</th>
                          <th className="text-left p-3 font-medium">Class</th>
                          <th className="text-left p-3 font-medium">Subject</th>
                          <th className="text-left p-3 font-medium">Teacher</th>
                          <th className="text-left p-3 font-medium">Room</th>
                          <th className="text-left p-3 font-medium">Type</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-left p-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((slot) => (
                          <tr
                            key={slot.id}
                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <td className="p-3 font-medium">{slot.day}</td>
                            <td className="p-3 font-medium">{slot.period}</td>
                            <td className="p-3">{slot.class}</td>
                            <td className="p-3">{slot.subject}</td>
                            <td className="p-3">{slot.teacher}</td>
                            <td className="p-3">{slot.room}</td>
                            <td className="p-3">
                              <Badge color={getTypeColor(slot.type)} size="sm">
                                {slot.type}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Badge color={getStatusColor(slot.status)} size="sm">
                                {slot.status}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex gap-1">
                                <Button size="sm" color="light">
                                  <IconEdit className="w-3 h-3" />
                                </Button>
                                <Button size="sm" color="light">
                                  <IconTrash className="w-3 h-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <IconCalendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">No Classes Found</h4>
                    <p className="text-gray-500 dark:text-gray-500">
                      No classes scheduled for {filterType === 'batch' ? 'batch' : filterType === 'teacher' ? 'teacher' : 'room'} "{filterValue}"
                    </p>
                  </div>
                )}
              </div>
            </CardBox>
          ) : (
            <CardBox>
              <div className="p-8 text-center">
                <IconCalendar className="w-20 h-20 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Select Filter to View Timetable</h3>
                <p className="text-gray-500 dark:text-gray-500 mb-6">
                  Choose a batch, teacher, or room to view their specific timetable
                </p>
                {filterError ? (
                  <div className="text-center">
                    <div className="text-red-500 mb-4">
                      <IconCalendar className="w-16 h-16 mx-auto mb-2" />
                      <p className="text-lg font-medium">Failed to Load Data</p>
                      <p className="text-sm">{filterError}</p>
                    </div>
                    <Button
                      color="primary"
                      onClick={() => {
                        setFilterError(null);
                        fetchFilterData();
                      }}
                      className="flex items-center gap-2"
                    >
                      <IconRefresh className="w-4 h-4" />
                      Retry Loading Data
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-center gap-4">
                    <Button
                      color="primary"
                      onClick={() => {
                        setFilterType('batch');
                        setFilterValue(batches[0] || '');
                      }}
                      className="flex items-center gap-2"
                      disabled={batches.length === 0}
                    >
                      <IconUsers className="w-4 h-4" />
                      View Batch Timetable
                    </Button>
                    <Button
                      color="primary"
                      onClick={() => {
                        setFilterType('teacher');
                        setFilterValue(teachers[0] || '');
                      }}
                      className="flex items-center gap-2"
                      disabled={teachers.length === 0}
                    >
                      <IconUser className="w-4 h-4" />
                      View Teacher Schedule
                    </Button>
                    <Button
                      color="primary"
                      onClick={() => {
                        setFilterType('room');
                        setFilterValue(rooms[0] || '');
                      }}
                      className="flex items-center gap-2"
                      disabled={rooms.length === 0}
                    >
                      <IconHome className="w-4 h-4" />
                      View Room Schedule
                    </Button>
                  </div>
                )}
              </div>
            </CardBox>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {currentAction && (
        <Modal show={true} onClose={cancelAction}>
          <ModalHeader>
            Confirm Action
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Please confirm the following action:
              </p>
              
              {currentAction.type === 'SCHEDULE' && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Schedule New Class</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Class:</strong> {currentAction.parameters.class}</p>
                    <p><strong>Subject:</strong> {currentAction.parameters.subject}</p>
                    <p><strong>Teacher:</strong> {currentAction.parameters.teacher}</p>
                    <p><strong>Period:</strong> {currentAction.parameters.period}</p>
                    <p><strong>Room:</strong> {currentAction.parameters.room}</p>
                  </div>
                </div>
              )}

              {currentAction.type === 'CANCEL' && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Cancel Class</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Class:</strong> {currentAction.parameters.class}</p>
                    <p><strong>Subject:</strong> {currentAction.parameters.subject}</p>
                    <p><strong>Teacher:</strong> {currentAction.parameters.teacher}</p>
                    <p><strong>Period:</strong> {currentAction.parameters.period}</p>
                  </div>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => confirmAction(currentAction)}>
              Confirm
            </Button>
            <Button color="light" onClick={cancelAction}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
};

const AIModifications: React.FC<AIModificationsProps> = () => {
  return (
    <AIModificationsProvider>
      <AIModificationsContent />
    </AIModificationsProvider>
  );
};

export default AIModifications;
