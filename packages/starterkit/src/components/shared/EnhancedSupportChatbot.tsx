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
  Drawer,
  HR
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
  IconMoodSmile,
  IconCalendarPlus,
  IconCalendarMinus,
  IconCalendarEvent,
  IconSearch,
  IconUsers,
  
} from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { useAIModifications, AIModificationsProvider } from '../../context/AIModificationsContext';
import { streamGeminiChat } from '../../lib/openaiStream';
// @ts-ignore
import SimpleBar from 'simplebar-react';

interface EnhancedSupportChatbotProps {
  position?: 'left' | 'right';
  initialOpen?: boolean;
  mode?: 'drawer' | 'widget';
  externalControl?: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
  };
}

const EnhancedSupportChatbotContent: React.FC<EnhancedSupportChatbotProps> = ({ 
  position = 'left',
  initialOpen = false,
  mode = 'drawer',
  externalControl
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
  
  // Use external control if provided
  const actualIsOpen = externalControl ? externalControl.isOpen : isOpen;
  const actualSetIsOpen = externalControl ? externalControl.setIsOpen : setIsOpen;
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [mentionResults, setMentionResults] = useState<{ id: string; label: string; type: any }[]>([]);
  const [showMentionList, setShowMentionList] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const cancelStreamRef = useRef<{ cancel: () => void } | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMsg = inputMessage;
    setInputMessage('');
    setShowMentionList(false);
    // Start lightweight streaming for immediate feedback (non-authoritative)
    try {
      setIsStreaming(true);
      setStreamingText('');
      const systemPrompt = 'You are an AI timetable management assistant. Keep responses concise while the full agent finalizes.';
      cancelStreamRef.current = streamGeminiChat(systemPrompt, userMsg, (delta) => {
        setStreamingText((prev) => prev + delta);
      });
    } catch (_e) {
      // ignore streaming failures
    }
    // Use existing pipeline (adds user msg, calls AI agent with thoughts/actions)
    await processUserInput(userMsg);
    // Stop streaming once authoritative message arrives
    if (cancelStreamRef.current) cancelStreamRef.current.cancel();
    setIsStreaming(false);
    setStreamingText('');
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

  const handleClose = () => actualSetIsOpen(false);

  const quickActions = [
    { label: "Schedule Class", icon: IconCalendarPlus, action: "Schedule a new class", color: "blue" },
    { label: "Cancel Class", icon: IconCalendarMinus, action: "Cancel a class", color: "red" },
    { label: "Reschedule", icon: IconCalendarEvent, action: "Reschedule a class", color: "orange" },
    { label: "Check Availability", icon: IconSearch, action: "Check free slots", color: "green" },
    { label: "View Schedule", icon: IconUsers, action: "Show me my schedule", color: "purple" },
  ];

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    setShowQuickActions(false);
  };

  return (
    <>
      {/* Floating Support Button - Only show if not externally controlled */}
      {!externalControl && (
        <div className={`fixed ${position === 'left' ? 'bottom-6 left-6' : 'bottom-6 right-6'} z-50`}>
        <div className="relative">
          <Button
            color="primary"
            size="xl"
            className="h-14 w-14 flex justify-center items-center rounded-full hover:bg-primaryemphasis shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => actualSetIsOpen(!actualIsOpen)}
          >
            <div className="shrink-0">
              {actualIsOpen ? <IconX className="w-6 h-6" /> : <IconMessageCircle className="w-6 h-6" />}
            </div>
          </Button>
          
          {/* Notification Badge */}
          {messages.length > 1 && (
            <Badge
              color="error"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center text-xs"
            >
              {messages.length - 1}
            </Badge>
          )}
        </div>
        </div>
      )}

      {/* Compact widget window */}
      {mode === 'widget' && actualIsOpen && (
        <div className={`fixed z-[60] ${position === 'left' ? 'left-6' : 'right-6'} bottom-24 w-[420px] max-w-[95vw] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900`}>
          {/* Header */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <IconRobot className="w-5 h-5" />
                </div>
                <Badge color="success" className="p-0 h-2.5 w-2.5 absolute -bottom-0.5 -right-0.5 border-2 border-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-4">AI Timetable Assistant</h3>
                <p className="text-[11px] opacity-90 leading-3">Online • Ready to help</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button color="light" size="xs" onClick={handleClose} className="text-white hover:bg-white/20 p-1.5">
                <IconX className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[360px] max-h-[70vh]">
            <SimpleBar className="h-full">
              <div className="p-3 space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.type === 'ai' && (
                      <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <IconRobot className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[240px] ${message.type === 'user' ? 'order-first' : ''}`}>
                      <div className={`px-3 py-2 rounded-xl ${message.type === 'user' ? 'bg-blue-500 text-white ml-auto' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-800'}`}>
                        <p className="text-xs whitespace-pre-line leading-relaxed">{message.content}</p>
                      </div>
                      <div className={`mt-1 text-[10px] text-gray-500 ${message.type === 'user' ? 'text-right' : ''}`}>
                        {message.type === 'user' ? 'You' : 'AI'} • {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </div>
                    </div>
                    {message.type === 'user' && (
                      <div className="w-7 h-7 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">U</span>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2 items-center text-sm text-gray-500">
                    <Spinner size="sm" /> <span>AI is thinking...</span>
                  </div>
                )}
              </div>
            </SimpleBar>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-800">
            <div className="relative flex items-center gap-2">
              <TextInput value={inputMessage} onChange={handleInputChange} onKeyPress={handleKeyPress} placeholder="Type your message..." className="flex-1" disabled={isLoading} />
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isLoading} color="primary" size="sm" className="p-2">
                <IconSend className="w-4 h-4" />
              </Button>
              {showMentionList && mentionResults.length > 0 && (
                <div className="absolute bottom-12 left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-2 z-10">
                  <div className="text-[11px] text-gray-500 mb-1 px-1">Mention to set context</div>
                  <ul className="max-h-40 overflow-y-auto">
                    {mentionResults.map(item => (
                      <li key={item.id}>
                        <button
                          type="button"
                          className="w-full text-left px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                          onClick={() => pickMention(item)}
                        >
                          <span className="font-medium text-sm">@{item.label}</span>
                          <span className="ml-2 text-[11px] opacity-60">{item.type}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Support Chat Drawer */}
      {mode === 'drawer' && (
      <Drawer 
        open={actualIsOpen} 
        onClose={handleClose}
        position={position}
        className="max-w-[420px] w-full bg-white dark:bg-gray-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <IconRobot className="w-7 h-7" />
              </div>
              <Badge
                color="success"
                className="p-0 h-3 w-3 absolute bottom-0 end-0 border-2 border-white"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold">AI Timetable Assistant</h3>
              <p className="text-sm opacity-90">Online • Always Ready to Help</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              color="light"
              size="sm"
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="text-white hover:bg-white/20 p-2"
            >
              <IconDotsVertical className="w-4 h-4" />
            </Button>
            <Button
              color="light"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-white/20 p-2"
            >
              {isMinimized ? <IconMaximize className="w-4 h-4" /> : <IconMinimize className="w-4 h-4" />}
            </Button>
            <Button
              color="light"
              size="sm"
              onClick={handleClose}
              className="text-white hover:bg-white/20 p-2"
            >
              <IconX className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Quick Actions Panel */}
            {showQuickActions && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      color="light"
                      size="sm"
                      onClick={() => handleQuickAction(action.action)}
                      className="flex items-center gap-2 text-xs p-2 h-auto"
                    >
                      <action.icon className="w-3 h-3" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <Button color="light" size="sm" className="flex items-center gap-2 text-xs">
                <IconPhone className="w-4 h-4" />
                Call
              </Button>
              <Button color="light" size="sm" className="flex items-center gap-2 text-xs">
                <IconVideo className="w-4 h-4" />
                Video
              </Button>
              <Button color="light" size="sm" className="flex items-center gap-2 text-xs">
                <IconSettings className="w-4 h-4" />
                Settings
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden">
              <SimpleBar className="max-h-[640px] h-[520px]">
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'ai' && (
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                          <IconRobot className="w-5 h-5 text-white" />
                        </div>
                      )}
                      
                      <div className={`max-w-[300px] ${message.type === 'user' ? 'order-first' : ''}`}>
                        {message.type === 'ai' && (
                          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                            <span className="font-medium">AI Assistant</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(message.timestamp, { addSuffix: true })}</span>
                          </div>
                        )}
                        
                        <div
                          className={`px-4 py-3 rounded-2xl shadow-sm ${
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white ml-auto'
                              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                          
                          {/* AI Reasoning Display */}
                          {message.type === 'ai' && message.metadata?.thoughts && message.metadata.thoughts.length > 0 && (
                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900/20 rounded-xl border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center gap-2 mb-2">
                                <IconMessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                                  AI Reasoning Process
                                </span>
                              </div>
                              <div className="space-y-2">
                                {message.metadata.thoughts.slice(0, 2).map((thought: any, index: number) => (
                                  <div key={index} className="text-xs text-blue-600 dark:text-blue-400">
                                    <span className="font-medium">Step {thought.step}:</span> {thought.thought}
                                    {thought.confidence && (
                                      <span className="ml-2 text-blue-500 font-medium">
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
                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900/20 rounded-xl border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center gap-2 mb-2">
                                <IconRobot className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                  Solution Exploration
                                </span>
                              </div>
                              <div className="text-xs text-gray-700 dark:text-gray-300">
                                {message.metadata.treeOfThought.content}
                                {message.metadata.treeOfThought.confidence && (
                                  <span className="ml-1 font-medium">
                                    ({Math.round(message.metadata.treeOfThought.confidence * 100)}%)
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {message.type === 'user' && (
                          <div className="text-xs text-gray-500 mt-1 text-right flex items-center justify-end gap-1">
                            <span className="font-medium">You</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(message.timestamp, { addSuffix: true })}</span>
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
                        <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                          <span className="text-sm font-bold text-white">U</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Streaming live tokens bubble */}
                  {isStreaming && streamingText && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <IconRobot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <div className="text-sm whitespace-pre-wrap">
                          {streamingText}
                          <span className="animate-pulse">▍</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <IconRobot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <Spinner size="sm" />
                          <span className="text-sm font-medium">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </SimpleBar>
            </div>

            <HR className="my-0" />

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-900">
              <div className="relative">
                <div className="flex items-center gap-2">
                  <Button color="light" size="sm" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <IconMoodSmile className="w-4 h-4" />
                  </Button>
                  <TextInput
                    value={inputMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message... (e.g., 'Schedule @CSE-A Data Structures')"
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <div className="flex gap-1">
                    <Button color="light" size="sm" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <IconPaperclip className="w-4 h-4" />
                    </Button>
                    <Button color="light" size="sm" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <IconPhoto className="w-4 h-4" />
                    </Button>
                    <Button color="light" size="sm" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <IconMicrophone className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      color="primary"
                      size="sm"
                      className="p-2 hover:bg-blue-600"
                    >
                      <IconSend className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {showMentionList && mentionResults.length > 0 && (
                  <div className="absolute bottom-12 left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-2 z-10">
                    <div className="text-xs text-gray-500 mb-2 px-1 font-medium">Mention to set context</div>
                    <ul className="max-h-40 overflow-y-auto">
                      {mentionResults.map(item => (
                        <li key={item.id}>
                          <button
                            type="button"
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                            onClick={() => pickMention(item)}
                          >
                            <span className="font-medium text-sm">@{item.label}</span>
                            <span className="ml-2 text-xs opacity-60 capitalize">{item.type}</span>
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
    </>
  );
};

const EnhancedSupportChatbot: React.FC<EnhancedSupportChatbotProps> = (props) => {
  return (
    <AIModificationsProvider>
      <EnhancedSupportChatbotContent {...props} />
    </AIModificationsProvider>
  );
};

export default EnhancedSupportChatbot;
