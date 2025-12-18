import { Link } from 'react-router';
import AuthLogin from '../authforms/AuthLogin';
import SocialButtons from '../authforms/SocialButtons';
import CardBox from 'src/components/shared/CardBox';
import FullLogo from 'src/layouts/full/shared/logo/FullLogo';
import Authimg from  '/src/assets/images/backgrounds/login-security.png';
const Login = () => {
  return (
    <>
      <div className="relative min-h-screen flex flex-col justify-center bg-lightinfo/50">
        <div className="flex h-full justify-center items-center px-4 relative !z-20">
          <CardBox className="  xl:max-w-6xl lg:max-w-3xl md:max-w-xl w-full border-none p-0 md:after:content-[''] after:content-none after:absolute after:-top-20 md:after:-end-20  after:bg-[url('/src/assets/images/backgrounds/login-icon.png')] after:h-[315px] after:w-[305px] after:bg-cover after:bg-center after:z-[-1] !shadow-elevation4  md:before:content-[''] before:content-none before:absolute before:-start-30 md:before:-bottom-30 before:-bottom-1  before:h-[430px] before:w-[430px] before:rounded-full before:bg-error before:z-[-1] ">
            <div className="p-6">
              <FullLogo />
            </div>
            <div className="grid grid-cols-12 items-center justify-center">
              <div className="xl:col-span-6 col-span-12 xl:block hidden px-8">
                <img
                  src={Authimg}
                  alt="logo"
                  className="mx-auto"
                />
              </div>
              <div className="xl:col-span-6 col-span-12 xl:px-8 px-6">
                <div className="lg:px-6 pb-8">
                  <h3 className="text-3xl font-bold mb-3">Welcome to Spike Admin</h3>
                  <p className="text-base text-ld">Your Admin Dashboard</p>
                  <SocialButtons title="or sign in with" />
                  <AuthLogin />
                  <div className="flex gap-2 text-sm dark:text-white font-medium mt-6 items-center ">
                    <p>New to Spike?</p>
                    <Link to={'/auth/auth1/register'} className="text-primary text-sm font-medium ">
                      Create new account
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CardBox>
        </div>
      </div>
    </>
  );
};

export default Login;
