

import { Sidebar } from "flowbite-react";
import FullLogo from "../../shared/logo/FullLogo";
import InnerSidebar from "./InnerSidebar";


const MobileSidebar = () => {

  return (
    <>
      <div className="flex">
        <Sidebar
          className="fixed menu-sidebar pt-6 bg-white dark:bg-dark z-[10] !shadow-none !left-0 w-full"  
          aria-label="Sidebar with multi-level dropdown example"
        >
          <div className="mb-7 px-4 brand-logo">
            <FullLogo />
          </div>
         <InnerSidebar/>
        </Sidebar>
      </div>
    </>
  );
};

export default MobileSidebar;
