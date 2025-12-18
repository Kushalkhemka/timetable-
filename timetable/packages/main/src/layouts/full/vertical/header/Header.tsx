import 'flowbite';
import { useState, useEffect, useContext } from 'react';
import { DrawerItems, Navbar, NavbarCollapse } from 'flowbite-react';
import Search from './Search';
import { Icon } from '@iconify/react';

import AppShortcut from './AppShortcut';
import Notifications from './Notifications';
import Profile from './Profile';

import { Language } from './Language';
import FullLogo from '../../shared/logo/FullLogo';
import MobileHeaderItems from './MobileHeaderItems';
import { Drawer } from 'flowbite-react';
import MobileSidebar from '../sidebar/MobileSidebar';
import HorizontalMenu from '../../horizontal/header/HorizontalMenu';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { DashboardContext } from 'src/context/DashboardContext/DashboardContext';

interface HeaderPropsType {
  layoutType: string;
}

const Header = ({ layoutType }: HeaderPropsType) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const { setIsCollapse, isCollapse, isLayout, setActiveMode, activeMode, activeLayout, sidebarToggle, setSidebarToggle } =
    useContext(CustomizerContext);
  const { isMobileSidebarOpen, setIsMobileSidebarOpen } = useContext(DashboardContext);

  const [mobileMenu, setMobileMenu] = useState('');

  const handleMobileMenu = () => {
    if (mobileMenu === 'active') {
      setMobileMenu('');
    } else {
      setMobileMenu('active');
    }
  };

  const toggleMode = () => {
    setActiveMode((prevMode: string) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // mobile-sidebar
  const handleClose = () => setIsMobileSidebarOpen(false);
  return (
    <>
      <header
        className={`sticky top-0 z-[5] 
          ${activeLayout == 'vertical' ? 'rounded-lg' : 'xl:rounded-none rounded-lg w-full'} 
        ${isLayout == 'full' || activeLayout == 'horizontal' ? `!max-w-full ${activeLayout == 'vertical' ? 'sm:mx-5 sm:px-0 px-0' : 'px-0'} ` : 'container md:px-5 px-0'} ${
          isSticky
            ? 'bg-white dark:bg-dark shadow-md fixed w-full'
            : 'bg-white dark:bg-dark shadow-md '
        }`}
      >
        <Navbar
          fluid
          className={`rounded-none bg-transparent dark:bg-transparent  ${
            layoutType == 'horizontal' ? 'container mx-auto py-4 xl:px-0' : 'py-4 sm:px-0'
          }  ${isLayout == 'full' ? '!max-w-full !px-4' : ''}`}
        >
          {/* Mobile Toggle Icon */}
          <span
            onClick={() => setIsMobileSidebarOpen(true)}
            className="h-11 w-11 flex text-black dark:text-white text-opacity-65 xl:hidden hover:text-primary hover:bg-lightprimary rounded-full justify-center items-center cursor-pointer"
          >
            <Icon icon="solar:list-bold-duotone" height={24} />
          </span>
          {/* Toggle Icon   */}
          <NavbarCollapse className="xl:block ">
            <div className="flex gap-3 items-center relative">
              {layoutType == 'horizontal' ? (
                <div className="me-3 xl:block hidden">
                  <FullLogo />
                </div>
              ) : null}
              {/* Toggle Menu    */}
              {layoutType != 'horizontal' ? (
                <span
                  onClick={() => setSidebarToggle(!sidebarToggle)}
                  className="h-11 w-11 xl:flex hidden  hover:text-primary hover:bg-lightprimary rounded-full justify-center items-center cursor-pointer text-link dark:text-white"
                >
                  <Icon icon="solar:list-bold-duotone" height={24} />
                </span>
              ) : null}
            </div>
          </NavbarCollapse>

          {/* mobile-logo */}
          <div className="block lg:hidden">
            <FullLogo />
          </div>

          <NavbarCollapse className="xl:block hidden">
            <div className="lg:flex hidden gap-3 items-center">
              <Search />
              {/* Theme Toggle */}
              {activeMode === 'light' ? (
                <div
                  className="h-11 w-11 hover:text-primary hover:bg-lightprimary dark:hover:bg-darkminisidebar  dark:hover:text-primary focus:ring-0 rounded-full flex justify-center items-center cursor-pointer text-link  dark:text-white"
                  onClick={toggleMode}
                >
                  <span className="flex items-center">
                    <Icon icon="solar:moon-line-duotone" width="22" />
                  </span>
                </div>
              ) : (
                // Dark Mode Button
                <div
                  className="h-11 w-11 hover:text-primary hover:bg-lightprimary dark:hover:bg-darkminisidebar  dark:hover:text-primary focus:ring-0 rounded-full flex justify-center items-center cursor-pointer text-link  dark:text-white"
                  onClick={toggleMode}
                >
                  <span className="flex items-center">
                    <Icon icon="solar:sun-bold-duotone" width="22" />
                  </span>
                </div>
              )}
              {/* Language Dropdown*/}
              <Language />

             
              {/* Notification Dropdown */}
              <Notifications />

               {/* Messages Dropdown */}
              <AppShortcut />


              {/* Profile Dropdown */}
              <Profile />
            </div>
          </NavbarCollapse>
          {/* Mobile Toggle Icon */}
          <span
            className="h-11 w-11 flex lg:hidden hover:text-primary hover:bg-lightprimary rounded-full justify-center items-center cursor-pointer"
            onClick={handleMobileMenu}
          >
            <Icon icon="tabler:dots" height={21} />
          </span>
        </Navbar>
        <div className={`w-full  xl:hidden block mobile-header-menu ${mobileMenu}`}>
          <MobileHeaderItems />
        </div>

        {/* Horizontal Menu  */}
        {layoutType == 'horizontal' ? (
          <div className="xl:border-t xl:border-ld xl:block hidden ">
            <div className={`${isLayout == 'full' ? 'w-full px-6' : 'container px-0'}`}>
              <HorizontalMenu />
            </div>
          </div>
        ) : null}
      </header>

      {/* Mobile Sidebar */}
      <Drawer open={isMobileSidebarOpen} onClose={handleClose} className="w-auto">
        <DrawerItems>
          <MobileSidebar />
        </DrawerItems>
      </Drawer>
    </>
  );
};

export default Header;
