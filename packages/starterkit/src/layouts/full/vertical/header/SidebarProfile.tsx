import { Icon } from '@iconify/react';
import user1 from 'src/assets/images/7f4ccfac-f86b-4a6e-ba5b-c135ea683775-removebg-preview.png';
import { Link } from 'react-router';
import { Tooltip } from 'flowbite-react';
import { useAuth } from 'src/context/AuthContext';

const SidebarProfile = () => {
  const { user, role } = useAuth();
  const userName = user?.user_metadata?.name || 
    (user?.user_metadata?.first_name && user?.user_metadata?.last_name ? 
      `${user.user_metadata.first_name} ${user.user_metadata.last_name}` : 
      user?.email?.split('@')[0]) || 'User';
  const userDesignation = role || 'User';

  return (
    <div className="p-5  bg-white dark:bg-dark hide-menu">
      <div className="bg-lightprimary p-3 w-full rounded-md flex items-center gap-3">
        <div className="flex items-center gap-4">
          <span className="md:h-10 md:w-10 h-8 w-8 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center  group-hover/menu:bg-lightprimary group-hover/menu:text-primary">
            <img src={user1} alt="logo" height="30" width="30" className="rounded-full" />
          </span>
          <div className="">
            <h5 className="text-base">{userName}</h5>
            <p className="text-xs">{userDesignation}</p>
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
