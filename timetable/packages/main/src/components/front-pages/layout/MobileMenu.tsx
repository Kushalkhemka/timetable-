
import  { useState } from "react";
import { Button, Drawer, DrawerItems } from "flowbite-react";
import { Icon } from '@iconify/react';

import Navigation from "./Navigation";
import FullLogo from "src/layouts/full/shared/logo/FullLogo";
import { Link } from "react-router";
const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);
  return (
    <>
      <div className="xl:hidden flex">
        <Button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center h-10 w-10 rounded-full bg-lightprimary text-primary hover:bg-lightprimary px-0"
        >
         <Icon icon="solar:list-bold-duotone" height={24}  />
        </Button>
      </div>
      <Drawer open={isOpen} onClose={handleClose} className="h-full">
        <DrawerItems className="p-6">
          <div className="mb-6">
            <FullLogo />
          </div>
          <Navigation />
          <Button
            as={Link}
            to="/auth/auth2/login"
            className="font-bold w-full mt-6"
            color={"primary"}
          >
            Log in
          </Button>
        </DrawerItems>
      </Drawer>
    </>
  );
};

export default MobileMenu;
