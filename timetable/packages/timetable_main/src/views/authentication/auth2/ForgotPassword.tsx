

import { Button } from "flowbite-react";
import CardBox from "src/components/shared/CardBox";
import AuthForgotPassword from "../authforms/AuthForgotPassword";
import { Link } from "react-router";
import FullLogo from "src/layouts/full/shared/logo/FullLogo";



const ForgotPassword = () => {
  return (
    <>
      <div className="relative overflow-hidden h-screen bg-muted dark:bg-dark">
         <div className="flex h-full justify-center items-center px-4 relative !z-20">

            <CardBox className="md:w-[450px] w-full border-none md:after:content-[''] after:content-none after:absolute after:-top-16 md:after:-end-20  after:bg-[url('/src/assets/images/backgrounds/login-icon.png')] after:h-[200px] after:w-[200px] after:bg-contain after:bg-center after:bg-no-repeat after:z-[-1] !shadow-elevation4  md:before:content-[''] before:content-none before:absolute before:-start-30 md:before:-bottom-30 before:-bottom-1  before:h-[200px] before:w-[200px] before:rounded-full before:bg-error before:z-[-1] ">
            <div className="mx-auto pt-3">
              <FullLogo />
            </div>
            <p className="text-darklink text-sm text-center my-4">Please enter the email address associated with your account and We will email you a link to reset your password.</p>
            <AuthForgotPassword />
            <Button
                  color={"lightprimary"}
                  as={Link}
                  to="/auth/auth2/login"
                  className="w-full mt-3"
                  size="lg"
                >
                  Back to Login
                </Button>
          </CardBox>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
