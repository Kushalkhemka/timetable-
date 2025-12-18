import React, { useState, useRef, useEffect } from 'react';
import { 
  Button, 
  TextInput, 
  Badge, 
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Spinner
} from 'flowbite-react';
import { 
  Icon 
} from '@iconify/react';
import CardBox from '../../../components/shared/CardBox';
import { formatDistanceToNow } from 'date-fns';
import { useAIModifications, AIModificationsProvider } from '../../../context/AIModificationsContext';

interface AIModificationsProps {}

const AIModificationsContent: React.FC<AIModificationsProps> = () => {
  const {
    messages,
    timetableData,
    isLoading,
    currentAction,
    processUserInput,
    confirmAction,
    cancelAction
  } = useAIModifications();
  
  const [inputMessage, setInputMessage] = useState('');
  const [selectedView, setSelectedView] = useState<'chat' | 'timetable'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    await processUserInput(inputMessage);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'success';
      case 'CANCELLED': return 'error';
      case 'RESCHEDULED': return 'warning';
      case 'SUBSTITUTE': return 'info';
      default: return 'primary';
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'LECTURE': return 'primary';
      case 'LAB': return 'warning';
      case 'TUTORIAL': return 'info';
      default: return 'secondary';
    }
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
            Manage your timetable using natural language commands
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            color={selectedView === 'chat' ? 'primary' : 'light'}
            onClick={() => setSelectedView('chat')}
            className="flex items-center gap-2"
          >
            <Icon icon="solar:chat-round-line-duotone" className="w-4 h-4" />
            Chat Interface
          </Button>
          <Button
            color={selectedView === 'timetable' ? 'primary' : 'light'}
            onClick={() => setSelectedView('timetable')}
            className="flex items-center gap-2"
          >
            <Icon icon="solar:calendar-mark-line-duotone" className="w-4 h-4" />
            Timetable View
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <CardBox>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Button
              color="light"
              className="flex flex-col items-center gap-2 h-auto py-4"
              onClick={() => setInputMessage('Schedule a new class')}
            >
              <Icon icon="solar:calendar-add-line-duotone" className="w-6 h-6 text-primary" />
              <span className="text-sm">Schedule Class</span>
            </Button>
            <Button
              color="light"
              className="flex flex-col items-center gap-2 h-auto py-4"
              onClick={() => setInputMessage('Cancel a class')}
            >
              <Icon icon="solar:calendar-remove-line-duotone" className="w-6 h-6 text-error" />
              <span className="text-sm">Cancel Class</span>
            </Button>
            <Button
              color="light"
              className="flex flex-col items-center gap-2 h-auto py-4"
              onClick={() => setInputMessage('Reschedule a class')}
            >
              <Icon icon="solar:calendar-mark-line-duotone" className="w-6 h-6 text-warning" />
              <span className="text-sm">Reschedule</span>
            </Button>
            <Button
              color="light"
              className="flex flex-col items-center gap-2 h-auto py-4"
              onClick={() => setInputMessage('Swap classes between teachers')}
            >
              <Icon icon="solar:refresh-line-duotone" className="w-6 h-6 text-info" />
              <span className="text-sm">Swap Classes</span>
            </Button>
            <Button
              color="light"
              className="flex flex-col items-center gap-2 h-auto py-4"
              onClick={() => setInputMessage('Check free slots')}
            >
              <Icon icon="solar:search-line-duotone" className="w-6 h-6 text-success" />
              <span className="text-sm">Check Availability</span>
            </Button>
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
                <h3 className="text-lg font-semibold">AI Assistant</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Chat with AI to manage your timetable
                </p>
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
                      <p className="text-sm">{message.content}</p>
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
                <div className="flex gap-2">
                  <TextInput
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here... (e.g., 'Schedule CSE-A Data Structures for P1')"
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    color="primary"
                  >
                    <Icon icon="solar:plain-linear" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardBox>
          </div>

          {/* Timetable Overview */}
          <div className="lg:col-span-1">
            <CardBox>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Today's Schedule</h3>
                <div className="space-y-3">
                  {timetableData.slice(0, 5).map((slot) => (
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
                </div>
              </div>
            </CardBox>
          </div>
        </div>
      ) : (
        /* Timetable View */
        <CardBox>
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Timetable Overview</h3>
              <div className="flex gap-2">
                <Button color="light" size="sm">
                  <Icon icon="solar:download-line-duotone" className="w-4 h-4" />
                  Export
                </Button>
                <Button color="light" size="sm">
                  <Icon icon="solar:refresh-line-duotone" className="w-4 h-4" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Timetable Grid */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-3 font-medium">Class</th>
                    <th className="text-left p-3 font-medium">Period</th>
                    <th className="text-left p-3 font-medium">Subject</th>
                    <th className="text-left p-3 font-medium">Teacher</th>
                    <th className="text-left p-3 font-medium">Room</th>
                    <th className="text-left p-3 font-medium">Type</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {timetableData.map((slot) => (
                    <tr
                      key={slot.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="p-3 font-medium">{slot.class}</td>
                      <td className="p-3">{slot.period}</td>
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
                            <Icon icon="solar:pen-line-duotone" className="w-3 h-3" />
                          </Button>
                          <Button size="sm" color="light">
                            <Icon icon="solar:trash-bin-minimalistic-line-duotone" className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardBox>
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
