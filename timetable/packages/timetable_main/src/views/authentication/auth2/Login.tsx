import { Link } from "react-router";
import CardBox from "src/components/shared/CardBox";
import AuthLogin from "../authforms/AuthLogin";
import SocialButtons from "../authforms/SocialButtons";
import FullLogo from "src/layouts/full/shared/logo/FullLogo";

const Login = () => {
  return (
    <>
      <div className="relative overflow-hidden h-screen bg-lightinfo/50">
        <div className="flex h-full justify-center items-center px-4 relative !z-20">

            <CardBox className="md:w-[450px] w-full border-none md:after:content-[''] after:content-none after:absolute after:-top-16 md:after:-end-20  after:bg-[url('/src/assets/images/backgrounds/login-icon.png')] after:h-[200px] after:w-[200px] after:bg-contain after:bg-center after:bg-no-repeat after:z-[-1] !shadow-elevation4  md:before:content-[''] before:content-none before:absolute before:-start-30 md:before:-bottom-30 before:-bottom-1  before:h-[200px] before:w-[200px] before:rounded-full before:bg-error before:z-[-1] ">
            <div className="mx-auto">
              <FullLogo />
            </div>
            <SocialButtons title="or sign in with" />
            <AuthLogin />
            <div className="flex gap-2 text-sm text-ld font-medium mt-4 items-center justify-center">
              <p>New to D2?</p>
              <Link
                to={"/auth/auth2/register"}
                className="text-primary text-sm font-medium"
              >
                Create an account
              </Link>
            </div>
          </CardBox>
        </div>
      </div>
    </>
  );
};

export default Login;
