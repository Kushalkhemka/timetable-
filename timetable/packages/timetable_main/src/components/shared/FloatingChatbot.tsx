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
  IconMessageCircle,
  IconX,
  IconMinimize,
  IconMaximize,
  IconRobot,
  IconSend,
  IconSettings
} from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { useAIModifications, AIModificationsProvider } from '../../context/AIModificationsContext';

interface FloatingChatbotProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  initialOpen?: boolean;
}

const FloatingChatbotContent: React.FC<FloatingChatbotProps> = ({ 
  position = 'bottom-right',
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

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      default:
        return 'bottom-6 right-6';
    }
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      <div className={`fixed ${getPositionClasses()} z-50`}>
        <Button
          color="primary"
          size="xl"
          className="h-14 w-14 flex justify-center items-center rounded-full hover:bg-primaryemphasis shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="shrink-0">
            {isOpen ? <IconSettings className="w-6 h-6" /> : <IconRobot className="w-6 h-6" />}
          </div>
        </Button>
      </div>

      {/* Chatbot Modal */}
      <Modal 
        show={isOpen} 
        onClose={() => setIsOpen(false)}
        size="lg"
        className="fixed inset-0 z-50"
        position="center"
      >
        <ModalHeader className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <IconRobot className="w-6 h-6" />
            <div>
              <h3 className="text-lg font-semibold">AI Timetable Assistant</h3>
              <p className="text-sm opacity-90">Advanced AI with reasoning transparency</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge color="light" size="sm" className="flex items-center gap-2">
              <span>AcadSync AI</span>
            </Badge>
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
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <IconX className="w-4 h-4" />
            </Button>
          </div>
        </ModalHeader>

        {!isMinimized && (
          <>
            <ModalBody className="p-0">
              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
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
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <IconMessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                              AI Reasoning Process
                            </span>
                          </div>
                          <div className="space-y-2">
                            {message.metadata.thoughts.slice(0, 2).map((thought: any, index: number) => (
                              <div key={index} className="text-xs text-blue-600 dark:text-blue-400">
                                <span className="font-medium">Step {thought.step}:</span> {thought.thought}
                                {thought.confidence && (
                                  <span className="ml-2 text-blue-500">
                                    ({Math.round(thought.confidence * 100)}% confidence)
                                  </span>
                                )}
                              </div>
                            ))}
                            {message.metadata.thoughts.length > 2 && (
                              <div className="text-xs text-blue-500 italic">
                                +{message.metadata.thoughts.length - 2} more reasoning steps...
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Tree of Thought Display */}
                      {message.type === 'ai' && message.metadata?.treeOfThought && (
                        <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <IconRobot className="w-3 h-3 text-green-600 dark:text-green-400" />
                            <span className="text-xs font-medium text-green-700 dark:text-green-300">
                              Solution Exploration
                            </span>
                          </div>
                          <div className="text-xs text-green-600 dark:text-green-400">
                            {message.metadata.treeOfThought.content}
                            {message.metadata.treeOfThought.confidence && (
                              <span className="ml-1">
                                ({Math.round(message.metadata.treeOfThought.confidence * 100)}%)
                              </span>
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
                    <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
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
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="relative flex gap-2">
                  <TextInput
                    value={inputMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here... (e.g., 'Schedule @CSE-A Data Structures with @Dr.Smith for P1')"
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    color="primary"
                    size="sm"
                  >
                    <IconSend className="w-4 h-4" />
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
            </ModalBody>
          </>
        )}
      </Modal>

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

const FloatingChatbot: React.FC<FloatingChatbotProps> = (props) => {
  return (
    <AIModificationsProvider>
      <FloatingChatbotContent {...props} />
    </AIModificationsProvider>
  );
};

export default FloatingChatbot;
