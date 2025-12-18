
import  { useEffect, useState } from "react";
import { ChildItem } from "../Sidebaritems";
import { useTranslation } from "node_modules/react-i18next";
import { useLocation } from "react-router";
import { CustomCollapse } from "../CustomCollapse";
import React from "react";
import Dropitms from "../DropItems";

interface NavCollapseProps {
  item: ChildItem;
}



const NavCollapse: React.FC<NavCollapseProps> = ({ item }: any) => {
  const location = useLocation();
  const pathname = location.pathname;

  // Determine if any child matches the current path
  const activeDD = item.children.find((t: { url: string }) => t.url === pathname);
  

  const { t, i18n } = useTranslation();
  const [translatedLabel, setTranslatedLabel] = useState<string | null>(null);

  // Manage open/close state for the collapse
  const [isOpen, setIsOpen] = useState<boolean>(!!activeDD);

  useEffect(() => {
    const loadTranslation = async () => {
      const label = t(`${item.name}`);
      setTranslatedLabel(label);
    };
    loadTranslation();
  }, [i18n.language, item.name, t]);

  // Toggle the collapse
  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <CustomCollapse
      label={translatedLabel || `${item.name}`}
      open={isOpen}
      onClick={handleToggle}
      icon={item.icon} 
      className={ 
        Boolean(activeDD)
          ? `sidebar-link bg-light${item.bg} dark:bg-light${item.bg} dark:text-${item.bg} hover:bg-light${item.bg} dark:hover:bg-light${item.bg} text-${item.bg} mb-1`
          : `sidebar-link group/link before:content-[''] before:absolute before:start-0 before:top-0 before:h-full before:w-0 hover:before:w-full before:bg-light${item.bg} before:transition-all before:duration-400 before:rounded-e-full hover:bg-transparent dark:hover:bg-transparent hover:text-${item.bg} !dark:hover:text-${item.bg} mb-1`
      }
    >
      {/* Render child items */}
      {item.children && (
        <div className="sidebar-dropdown ">
          {item.children.map((child: any) => (
            <React.Fragment key={child.id}>
              {child.children ? (
                <NavCollapse item={child} /> // Recursive call for nested collapse
              ) : (
                <Dropitms item={child} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </CustomCollapse>
  );
};

export default NavCollapse;
