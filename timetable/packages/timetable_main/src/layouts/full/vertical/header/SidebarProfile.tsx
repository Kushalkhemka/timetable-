import { Icon } from '@iconify/react';
import user1 from 'src/assets/images/7f4ccfac-f86b-4a6e-ba5b-c135ea683775-removebg-preview.png';
import { Link } from 'react-router';
import { Tooltip } from 'flowbite-react';
import { useAuth } from 'src/context/AuthContext';

const SidebarProfile = () => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const userDesignation = user?.user_metadata?.role ? 
    user.user_metadata.role.charAt(0).toUpperCase() + user.user_metadata.role.slice(1) : 
    'Admin';

  return (
    <div className="p-5 bg-white dark:bg-dark hide-menu profile-menu">
      <div className="bg-lightprimary p-3 w-full rounded-md flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="h-8 w-8 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center group-hover/menu:bg-lightprimary group-hover/menu:text-primary flex-shrink-0">
            <img src={user1} alt="logo" height="24" width="24" className="rounded-full" />
          </span>
          <div className="flex-1 min-w-0 overflow-hidden">
            <h5 className="text-sm font-medium truncate" title={userName}>{userName}</h5>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate" title={userDesignation}>{userDesignation}</p>
          </div>
        </div>
        <Link to="/auth/auth1/login" className="text-primary flex-shrink-0 hover:bg-lightprimary rounded-full p-1">
          <Tooltip content="Logout" placement="top" animation="duration-500">
            <Icon icon="solar:logout-line-duotone" height={20} />
          </Tooltip>
        </Link>
      </div>
    </div>
  );
};

export default SidebarProfile;
