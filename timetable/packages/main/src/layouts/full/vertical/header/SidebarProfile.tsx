import { Icon } from '@iconify/react';
import user1 from '/src/assets//images/profile/user-1.jpg';
import { Link } from 'react-router';
import { Tooltip } from 'flowbite-react';

const SidebarProfile = () => {
  return (
    <div className="p-5  bg-white dark:bg-dark hide-menu">
      <div className="bg-lightprimary p-3 w-full rounded-md flex items-center gap-3">
        <div className="flex items-center gap-4">
          <span className="md:h-12 md:w-12 h-10 w-10 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center  group-hover/menu:bg-lightprimary group-hover/menu:text-primary">
            <img src={user1} alt="logo" height="50" width="50" className="rounded-full" />
          </span>
          <div className="">
            <h5 className="text-base">Mike Nielsen</h5>
            <p className="text-xs">Admin</p>
          </div>
        </div>
        <Link to="/auth/auth1/login" className="text-primary">
          <Tooltip content="Logout" placement="top" animation="duration-500">
            <Icon icon="solar:logout-line-duotone" height={25} />
          </Tooltip>
        </Link>
      </div>
    </div>
  );
};

export default SidebarProfile;
