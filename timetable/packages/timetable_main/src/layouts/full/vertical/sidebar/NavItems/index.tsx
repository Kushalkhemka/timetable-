import React, { useContext } from 'react';
import { ChildItem } from '../Sidebaritems';
import { Button, SidebarItem } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { DashboardContext } from 'src/context/DashboardContext/DashboardContext';
 

interface NavItemsProps {
  item: ChildItem;
}
const NavItems: React.FC<NavItemsProps> = ({ item }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const { t } = useTranslation();
  const { setIsMobileSidebarOpen } = useContext(DashboardContext);
  
  const handleMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  

  return (
    <>
      <Link to={item.url}>
        <SidebarItem
          as={Button}
          className={`realtive mb-1 sidebar-link  relative  py-0 px-6  ${
            item.url == pathname
              ? `text-${item.bg} dark:text-${item.bg} ${
                  item.icon
                    ? ` bg-light${item.bg} dark:bg-light${item.bg} dark:text-${item.bg} hover:bg-light${item.bg} dark:hover:bg-light${item.bg}  `
                    : 'bg-transparent dark:bg-transparent'
                }   active `
              : ` text-link bg-transparent dark:bg-transparent group/link before:content-[''] before:absolute before:start-0 before:top-0 before:h-full before:w-0 hover:before:w-full before:bg-light${item.bg} before:transition-all before:duration-400 before:rounded-e-full hover:bg-transparent dark:hover:bg-transparent hover:text-${item.bg} dark:hover:text-${item.bg} `
          } `}
        >
          <span
            onClick={handleMobileSidebar}
            className={`flex gap-3 align-center items-center truncate leading-[normal]  ${
              item.disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
            }`}
          >
            {item.icon ? (
              <Icon icon={item.icon} className={`${item.color}`} height={24} />
            ) : (
              <span
                className={`ms-2 me-3 ${
                  item.url == pathname
                    ? ' rounded-full mx-1.5 group-hover/link:bg-dark bg-dark dark:bg-white  h-[6px] w-[6px]'
                    : 'h-[6px] w-[6px] bg-black/40 dark:bg-white/50 rounded-full  group-hover/link:bg-dark dark:group-hover/link:bg-white'
                } `}
              ></span>
            )}
            <span className={` flex flex-auto hide-menu-flex`}>
              <span
                className={`drop-items w-full overflow-hidden `}
              >
                {t(`${item.name}`)}
              </span>
              {item.chip ? (
                <span
                  className={` bg-${item.chipbg} h-5 w-5 text-white flex items-center justify-center rounded-full text-xs `}
                >
                  {item.chip}
                </span>
              ) : (
                ''
              )}

              {item.outlineText ? (
                <span
                  className={` border border-${item.outlineColor}  text-${item.outlineColor} flex items-center justify-center rounded-full  text-xs px-2 `}
                >
                  {item.outlineText}
                </span>
              ) : (
                ''
              )}
            </span>
          </span>
        </SidebarItem>
      </Link>
    </>
  );
};

export default NavItems;
