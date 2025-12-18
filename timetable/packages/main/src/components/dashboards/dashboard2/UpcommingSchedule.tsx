import { Dropdown, DropdownItem } from 'flowbite-react';
import { useState } from 'react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import CardBox from 'src/components/shared/CardBox';
import SimpleBar from 'simplebar-react';
import { IconClock } from '@tabler/icons-react';
import user1 from '/src/assets/images/profile/user-2.jpg';
import user2 from '/src/assets/images/profile/user-3.jpg';
import user3 from '/src/assets/images/profile/user-4.jpg';
import user4 from '/src/assets/images/profile/user-5.jpg';

const UpcommingSchedule = () => {
  const dropdownItems = ['Action', 'Another action', 'Something else'];
  // Custom Tab
  const [activeTab, setActiveTab] = useState('1 To 3');
  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  const userImg = [
    {
      user: user1,
    },
    {
      user: user2,
    },
    {
      user: user3,
    },
    {
      user: user4,
    },
  ];
  return (
    <div>
      <CardBox>
        <div className="flex justify-between align-baseline">
          <h5 className="card-title">Upcoming Scheduls</h5>
          <div>
            <Dropdown
              label=""
              dismissOnClick={false}
              renderTrigger={() => (
                <span className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-lightprimary hover:text-primary cursor-pointer">
                  <HiOutlineDotsVertical size={22} />
                </span>
              )}
            >
              {dropdownItems.map((items, index) => {
                return <DropdownItem key={index}>{items}</DropdownItem>;
              })}
            </Dropdown>
          </div>
        </div>

        <div className="flex flex-wrap mt-3 rounded-full justify-between shadow-md">
          <div
            onClick={() => handleTabClick('1 To 3')}
            className={`py-2 px-4 rounded-full  cursor-pointer text-ld  text-base font-semibold text-center  ${
              activeTab == '1 To 3' ? ' bg-primary text-white ' : 'dark:text-white '
            }`}
          >
            1 To 3
          </div>
          <div
            onClick={() => handleTabClick('4 To 7')}
            className={`py-2 px-4 rounded-full  cursor-pointer text-ld text-base font-semibold text-center  ${
              activeTab == '4 To 7' ? ' bg-primary text-white' : 'dark:text-white  '
            }`}
          >
            4 To 7
          </div>
          <div
            onClick={() => handleTabClick('8 To 10')}
            className={`py-2 px-4 rounded-full  cursor-pointer text-ld text-base font-semibold text-center  ${
              activeTab == '8 To 10' ? ' bg-primary text-white' : 'dark:text-white  '
            }`}
          >
            8 To 10
          </div>
        </div>

        {activeTab === '1 To 3' && (
          <SimpleBar className="max-h-[350px]">
            <div className="grid grid-cols-12 gap-6 mt-6">
              <div className="md:col-span-2 col-span-3">
                <ul className="flex flex-col gap-6">
                  <li className="text-sm font-medium">8:00</li>
                  <li className="text-sm font-medium">8:30</li>
                  <li className="text-sm font-medium">9:00</li>
                  <li className="text-sm font-medium">9:30</li>
                  <li className="text-sm font-medium">10:00</li>
                  <li className="text-sm font-medium">10:30</li>
                  <li className="text-sm font-medium">11:00</li>
                  <li className="text-sm font-medium">11:30</li>
                  <li className="text-sm font-medium">12:00</li>
                  <li className="text-sm font-medium">12:30</li>
                  <li className="text-sm font-medium">13:00</li>
                  <li className="text-sm font-medium">13:30</li>
                </ul>
              </div>
              <div className="md:col-span-10 col-span-9">
                <div className="mt-8">
                  <div className="rounded-sm shadow-sm p-4 border-s-5 border-indigo">
                    <h6 className="text-base">Marketing Meeting</h6>
                    <div className="flex items-center gap-1">
                      <IconClock size={15} />
                      08:30 - 10:00
                    </div>
                    <div className="flex mt-6  ms-2">
                      {userImg.map((item, index) => (
                        <div className="-ms-2  h-8 w-8" key={index}>
                          <img
                            src={item.user}
                            className=" border-white dark:border-darkborder rounded-full"
                            alt="icon"
                          />
                        </div>
                      ))}
                      <div className="">
                        <div className="bg-lightinfo text-info text-xs  border-white dark:border-darkborder  h-8 w-8 flex justify-center items-center  rounded-full dark:bg-lightinfo">
                          +18
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="rounded-sm shadow-sm p-4 border-s-5 border-success">
                    <h6 className="text-base">Applied mathematics</h6>
                    <div className="flex items-center gap-1">
                      <IconClock size={15} />
                      10:15 - 11:45
                    </div>
                    <div className="flex mt-8  ms-2">
                      {userImg.map((item, index) => (
                        <div className="-ms-2  h-8 w-8" key={index}>
                          <img
                            src={item.user}
                            className=" border-white dark:border-darkborder rounded-full"
                            alt="icon"
                          />
                        </div>
                      ))}
                      <div className="">
                        <div className="bg-lightinfo text-info text-xs  border-white dark:border-darkborder  h-8 w-8 flex justify-center items-center  rounded-full dark:bg-lightinfo">
                          +18
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="rounded-sm shadow-sm p-4 border-s-5 border-error">
                    <h6 className="text-base">SEO Session with Team</h6>
                    <div className="flex items-center gap-1">
                      <IconClock size={15} />
                      12:00 - 13:25
                    </div>
                    <div className="flex mt-8  ms-2">
                      {userImg.map((item, index) => (
                        <div className="-ms-2  h-8 w-8" key={index}>
                          <img
                            src={item.user}
                            className=" border-white dark:border-darkborder rounded-full"
                            alt="icon"
                          />
                        </div>
                      ))}
                      <div className="">
                        <div className="bg-lightinfo text-info text-xs  border-white dark:border-darkborder  h-8 w-8 flex justify-center items-center  rounded-full dark:bg-lightinfo">
                          +18
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SimpleBar>
        )}
        {activeTab === '4 To 7' && 
        
        (
          <SimpleBar className="max-h-[350px]">
            <div className="grid grid-cols-12 gap-6 mt-6">
              <div className="md:col-span-2 col-span-3">
                <ul className="flex flex-col gap-6">
                  <li className="text-sm font-medium">8:00</li>
                  <li className="text-sm font-medium">8:30</li>
                  <li className="text-sm font-medium">9:00</li>
                  <li className="text-sm font-medium">9:30</li>
                  <li className="text-sm font-medium">10:00</li>
                  <li className="text-sm font-medium">10:30</li>
                  <li className="text-sm font-medium">11:00</li>
                  <li className="text-sm font-medium">11:30</li>
                  <li className="text-sm font-medium">12:00</li>
                  <li className="text-sm font-medium">12:30</li>
                  <li className="text-sm font-medium">13:00</li>
                  <li className="text-sm font-medium">13:30</li>
                </ul>
              </div>
              <div className="md:col-span-10 col-span-9">
                <div className="mt-8">
                  <div className="rounded-sm shadow-sm p-4 border-s-5 border-info">
                    <h6 className="text-base">Marketing Meeting</h6>
                    <div className="flex items-center gap-1">
                      <IconClock size={15} />
                      08:30 - 10:00
                    </div>
                    <div className="flex mt-6  ms-2">
                      {userImg.map((item, index) => (
                        <div className="-ms-2  h-8 w-8" key={index}>
                          <img
                            src={item.user}
                            className=" border-white dark:border-darkborder rounded-full"
                            alt="icon"
                          />
                        </div>
                      ))}
                      <div className="">
                        <div className="bg-lightinfo text-info text-xs  border-white dark:border-darkborder  h-8 w-8 flex justify-center items-center  rounded-full dark:bg-lightinfo">
                          +18
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="rounded-sm shadow-sm p-4 border-s-5 border-warning">
                    <h6 className="text-base">Applied mathematics</h6>
                    <div className="flex items-center gap-1">
                      <IconClock size={15} />
                      10:15 - 11:45
                    </div>
                    <div className="flex mt-8  ms-2">
                      {userImg.map((item, index) => (
                        <div className="-ms-2  h-8 w-8" key={index}>
                          <img
                            src={item.user}
                            className=" border-white dark:border-darkborder rounded-full"
                            alt="icon"
                          />
                        </div>
                      ))}
                      <div className="">
                        <div className="bg-lightinfo text-info text-xs  border-white dark:border-darkborder  h-8 w-8 flex justify-center items-center  rounded-full dark:bg-lightinfo">
                          +18
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="rounded-sm shadow-sm p-4 border-s-5 border-primary">
                    <h6 className="text-base">SEO Session with Team</h6>
                    <div className="flex items-center gap-1">
                      <IconClock size={15} />
                      12:00 - 13:25
                    </div>
                    <div className="flex mt-8  ms-2">
                      {userImg.map((item, index) => (
                        <div className="-ms-2  h-8 w-8" key={index}>
                          <img
                            src={item.user}
                            className=" border-white dark:border-darkborder rounded-full"
                            alt="icon"
                          />
                        </div>
                      ))}
                      <div className="">
                        <div className="bg-lightinfo text-info text-xs  border-white dark:border-darkborder  h-8 w-8 flex justify-center items-center  rounded-full dark:bg-lightinfo">
                          +18
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SimpleBar>
        )
        
        }
        {activeTab === '8 To 10' && 
        
          (
          <SimpleBar className="max-h-[350px]">
            <div className="grid grid-cols-12 gap-6 mt-6">
              <div className="md:col-span-2 col-span-3">
                <ul className="flex flex-col gap-6">
                  <li className="text-sm font-medium">8:00</li>
                  <li className="text-sm font-medium">8:30</li>
                  <li className="text-sm font-medium">9:00</li>
                  <li className="text-sm font-medium">9:30</li>
                  <li className="text-sm font-medium">10:00</li>
                  <li className="text-sm font-medium">10:30</li>
                  <li className="text-sm font-medium">11:00</li>
                  <li className="text-sm font-medium">11:30</li>
                  <li className="text-sm font-medium">12:00</li>
                  <li className="text-sm font-medium">12:30</li>
                  <li className="text-sm font-medium">13:00</li>
                  <li className="text-sm font-medium">13:30</li>
                </ul>
              </div>
              <div className="md:col-span-10 col-span-9">
                <div className="mt-8">
                  <div className="rounded-sm shadow-sm p-4 border-s-5 border-primary">
                    <h6 className="text-base">Marketing Meeting</h6>
                    <div className="flex items-center gap-1">
                      <IconClock size={15} />
                      08:30 - 10:00
                    </div>
                    <div className="flex mt-6  ms-2">
                      {userImg.map((item, index) => (
                        <div className="-ms-2  h-8 w-8" key={index}>
                          <img
                            src={item.user}
                            className=" border-white dark:border-darkborder rounded-full"
                            alt="icon"
                          />
                        </div>
                      ))}
                      <div className="">
                        <div className="bg-lightinfo text-info text-xs  border-white dark:border-darkborder  h-8 w-8 flex justify-center items-center  rounded-full dark:bg-lightinfo">
                          +18
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="rounded-sm shadow-sm p-4 border-s-5 border-secondary">
                    <h6 className="text-base">Applied mathematics</h6>
                    <div className="flex items-center gap-1">
                      <IconClock size={15} />
                      10:15 - 11:45
                    </div>
                    <div className="flex mt-8  ms-2">
                      {userImg.map((item, index) => (
                        <div className="-ms-2  h-8 w-8" key={index}>
                          <img
                            src={item.user}
                            className=" border-white dark:border-darkborder rounded-full"
                            alt="icon"
                          />
                        </div>
                      ))}
                      <div className="">
                        <div className="bg-lightinfo text-info text-xs  border-white dark:border-darkborder  h-8 w-8 flex justify-center items-center  rounded-full dark:bg-lightinfo">
                          +18
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="rounded-sm shadow-sm p-4 border-s-5 border-success">
                    <h6 className="text-base">SEO Session with Team</h6>
                    <div className="flex items-center gap-1">
                      <IconClock size={15} />
                      12:00 - 13:25
                    </div>
                    <div className="flex mt-8  ms-2">
                      {userImg.map((item, index) => (
                        <div className="-ms-2  h-8 w-8" key={index}>
                          <img
                            src={item.user}
                            className=" border-white dark:border-darkborder rounded-full"
                            alt="icon"
                          />
                        </div>
                      ))}
                      <div className="">
                        <div className="bg-lightinfo text-info text-xs  border-white dark:border-darkborder  h-8 w-8 flex justify-center items-center  rounded-full dark:bg-lightinfo">
                          +18
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SimpleBar>
        )
        }
      </CardBox>
    </div>
  );
};

export default UpcommingSchedule;
