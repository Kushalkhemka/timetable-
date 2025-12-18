import React, { useContext, useEffect } from 'react';
import { SidebarItemGroup, SidebarItems } from 'flowbite-react';
import TeacherSidebarContent from './TeacherSidebaritems';
import NavItems from './NavItems';
import NavCollapse from './NavCollapse';
import SimpleBar from 'simplebar-react';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { useLocation } from 'react-router';
import { Icon } from '@iconify/react/dist/iconify.js';
import SidebarProfile from '../header/SidebarProfile';

const TeacherInnerSidebar = () => {
  const { setSelectedIconId } = useContext(CustomizerContext) || {};

  const location = useLocation();
  const pathname = location.pathname;

  function findActiveUrl(narray: any, targetUrl: any) {
    for (const item of narray) {
      if (item.items) {
        for (const section of item.items) {
          if (section.children) {
            for (const child of section.children) {
              if (child.url === targetUrl) {
                return item.id;
              }
            }
          }
        }
      }
    }
    return null;
  }

  useEffect(() => {
    const result = findActiveUrl(TeacherSidebarContent, pathname);
    if (result && setSelectedIconId) {
      setSelectedIconId(result);
    }
  }, [pathname, setSelectedIconId]);

  return (
    <>
      <SimpleBar className="md:h-[calc(100vh_-_225px)] h-[calc(100vh_-_200px)] pt-4 ">
        <SidebarItems className=" mt-2 ">
          <SidebarItemGroup className="sidebar-nav">
            {TeacherSidebarContent.map((item, index) => (
              <React.Fragment key={index}>
                <h5 className="text-darklink dark:text-white/70 caption font-medium leading-6 px-6  text-xs pb-2  uppercase ">
                  <span className="hide-menu">{item.heading}</span>
                </h5>
                <Icon
                  icon="solar:menu-dots-bold"
                  className="text-link block mx-auto mt-6 leading-6 dark:text-opacity-60 hide-icon pb-2"
                  height={20}
                />

                {item.children?.map((child, index) => (
                  <React.Fragment key={child.id && index}>
                    {child.children ? (
                      <div className="collpase-items">
                        <NavCollapse item={child} />
                      </div>
                    ) : (
                      <NavItems item={child} />
                    )}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </SidebarItemGroup>
        </SidebarItems>
      </SimpleBar>
      {/* Sidebar Profile */}
      <SidebarProfile />
    </>
  );
};

export default TeacherInnerSidebar;


