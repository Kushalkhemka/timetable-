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
  Drawer
} from 'flowbite-react';
import { 
  IconMessageCircle,
  IconX,
  IconMinimize,
  IconMaximize,
  IconRobot,
  IconSend,
  IconSettings,
  IconPhone,
  IconVideo,
  IconDotsVertical,
  IconPaperclip,
  IconMicrophone,
  IconPhoto,
  IconMoodSmile
} from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { useAIModifications, AIModificationsProvider } from '../../context/AIModificationsContext';
// @ts-ignore
import SimpleBar from 'simplebar-react';

interface SupportChatbotProps {
  position?: 'left' | 'right';
  initialOpen?: boolean;
}

const SupportChatbotContent: React.FC<SupportChatbotProps> = ({ 
  position = 'left',
  initialOpen = false 
}) => {
  const {
    messages,
    isLoading,
    currentAction,
    processUserInput,
    confirmAction,
    cancelAction,
    getMentionSuggestions
  } = useAIModifications();
  
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [mentionResults, setMentionResults] = useState<{ id: string; label: string; type: any }[]>([]);
  const [showMentionList, setShowMentionList] = useState(false);
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

  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Floating Support Button */}
      <div className={`fixed ${position === 'left' ? 'bottom-6 left-6' : 'bottom-6 right-6'} z-50`}>
        <Button
          color="primary"
          size="xl"
          className="h-14 w-14 flex justify-center items-center rounded-full hover:bg-primaryemphasis shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="shrink-0">
            {isOpen ? <IconX className="w-6 h-6" /> : <IconMessageCircle className="w-6 h-6" />}
          </div>
        </Button>
      </div>

      {/* Support Chat Drawer */}
      <Drawer 
        open={isOpen} 
        onClose={handleClose}
        position={position}
        className="max-w-[400px] w-full bg-white dark:bg-gray-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <IconRobot className="w-6 h-6" />
              </div>
              <Badge
                color="success"
                className="p-0 h-2 w-2 absolute bottom-1 end-0"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">AI Support</h3>
              <p className="text-sm opacity-90">Online • Timetable Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              color="light"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-white/20"
            >
              {isMinimized ? <IconMaximize className="w-4 h-4" /> : <IconMinimize className="w-4 h-4" />}
            </Button>
            <Button
              color="light"
              size="sm"
              onClick={handleClose}
              className="text-white hover:bg-white/20"
            >
              <IconX className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <Button color="light" size="sm" className="flex items-center gap-2">
                <IconPhone className="w-4 h-4" />
                Call
              </Button>
              <Button color="light" size="sm" className="flex items-center gap-2">
                <IconVideo className="w-4 h-4" />
                Video
              </Button>
              <Button color="light" size="sm" className="flex items-center gap-2">
                <IconDotsVertical className="w-4 h-4" />
                More
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden">
              <SimpleBar className="max-h-[500px] h-[400px]">
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'ai' && (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <IconRobot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      <div className={`max-w-[280px] ${message.type === 'user' ? 'order-first' : ''}`}>
                        {message.type === 'ai' && (
                          <div className="text-xs text-gray-500 mb-1">
                            AI Assistant • {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                          </div>
                        )}
                        
                        <div
                          className={`px-3 py-2 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-blue-500 text-white ml-auto'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                          
                          {/* AI Reasoning Display */}
                          {message.type === 'ai' && message.metadata?.thoughts && message.metadata.thoughts.length > 0 && (
                            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                              <div className="flex items-center gap-1 mb-1">
                                <IconMessageCircle className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                  AI Reasoning
                                </span>
                              </div>
                              <div className="space-y-1">
                                {message.metadata.thoughts.slice(0, 1).map((thought: any, index: number) => (
                                  <div key={index} className="text-xs text-blue-600 dark:text-blue-400">
                                    {thought.thought}
                                    {thought.confidence && (
                                      <span className="ml-1 text-blue-500">
                                        ({Math.round(thought.confidence * 100)}%)
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Tree of Thought Display */}
                          {message.type === 'ai' && message.metadata?.treeOfThought && (
                            <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                              <div className="flex items-center gap-1 mb-1">
                                <IconRobot className="w-3 h-3 text-green-600 dark:text-green-400" />
                                <span className="text-xs font-medium text-green-700 dark:text-green-300">
                                  Solution
                                </span>
                              </div>
                              <div className="text-xs text-green-600 dark:text-green-400">
                                {message.metadata.treeOfThought.content}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {message.type === 'user' && (
                          <div className="text-xs text-gray-500 mt-1 text-right">
                            You • {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                          </div>
                        )}
                        
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
                      
                      {message.type === 'user' && (
                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">U</span>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <IconRobot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Spinner size="sm" />
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </SimpleBar>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="relative">
                <div className="flex items-center gap-2">
                  <Button color="light" size="sm" className="p-2">
                    <IconMoodSmile className="w-4 h-4" />
                  </Button>
                  <TextInput
                    value={inputMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <div className="flex gap-1">
                    <Button color="light" size="sm" className="p-2">
                      <IconPaperclip className="w-4 h-4" />
                    </Button>
                    <Button color="light" size="sm" className="p-2">
                      <IconPhoto className="w-4 h-4" />
                    </Button>
                    <Button color="light" size="sm" className="p-2">
                      <IconMicrophone className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      color="primary"
                      size="sm"
                      className="p-2"
                    >
                      <IconSend className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {showMentionList && mentionResults.length > 0 && (
                  <div className="absolute bottom-12 left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-2 z-10">
                    <div className="text-xs text-gray-500 mb-1 px-1">Mention to set context</div>
                    <ul className="max-h-40 overflow-y-auto">
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
          </>
        )}
      </Drawer>

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
    </>
  );
};

const SupportChatbot: React.FC<SupportChatbotProps> = (props) => {
  return (
    <AIModificationsProvider>
      <SupportChatbotContent {...props} />
    </AIModificationsProvider>
  );
};

export default SupportChatbot;
