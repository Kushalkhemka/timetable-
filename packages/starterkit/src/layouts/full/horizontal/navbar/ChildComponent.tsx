import { useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';

const ChildComponent = ({
  item,
  isActive,
  handleMouseEnter,
  handleMouseLeave,
  onClick,
  title,
}: any) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const location = useLocation();
  const pathname = location.pathname;

  const handleSubMenuEnter = () => {
    setIsSubMenuOpen(true);
  };

  const handleSubMenuLeave = () => {
    setIsSubMenuOpen(false);
  };
  const { t } = useTranslation();

  return (
    <div
      className="relative group"
      onMouseEnter={handleSubMenuEnter}
      onMouseLeave={handleSubMenuLeave}
      onClick={onClick}
    >
      <Link to={item.href}>
        <p
          className={`w-full ${
            item.href === pathname
              ? 'text-dark dark:text-white hover:text-dark dark:hover:text-white'
              : 'text-dark/70 dark:text-white/50'
          } py-1 px-3 rounded-md flex gap-3 items-center  hover:text-dark dark:hover:text-white text-nowrap`}
        >
          <span className="flex gap-3 items-center w-full">
            <Icon icon={`${item.icon}`} height={22} />
            <span className="line-clamp-1 max-w-24 overflow-hidden text-nowrap">
              {t(`${item.title}`)}
            </span>
            {item.children && <IconChevronDown size={18} className="ms-auto" />}
          </span>
        </p>
      </Link>
      {isSubMenuOpen && item.children && (
        <div
          className={`absolute   top-0 mt-0 w-56 bg-white dark:bg-dark rounded-md shadow-lg ${
            title == 'Tables' ? 'tables-position' : 'left-full rtl:right-full'
          }`}
        >
          <ul className="p-3 flex flex-col gap-2">
            {item.children.map((child: any) => (
              <li key={child.id}>
                {child.children ? (
                  <ChildComponent
                    item={child}
                    isActive={isActive}
                    handleMouseEnter={handleMouseEnter}
                    handleMouseLeave={handleMouseLeave}
                  />
                ) : (
                  <Link to={child.href}>
                    <p
                      className={`group/menu hover:text-dark dark:hover:text-white ${
                        child.href == pathname
                          ? 'text-dark dark:text-white '
                          : 'text-dark/70 dark:text-white/50'
                      } py-1 px-3 rounded-full flex gap-2 items-center  dark:text-white/50 hover:text-dark dark:hover:text-white`}
                    >
                      <span
                        className={` ${
                          child.href == pathname
                            ? 'bg-dark dark:bg-white'
                            : 'bg-dark/70 dark:bg-white/50'
                        } group-hover/menu:bg-dark dark:group-hover/menu:bg-white  rounded-full mx-1.5 h-[6px] w-[6px]`}
                      ></span>
                      {t(`${child.title}`)}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChildComponent;
