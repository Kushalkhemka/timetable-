import Banner from '/src/assets/images/backgrounds/profilebg-2.jpg';
import { Badge, Button } from 'flowbite-react';
import ProfileTab from './ProfileTab';

import profileImg from '/src/assets/images/profile/user-1.jpg';
import { IconPlus } from '@tabler/icons-react';


const ProfileBanner = () => {
  return (
    <>
      <div>
        <img src={Banner} alt="priofile banner" className="w-full rounded-lg" height={330} />

        <div className="mx-6 bg-transparent relative z-[1]">
          <div className="bg-white dark:bg-dark px-8 pt-8 -mt-15 rounded-lg">
            <div className="flex md:flex-row flex-col gap-3 md:items-center justify-between">
              <div className="flex  gap-3 items-center">
                <div className="relative">
                  <img
                    src={profileImg}
                    alt="profile"
                   
                    className="rounded-full mx-auto border-4 border-white dark:border-darkborder sm:h-24 sm:w-24 h-16 w-16"
                  />
                  <span className="absolute bottom-2 end-1 sm:h-6 sm:w-6 h-4 w-4 rounded-full bg-primary flex items-center justify-center text-white border-2 border-white">
                    <IconPlus size={15} />
                  </span>
                </div>
                <div className="">
                  <div className="flex items-center gap-3">
                    <h3 className="sm:text-2xl text-lg">Mike Nielsen</h3>
                    <Badge color="lightprimary" className="border font-medium border-primary">
                      Admin
                    </Badge>
                  </div>
                  <p className="text-sm font-medium sm:py-1">super admin</p>
                  <div className="flex items-center gap-2 text-ld font-bold">
                    <span className="h-2 w-2 bg-success rounded-full"></span>
                    Active
                  </div>
                </div>
              </div>
              <Button color={'primary'}>Edit Profile</Button>
            </div>
            <ProfileTab />
          </div>
        </div>
      </div>

      
    </>
  );
};

export default ProfileBanner;
