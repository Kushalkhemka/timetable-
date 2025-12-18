import React, { useState, useContext } from 'react';
import { Outlet } from 'react-router';
import StudentSidebarLayout from './vertical/sidebar/StudentSidebar';
import Header from './vertical/header/Header';
import { Customizer } from './shared/customizer/Customizer';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { DashboardContextProvider } from 'src/context/DashboardContext/DashboardContext';
import ScrollToTop from 'src/components/shared/ScrollToTop';

const StudentLayout = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [customizerToggle, setCustomizerToggle] = useState(false);

  return (
    <DashboardContextProvider>
      <CustomizerContext.Provider
        value={{
          sidebarToggle,
          setSidebarToggle,
          customizerToggle,
          setCustomizerToggle,
        }}
      >
        <StudentLayoutContent />
      </CustomizerContext.Provider>
    </DashboardContextProvider>
  );
};

const StudentLayoutContent = () => {
  const { activeLayout, isLayout } = useContext(CustomizerContext);

  return (
    <>
      <div
        className={`flex w-full min-h-screen  bg-lightprimary/40 dark:bg-info/5  ${
          activeLayout == 'vertical' ? ' ps-5 xl:pe-0 pe-5 pt-5' : 'xl:p-0 p-5'
        }  `}
      >
        <div className="page-wrapper flex w-full  ">
          {/* Header/sidebar */}
          {activeLayout == 'vertical' ? <StudentSidebarLayout /> : null}
          <div className="page-wrapper-sub flex flex-col w-full ">
            {/* Top Header  */}
            <Header layoutType="vertical" />

            <div
              className={`  h-full ${
                activeLayout != 'horizontal' ? 'rounded-bb' : 'rounded-none'
              } `}
            >
              {/* Body Content  */}
              <div
                className={` ${
                  isLayout == 'full' ? 'w-full py-6 md:px-5' : 'container mx-auto  py-6 px-0'
                } ${activeLayout == 'horizontal' ? 'xl:mt-3' : ''}
              `}
              >
                <ScrollToTop>
                  <Outlet />
                </ScrollToTop>
              </div>
              <Customizer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentLayout;


