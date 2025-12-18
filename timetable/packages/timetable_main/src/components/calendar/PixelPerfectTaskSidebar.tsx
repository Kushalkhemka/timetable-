import React from 'react';

// Import the generated assets
const imgIconCheck = "/src/assets/images/f6f87def6a94d5858034be621b3f35b3ebf0d6f6.svg";
const imgIconCheck1 = "/src/assets/images/5cfc8cad4a5d1fcb3dbfb90f7892c0dd934a0bf9.svg";
const imgIconPlus1 = "/src/assets/images/3bcb80164bd355730dd1f823f4669e2a2273af84.svg";
const imgButtonMore = "/src/assets/images/8e5926b140bdead14f00d2fa61d9b1e882e3455a.svg";
const imgButtonAdd = "/src/assets/images/44ab9964e3930fa6e60ce14948ac1eb3dda2c28c.svg";

export const PixelPerfectTaskSidebar: React.FC = () => {
  const taskLists = [
    {
      title: 'Office',
      progress: '1/4',
      tasks: [
        { name: 'Meeting with Clients', completed: true },
        { name: 'Create an adaptive UI', completed: false },
        { name: 'Design & wireframe for iOS', completed: false },
        { name: 'Meeting with My Team', completed: false }
      ]
    },
    {
      title: 'My Perfect Day',
      progress: '2/6',
      tasks: [
        { name: 'Buy lamp for lovely Grandpa', completed: true },
        { name: 'Go to Jolly\'s Mart', completed: false },
        { name: 'Pick burger at Mama Bear Cafe', completed: true },
        { name: 'Order Pizza for big fams', completed: false },
        { name: 'Pick wife for shopping', completed: false },
        { name: 'Go to clinic for checkup', completed: false }
      ]
    },
    {
      title: 'Life Has a Story',
      progress: '3/5',
      tasks: [
        { name: 'Breakfast at Tom\'s House', completed: true },
        { name: 'Cycling Through The Valley', completed: true },
        { name: 'Buying Household Necessities', completed: true },
        { name: 'Meeting with Andy', completed: false },
        { name: 'Taking Angel to Piano Lessons', completed: false }
      ]
    }
  ];

  return (
    <div className="absolute left-[1600px] top-[98px] w-80 h-[1153px] bg-[#f9f9f9] shadow-[-1px_0px_0px_0px_#efeff4]">
      {/* Title */}
      <div className="absolute left-6 top-[122px] w-[272px] h-[50px]">
        <div className="flex items-center justify-between">
          <div className="font-['Poppins:Medium',_sans-serif] text-[24px] text-black">
            My Tasks
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8">
              <img src={imgButtonAdd} alt="Add" className="w-full h-full" />
            </div>
            <div className="w-8 h-8">
              <img src={imgButtonMore} alt="More" className="w-full h-full" />
            </div>
          </div>
        </div>
        <div className="absolute bg-[#c8c7cc] h-px left-0 top-[49px] w-[272px] opacity-40" />
      </div>

      {/* Task Lists */}
      {taskLists.map((list, listIndex) => (
        <div
          key={listIndex}
          className="absolute left-6 w-[272px]"
          style={{
            top: `${196 + listIndex * 269}px`,
            height: listIndex === 2 ? '282px' : listIndex === 1 ? '319px' : '245px'
          }}
        >
          {/* List Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="font-['Poppins:Medium',_sans-serif] text-[#666666] text-[17px]">
              {list.title}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[43px] h-6 bg-[#f9f9f9] border border-[#efeff4] rounded-[12px] flex items-center justify-center">
                <span className="font-['Poppins:Medium',_sans-serif] text-[#8a8a8f] text-[13px]">
                  {list.progress}
                </span>
              </div>
              <div className="w-8 h-8">
                <img src={imgButtonMore} alt="More" className="w-full h-full" />
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-3 mb-6">
            {list.tasks.map((task, taskIndex) => (
              <div key={taskIndex} className="flex items-center gap-3">
                <div className="w-5 h-5">
                  <img 
                    src={task.completed ? imgIconCheck1 : imgIconCheck} 
                    alt={task.completed ? 'Checked' : 'Unchecked'} 
                    className="w-full h-full" 
                  />
                </div>
                <div 
                  className={`font-['Poppins:Regular',_sans-serif] text-[15px] text-black ${
                    task.completed ? 'line-through' : ''
                  }`}
                >
                  {task.name}
                </div>
              </div>
            ))}
          </div>

          {/* Add Task Button */}
          <div className="absolute bottom-[10px] left-0 w-[112px] h-6 bg-[#f9f9f9] border border-[#efeff4] rounded-[25px] flex items-center justify-center gap-2">
            <div className="w-3 h-3">
              <img src={imgIconPlus1} alt="Plus" className="w-full h-full" />
            </div>
            <span className="font-['Poppins:Medium',_sans-serif] text-[#8a8a8f] text-[14px]">Add Task</span>
          </div>

          {/* Divider */}
          <div className="absolute bg-[#c8c7cc] h-px left-0 bottom-0 w-[272px] opacity-40" />
        </div>
      ))}
    </div>
  );
};
