import { UserDataProvider } from 'src/context/UserDataContext';
import Post from './Post';
import ProfileBanner from './ProfileBanner';
import AboutCard from './AboutCard';
import Teams from './Teams';
import CounterCard from './CounterCard';

const UserProfileApp = () => {
  return (
    <>
      <UserDataProvider>
        <ProfileBanner />
        <div className="mx-6 mt-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="lg:col-span-4 col-span-12">
              <AboutCard />
              <div className='mt-6'>
                <Teams/>
              </div>
            </div>
            <div className="lg:col-span-8 col-span-12">
              <CounterCard/>
              <div className='mt-6'>
                <Post/>
              </div>
            </div>
          </div>
        </div>
      </UserDataProvider>
    </>
  );
};

export default UserProfileApp;
