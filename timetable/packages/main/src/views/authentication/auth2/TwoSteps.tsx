import { Link } from 'react-router';
import CardBox from 'src/components/shared/CardBox';
import AuthTwoSteps from '../authforms/AuthTwoSteps';
import FullLogo from 'src/layouts/full/shared/logo/FullLogo';

const TwoSteps = () => {
  return (
    <>
      <div className="relative overflow-hidden h-screen bg-lightinfo/50">
        <div className="flex h-full justify-center items-center px-4 relative !z-20">
          <CardBox className="md:w-[450px] w-full border-none md:after:content-[''] after:content-none after:absolute after:-top-16 md:after:-end-20  after:bg-[url('/src/assets/images/backgrounds/login-icon.png')] after:h-[200px] after:w-[200px] after:bg-contain after:bg-center after:bg-no-repeat after:z-[-1] !shadow-elevation4  md:before:content-[''] before:content-none before:absolute before:-start-30 md:before:-bottom-30 before:-bottom-1  before:h-[200px] before:w-[200px] before:rounded-full before:bg-error before:z-[-1] ">
            <div className="mx-auto py-4">
              <FullLogo />
            </div>
            <p className="text-darklink text-sm font-medium text-center">
              We sent a verification code to your mobile. Enter the code from the mobile in the
              field below.
            </p>
            <h6 className="text-sm font-bold my-4 text-center">******1234</h6>
            <AuthTwoSteps />
            <div className="flex gap-2 text-sm text-ld font-medium mt-3 items-center justify-center">
              <p>Didn't get the code?</p>
              <Link to={'/'} className="text-primary text-sm font-medium">
                Resend
              </Link>
            </div>
          </CardBox>
        </div>
      </div>
    </>
  );
};

export default TwoSteps;
