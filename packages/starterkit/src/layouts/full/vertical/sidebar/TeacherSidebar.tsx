import React from 'react';
import { Sidebar } from 'flowbite-react';
import FullLogo from '../../shared/logo/FullLogo';
import TeacherInnerSidebar from './TeacherInnerSidebar';

const TeacherSidebar = () => {
  return (
    <>
      <div className="xl:block hidden">
        <div className="flex">
          <Sidebar
            className="fixed menu-sidebar lg:h[calc(100%_-_40px)]  start-0 rounded-lg overflow-y-hidden"
            aria-label="Teacher Sidebar"
          >
            <div className="px-5 py-4 flex items-center brand-logo">
              <FullLogo />
            </div>
            <TeacherInnerSidebar />
          </Sidebar>
        </div>
      </div>
    </>
  );
};

export default TeacherSidebar;


