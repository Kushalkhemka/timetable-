import React, { useState } from 'react';
import EnhancedSupportChatbot from '../shared/EnhancedSupportChatbot';
import { IconMessageCircle, IconX } from '@tabler/icons-react';

// Import the generated assets
const imgMask1 = "/src/assets/images/97fc5c01e7d688967023f61b8cdb2ee01adff2bb.svg";
const imgIconNotification = "/src/assets/images/5dc3cb5090138c4d26fb598dfba4d9ec5bb0354f.svg";
const imgDot1 = "/src/assets/images/cf86a647fed3cea77b37280f69b77852fa0b018f.svg";
const imgIconMoon = "/src/assets/images/eaa3e953d37727f26dcea5f161ce61400aa86731.svg";
const imgIconSun = "/src/assets/images/7ea694f6095409d47577af819762f0efbba56c29.svg";
const imgIconSearch = "/src/assets/images/2870d8cf0ba5d834d684cbc8ca20f87c8c241d56.svg";

export const PixelPerfectTopBar: React.FC = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <div className="absolute left-80 top-0 w-[1600px] h-[98px] bg-[#f9f9f9] shadow-[0px_1px_0px_0px_#efeff4]">
      {/* Search Bar */}
      <div className="absolute left-[344px] top-6 w-[340px] h-[50px] bg-white border border-[#efeff4] rounded-[25px] flex items-center gap-3 px-4">
        <div className="w-4 h-4">
          <img src={imgIconSearch} alt="Search" className="w-full h-full" />
        </div>
        <span className="font-['Poppins:Regular',_sans-serif] text-[#8a8a8f] text-[15px]">
          Search
        </span>
      </div>

      {/* Theme Switch */}
      <div className="absolute left-[1606px] top-[25px] w-[92px] h-[50px] bg-white border border-[#efeff4] rounded-[30px] flex items-center justify-between px-1">
        <div className="w-[42px] h-[42px] bg-[#1d62f0] rounded-full flex items-center justify-center">
          <div className="w-5 h-5">
            <img src={imgIconSun} alt="Sun" className="w-full h-full" />
          </div>
        </div>
        <div className="w-5 h-5">
          <img src={imgIconMoon} alt="Moon" className="w-full h-full" />
        </div>
      </div>

      {/* Notification Icon */}
      <div className="absolute left-[1714px] top-6 w-[50px] h-[50px] bg-white border border-[#efeff4] rounded-full flex items-center justify-center relative">
        <div className="w-4 h-5">
          <img src={imgIconNotification} alt="Notification" className="w-full h-full" />
        </div>
        <div className="absolute w-2 h-2 bg-[#ff3b30] rounded-full top-3 right-3">
          <img src={imgDot1} alt="Dot" className="w-full h-full" />
        </div>
      </div>

      {/* AI Chatbot Button - Replacing Settings Icon */}
      <div 
        className="absolute left-[1780px] top-6 w-[50px] h-[50px] bg-white border border-[#efeff4] rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors duration-200"
        onClick={() => setIsChatbotOpen(!isChatbotOpen)}
      >
        {isChatbotOpen ? (
          <IconX className="w-5 h-5 text-blue-600" />
        ) : (
          <IconMessageCircle className="w-5 h-5 text-blue-600" />
        )}
      </div>

      {/* User Profile */}
      <div className="absolute left-[1846px] top-6 w-[50px] h-[50px] bg-white border border-[#efeff4] rounded-full flex items-center justify-center relative">
        <div className="w-full h-full">
          <img src={imgMask1} alt="User" className="w-full h-full rounded-full" />
        </div>
        <div className="absolute font-['Poppins:SemiBold',_sans-serif] text-[#8a8a8f] text-[10px] text-center">
          50 x 50
        </div>
      </div>
      
      {/* AI Chatbot Component */}
      <EnhancedSupportChatbot 
        position="right" 
        mode="widget"
        externalControl={{
          isOpen: isChatbotOpen,
          setIsOpen: setIsChatbotOpen
        }}
      />
    </div>
  );
};
