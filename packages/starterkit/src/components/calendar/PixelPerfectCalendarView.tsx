import React from 'react';

// Import the generated assets
const imgMask = "/src/assets/images/d11a9ee71dba1b0929f6220cff364ed0f0f93a33.svg";
const imgIconPlus = "/src/assets/images/691596025dc0e90bcfd04843d959e7e310bf085c.svg";
const imgGridList = "/src/assets/images/39c2ee5318f1187b43c6995691ec634c4767efa3.svg";
const imgArrow = "/src/assets/images/4af133a921b0d7345e1569b76b94f2644f77526b.svg";
const imgIconFilter = "/src/assets/images/7299a35240cda16cefc4e6b43cd501a921983f94.svg";
const imgArrow1 = "/src/assets/images/c6f33928fe226c9de00656d2e7cd5866fd32d554.svg";

export const PixelPerfectCalendarView: React.FC = () => {
  const events = [
    {
      id: '1',
      title: 'Go to clinic for checkup',
      time: '10:20 AM - 12:30 PM',
      backgroundColor: '#EAF1FF',
      day: 'Monday, 4',
      timeSlot: '10 AM',
      users: 1,
      position: { x: 449, y: 584 },
      size: { width: 176, height: 290 }
    },
    {
      id: '2',
      title: 'Meeting with Team',
      time: '7:45 - 9 AM',
      backgroundColor: '#F1EAFC',
      day: 'Tuesday, 5',
      timeSlot: '8 AM',
      users: 9,
      position: { x: 642, y: 281 },
      size: { width: 176, height: 160 }
    },
    {
      id: '3',
      title: 'Book Discussion',
      time: '9:30 - 10:30 AM',
      backgroundColor: '#DCF8E1',
      day: 'Tuesday, 5',
      timeSlot: '9 AM',
      users: 2,
      position: { x: 642, y: 504 },
      size: { width: 176, height: 124 }
    },
    {
      id: '4',
      title: 'Restore Inner Power',
      time: '12 - 3 PM',
      backgroundColor: '#FFD5DD',
      day: 'Wednesday, 6',
      timeSlot: '12 PM',
      users: 1,
      position: { x: 836, y: 814 },
      size: { width: 176, height: 346 }
    },
    {
      id: '5',
      title: 'Brief for reference, color, style',
      time: '10 - 12 PM',
      backgroundColor: '#FFE9CB',
      day: 'Thursday, 7',
      timeSlot: '10 AM',
      users: 5,
      position: { x: 1029, y: 572 },
      size: { width: 176, height: 225 }
    },
    {
      id: '6',
      title: 'Breakfast at Oka\'s House',
      time: '8 - 19:45 PM',
      backgroundColor: '#DEF4FE',
      day: 'Friday, 8',
      timeSlot: '8 AM',
      users: 1,
      position: { x: 1222, y: 350 },
      size: { width: 176, height: 180 }
    }
  ];

  const timeSlots = [
    '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM'
  ];

  const days = [
    'Monday, 4', 'Tuesday, 5', 'Wednesday, 6', 'Thursday, 7', 'Friday, 8', 'Saturday, 9'
  ];

  return (
    <div className="bg-white relative w-full h-full overflow-hidden">
      {/* Calendar Container */}
      <div className="absolute left-80 top-[171px] w-[1280px] h-[1080px]">
        {/* Grid Lines */}
        <div className="absolute left-[440px] top-[171px] w-[1160px] h-[1080px]">
          {/* Vertical Lines */}
          <div className="absolute bg-[#efeff4] h-[1080px] left-[1406px] top-0 w-px" />
          <div className="absolute bg-[#efeff4] h-[1080px] left-[1213px] top-0 w-px" />
          <div className="absolute bg-[#efeff4] h-[1080px] left-[1020px] top-0 w-px" />
          <div className="absolute bg-[#efeff4] h-[1080px] left-[826px] top-0 w-px" />
          <div className="absolute bg-[#efeff4] h-[1080px] left-[633px] top-0 w-px" />
          <div className="absolute bg-[#efeff4] h-[1080px] left-[440px] top-0 w-px" />
          
          {/* Horizontal Lines */}
          <div className="absolute bg-[#efeff4] h-px left-0 top-[1168px] w-[1160px]" />
          <div className="absolute bg-[#efeff4] h-px left-0 top-[1047px] w-[1160px]" />
          <div className="absolute bg-[#efeff4] h-px left-0 top-[926px] w-[1160px]" />
          <div className="absolute bg-[#efeff4] h-px left-0 top-[805px] w-[1160px]" />
          <div className="absolute bg-[#efeff4] h-px left-0 top-[684px] w-[1160px]" />
          <div className="absolute bg-[#efeff4] h-px left-0 top-[563px] w-[1160px]" />
          <div className="absolute bg-[#efeff4] h-px left-0 top-[442px] w-[1160px]" />
          <div className="absolute bg-[#efeff4] h-px left-0 top-[321px] w-[1160px]" />
        </div>

        {/* Time Labels */}
        <div className="absolute left-[357px] top-[311px] w-[42px] h-[868px]">
          {timeSlots.map((time, index) => (
            <div
              key={index}
              className="absolute font-['Poppins:Regular',_sans-serif] text-[#8a8a8f] text-[15px] text-right"
              style={{
                top: `${index * 121}px`,
                left: '7px',
                width: '35px',
                height: '23px'
              }}
            >
              {time}
            </div>
          ))}
        </div>

        {/* Day Headers */}
        <div className="absolute left-0 top-0 w-[1280px] h-10 bg-white shadow-[0px_1px_0px_0px_#efeff4]">
          <div className="absolute bg-[#1d62f0] bottom-0 left-[314px] w-[192px] h-0.5" />
          
          {/* All Day */}
          <div className="absolute font-['Poppins:Regular',_sans-serif] text-[#8a8a8f] text-[15px] left-[35px] top-[10px] w-[51px] h-[23px]">
            All Day
          </div>
          
          {/* Days */}
          {days.map((day, index) => (
            <div
              key={index}
              className={`absolute font-['Poppins:Regular',_sans-serif] text-[15px] text-center ${
                day === 'Tuesday, 5' ? 'text-[#1d62f0]' : 'text-[#666666]'
              }`}
              style={{
                left: `${178 + index * 193}px`,
                top: '10px',
                width: '80px',
                height: '23px'
              }}
            >
              {day === 'Tuesday, 5' && (
                <div className="absolute w-2 h-2 bg-[#1d62f0] rounded-full -left-3 top-1" />
              )}
              {day}
            </div>
          ))}
        </div>

        {/* Events */}
        {events.map((event) => (
          <div
            key={event.id}
            className="absolute rounded-[20px] p-4"
            style={{
              left: `${event.position.x - 320}px`,
              top: `${event.position.y - 171}px`,
              width: `${event.size.width}px`,
              height: `${event.size.height}px`,
              backgroundColor: event.backgroundColor
            }}
          >
            <div className="font-['Poppins:Regular',_sans-serif] text-[15px] text-black mb-2">
              {event.title}
            </div>
            <div className="font-['Poppins:Regular',_sans-serif] text-[#666666] text-[13px] mb-4">
              {event.time}
            </div>
            
            {/* User Avatars */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#C8C7CC] rounded-full flex items-center justify-center">
                <img src={imgMask} alt="User" className="w-full h-full rounded-full" />
              </div>
              {event.users > 1 && (
                <div className="w-8 h-8 bg-white border border-[#EFEFF4] rounded-full flex items-center justify-center">
                  <span className="text-[#8A8A8F] text-[14px]">+{event.users - 1}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Bar */}
      <div className="absolute left-80 top-[98px] w-[1280px] h-[73px] bg-white shadow-[0px_1px_0px_0px_#efeff4]">
        {/* October 2027 */}
        <div className="absolute font-['Poppins:Medium',_sans-serif] text-[24px] text-black left-6 top-[20px] w-[161px] h-[36px]">
          October 2027
        </div>

        {/* Today Button */}
        <div className="absolute left-[209px] top-[17px] w-[80px] h-10 bg-[#f9f9f9] border border-[#efeff4] rounded-[20px] flex items-center justify-center">
          <span className="font-['Poppins:Regular',_sans-serif] text-[15px] text-black">Today</span>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute left-[297px] top-[21px] w-8 h-8 bg-[#f9f9f9] border border-[#efeff4] rounded-full flex items-center justify-center">
          <img src={imgArrow1} alt="Previous" className="w-3 h-2" />
        </div>
        <div className="absolute left-[337px] top-[21px] w-8 h-8 bg-[#f9f9f9] border border-[#efeff4] rounded-full flex items-center justify-center">
          <img src={imgArrow1} alt="Next" className="w-3 h-2 rotate-180" />
        </div>

        {/* View Tabs */}
        <div className="absolute left-[533px] top-[17px] w-[215px] h-10 bg-[#f9f9f9] border border-[#efeff4] rounded-[25px]">
          <div className="absolute bg-[#1d62f0] left-0 top-0 w-[62px] h-10 rounded-[25px]" />
          <div className="absolute font-['Poppins:Medium',_sans-serif] text-[15px] text-white left-4 top-[10px] w-[30px] h-[23px]">
            Day
          </div>
          <div className="absolute font-['Poppins:Regular',_sans-serif] text-[#8a8a8f] text-[15px] left-[78px] top-[10px] w-[41px] h-[23px]">
            Week
          </div>
          <div className="absolute font-['Poppins:Regular',_sans-serif] text-[#8a8a8f] text-[15px] left-[151px] top-[10px] w-[48px] h-[23px]">
            Month
          </div>
        </div>

        {/* Filter Button */}
        <div className="absolute left-[842px] top-[17px] w-[140px] h-10 bg-[#f9f9f9] border border-[#efeff4] rounded-[20px] flex items-center justify-center gap-2">
          <img src={imgIconFilter} alt="Filter" className="w-5 h-[18px]" />
          <span className="font-['Poppins:Regular',_sans-serif] text-[15px] text-black">Filter</span>
          <img src={imgArrow} alt="Arrow" className="w-3 h-2" />
        </div>

        {/* Grid/List Toggle */}
        <div className="absolute left-[998px] top-[17px] w-[86px] h-10">
          <img src={imgGridList} alt="Grid List" className="w-full h-full" />
        </div>

        {/* Add Schedule Button */}
        <div className="absolute left-[1100px] top-[17px] w-[156px] h-10 bg-[#1d62f0] rounded-[20px] flex items-center justify-center gap-2">
          <img src={imgIconPlus} alt="Plus" className="w-3 h-3" />
          <span className="font-['Poppins:Regular',_sans-serif] text-[15px] text-white">Add Schedule</span>
        </div>
      </div>
    </div>
  );
};
