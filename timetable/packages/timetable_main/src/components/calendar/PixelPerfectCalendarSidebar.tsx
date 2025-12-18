import React from 'react';

// Import the generated assets
const imgDot = "/src/assets/images/470913b42a8a779c9e713e36055bd6be6e9f7db9.svg";
const imgDot2 = "/src/assets/images/2e8151058b2313905ffe09ac1bad93fec1dfc753.svg";
const imgDot3 = "/src/assets/images/bcea9d2e105910a063f9390be64755995ed6197b.svg";
const imgIconPlus1 = "/src/assets/images/3bcb80164bd355730dd1f823f4669e2a2273af84.svg";
const imgArrow = "/src/assets/images/4af133a921b0d7345e1569b76b94f2644f77526b.svg";
const imgIconCheck = "/src/assets/images/f6f87def6a94d5858034be621b3f35b3ebf0d6f6.svg";
const imgIconCheck1 = "/src/assets/images/5cfc8cad4a5d1fcb3dbfb90f7892c0dd934a0bf9.svg";
const imgSelected = "/src/assets/images/14fa7481e1bcfce94ca0a3c43bbeb71a1ccb2c75.svg";
const imgArrow2 = "/src/assets/images/d0b06f9c86d5cbd1042487a63cc7847798d1ed22.svg";
const imgIcon = "/src/assets/images/72c482b89ad0ff5943203a1858df79c760db218a.svg";

export const PixelPerfectCalendarSidebar: React.FC = () => {
  const calendarDays = [
    ['26', '27', '28', '29', '30', '1', '2'],
    ['3', '4', '5', '6', '7', '8', '9'],
    ['10', '11', '12', '13', '14', '15', '16'],
    ['17', '18', '19', '20', '21', '22', '23'],
    ['24', '25', '26', '27', '28', '29', '30']
  ];

  const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="absolute left-0 top-0 w-80 h-[1251px] bg-[#f9f9f9] shadow-[1px_0px_0px_0px_#efeff4]">
      {/* Logo */}
      <div className="absolute left-6 top-6 w-[152px] h-10 flex items-center gap-4">
        <div className="w-10 h-10">
          <img src={imgIcon} alt="Calendar Icon" className="w-full h-full" />
        </div>
        <div className="font-['Poppins:SemiBold',_sans-serif] text-[20px] text-black">
          Calendar
        </div>
      </div>

      {/* Mini Calendar */}
      <div className="absolute left-6 top-[104px] w-[272px] h-[272px]">
        {/* Month Header */}
        <div className="absolute left-0 top-0 w-[272px] h-8 flex items-center justify-between">
          <div className="w-8 h-8">
            <img src={imgArrow2} alt="Previous" className="w-full h-full" />
          </div>
          <div className="font-['Poppins:Medium',_sans-serif] text-[17px] text-black">
            October 2027
          </div>
          <div className="w-8 h-8">
            <img src={imgArrow2} alt="Next" className="w-full h-full rotate-180" />
          </div>
        </div>

        {/* Day Headers */}
        <div className="absolute left-0 top-[40px] w-[272px] h-4 flex justify-between">
          {dayHeaders.map((day, index) => (
            <div
              key={index}
              className={`font-['Poppins:Regular',_sans-serif] text-[10px] text-center ${
                index === 0 || index === 6 ? 'text-[#8a8a8f]' : 'text-black'
              }`}
              style={{ width: '16px' }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="absolute left-0 top-[56px] w-[272px] h-[159px]">
          {calendarDays.map((week, weekIndex) =>
            week.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className="absolute font-['Poppins:Regular',_sans-serif] text-[13px] text-center"
                style={{
                  left: `${dayIndex * 38.86}px`,
                  top: `${weekIndex * 31.8}px`,
                  width: '16px',
                  height: '20px',
                  color: day === '5' ? 'white' : day === '26' || day === '27' || day === '28' || day === '29' || day === '30' ? '#c8c7cc' : 'black'
                }}
              >
                {day === '5' && (
                  <div className="absolute w-6 h-6 bg-[#1d62f0] rounded-full -left-1 -top-1 flex items-center justify-center">
                    <img src={imgSelected} alt="Selected" className="w-full h-full" />
                  </div>
                )}
                {day}
              </div>
            ))
          )}
        </div>

        {/* Divider */}
        <div className="absolute bg-[#c8c7cc] h-px left-0 top-[271px] w-[272px] opacity-40" />
      </div>

      {/* My Calendars */}
      <div className="absolute left-6 top-[400px] w-[272px] h-[245px]">
        <div className="flex items-center justify-between mb-6">
          <div className="font-['Poppins:Medium',_sans-serif] text-[#666666] text-[17px]">
            My Calendars
          </div>
          <div className="w-3 h-2">
            <img src={imgArrow} alt="Arrow" className="w-full h-full" />
          </div>
        </div>

        <div className="space-y-3">
          {[
            { name: 'My Schedules', checked: true },
            { name: 'Task and Events', checked: true },
            { name: 'Projects', checked: false },
            { name: 'Holidays', checked: false }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-5 h-5">
                <img 
                  src={item.checked ? imgIconCheck1 : imgIconCheck} 
                  alt={item.checked ? 'Checked' : 'Unchecked'} 
                  className="w-full h-full" 
                />
              </div>
              <div className="font-['Poppins:Regular',_sans-serif] text-[15px] text-black">
                {item.name}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-[10px] left-0 w-[109px] h-6 bg-[#f9f9f9] border border-[#d8d8d8] rounded-[25px] flex items-center justify-center gap-2">
          <div className="w-3 h-3">
            <img src={imgIconPlus1} alt="Plus" className="w-full h-full" />
          </div>
          <span className="font-['Poppins:Medium',_sans-serif] text-[#8a8a8f] text-[14px]">Add New</span>
        </div>

        {/* Divider */}
        <div className="absolute bg-[#c8c7cc] h-px left-0 top-[244px] w-[272px] opacity-40" />
      </div>

      {/* Others */}
      <div className="absolute left-6 top-[669px] w-[272px] h-[208px]">
        <div className="flex items-center justify-between mb-6">
          <div className="font-['Poppins:Medium',_sans-serif] text-[#666666] text-[17px]">
            Others
          </div>
          <div className="w-3 h-2">
            <img src={imgArrow} alt="Arrow" className="w-full h-full" />
          </div>
        </div>

        <div className="space-y-3">
          {[
            { name: 'Birthday', checked: true },
            { name: 'Fitness', checked: false },
            { name: 'Camping', checked: false }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-5 h-5">
                <img 
                  src={item.checked ? imgIconCheck1 : imgIconCheck} 
                  alt={item.checked ? 'Checked' : 'Unchecked'} 
                  className="w-full h-full" 
                />
              </div>
              <div className="font-['Poppins:Regular',_sans-serif] text-[15px] text-black">
                {item.name}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-[12px] left-0 w-[109px] h-6 bg-[#f9f9f9] border border-[#d8d8d8] rounded-[25px] flex items-center justify-center gap-2">
          <div className="w-3 h-3">
            <img src={imgIconPlus1} alt="Plus" className="w-full h-full" />
          </div>
          <span className="font-['Poppins:Medium',_sans-serif] text-[#8a8a8f] text-[14px]">Add New</span>
        </div>

        {/* Divider */}
        <div className="absolute bg-[#c8c7cc] h-px left-0 top-[207px] w-[272px] opacity-40" />
      </div>

      {/* Categories */}
      <div className="absolute left-6 top-[901px] w-[272px] h-[208px]">
        <div className="flex items-center justify-between mb-6">
          <div className="font-['Poppins:Medium',_sans-serif] text-[#666666] text-[17px]">
            Categories
          </div>
          <div className="w-3 h-2">
            <img src={imgArrow} alt="Arrow" className="w-full h-full" />
          </div>
        </div>

        <div className="space-y-3">
          {[
            { name: 'Work', color: '#1d62f0', dot: imgDot },
            { name: 'Education', color: '#a644ff', dot: imgDot3 },
            { name: 'Personal', color: '#ff9500', dot: imgDot2 }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-2 h-2">
                <img src={item.dot} alt="Dot" className="w-full h-full" />
              </div>
              <div 
                className="font-['Poppins:Regular',_sans-serif] text-[15px]"
                style={{ color: item.color }}
              >
                {item.name}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-[12px] left-0 w-[109px] h-6 bg-[#f9f9f9] border border-[#d8d8d8] rounded-[25px] flex items-center justify-center gap-2">
          <div className="w-3 h-3">
            <img src={imgIconPlus1} alt="Plus" className="w-full h-full" />
          </div>
          <span className="font-['Poppins:Medium',_sans-serif] text-[#8a8a8f] text-[14px]">Add New</span>
        </div>

        {/* Divider */}
        <div className="absolute bg-[#c8c7cc] h-px left-0 top-[207px] w-[272px] opacity-40" />
      </div>
    </div>
  );
};
