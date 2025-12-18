import { Icon } from '@iconify/react';
import { Button, Dropdown, DropdownItem } from 'flowbite-react';
import * as profileData from './Data';
import SimpleBar from 'simplebar-react';
import user1 from 'src/assets/images/7f4ccfac-f86b-4a6e-ba5b-c135ea683775-removebg-preview.png';
import { Link } from 'react-router';
import { useAuth } from 'src/context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const userDesignation = user?.user_metadata?.role ? 
    user.user_metadata.role.charAt(0).toUpperCase() + user.user_metadata.role.slice(1) : 
    'Admin';
  const userEmail = user?.email || 'user@example.com';

  return (
    <div className="relative group/menu cursor-pointer">
      <Dropdown
        label=""
        className="w-screen sm:w-[360px] py-6  rounded-sm "
        dismissOnClick={false}
        renderTrigger={() => (
          <div className="flex items-center gap-3">
            <span className="md:h-10 md:w-10 h-8 w-8 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center group-hover/menu:bg-lightprimary group-hover/menu:text-primary flex-shrink-0">
              <img src={user1} alt="logo" height="40" width="40" className="rounded-full" />
            </span>
            <div className='md:block hidden flex-1 min-w-0'>
              <h5 className='text-base truncate max-w-[120px]' title={userName}>{userName}</h5>
              <p className='text-xs truncate max-w-[120px]' title={userDesignation}>{userDesignation}</p>
            </div>
          </div>
        )}
      >
        <div className="px-6">
          <h3 className="text-lg font-semibold text-ld">User Profile</h3>
          <div className="flex items-center gap-6 pb-5 border-b border-ld mt-5 mb-3">
            <img src={user1} alt="logo" height="50" width="50" className="rounded-full" />
            <div >
              <h5 className="card-title">{userName}</h5>
              <span className="text-darklink">{userDesignation}</span>
              <p className="card-subtitle mb-0 mt-1 flex items-center text-darklink">
                <Icon icon="solar:mailbox-line-duotone" className="text-base me-1" />
                {userEmail}
              </p>
            </div>
          </div>
        </div>
        <SimpleBar>
          {profileData.profileDD.map((items, index) => (
            <DropdownItem
              as={Link}
              to="#"
              className="px-6 py-3 flex justify-between items-center bg-hover group/link w-full"
              key={index}
            >
              <div className="flex items-center w-full">
                <div
                  className={`h-10 w-10 flex-shrink-0 rounded-md flex justify-center items-center ${items.bgcolor}`}
                >
                  <Icon icon={items.icon} height={24} className={items.color} />
                </div>
                <div className="ps-4 flex justify-between w-full">
                  <div className="w-3/4 ">
                    <h5 className="text-15 font-medium  group-hover/link:text-primary">{items.title}</h5>
                    <div className="text-13  text-darklink">{items.subtitle}</div>
                  </div>
                </div>
              </div>
            </DropdownItem>
          ))}
        </SimpleBar>

        <div className="pt-6 px-6">
          <Button color={'primary'} as={Link} to="/auth/auth1/login" className="w-full">
            Logout
          </Button>
        </div>
      </Dropdown>
    </div>
  );
};

export default Profile;
