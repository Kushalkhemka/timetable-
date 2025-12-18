import { FC, useContext } from 'react';
import { Outlet } from 'react-router';
import { Customizer } from './shared/customizer/Customizer';
import { CustomizerContext } from '../../context/CustomizerContext';
import StudentSidebar from './vertical/sidebar/StudentSidebar';
import Header from './vertical/header/Header';
import ScrollToTop from 'src/components/shared/ScrollToTop';
import EnhancedSupportChatbot from '../../components/shared/EnhancedSupportChatbot';

const StudentLayout: FC = () => {
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

          {activeLayout == 'vertical' ? <StudentSidebar /> : null}
          <div className="page-wrapper-sub flex flex-col w-full ">
            {/* Top Header  */}
            {activeLayout == 'horizontal' ? (
              <Header layoutType="horizontal" />
            ) : (
              <Header layoutType="vertical" />
            )}

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
      
      {/* Enhanced Support AI Chatbot (global widget) */}
      <EnhancedSupportChatbot position="right" mode="widget" />
    </>
  );
};

export default StudentLayout;
