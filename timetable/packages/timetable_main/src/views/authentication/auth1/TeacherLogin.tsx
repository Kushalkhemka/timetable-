import { Link } from 'react-router';
import AuthLogin from '../authforms/AuthLogin';
import SocialButtons from '../authforms/SocialButtons';
import CardBox from 'src/components/shared/CardBox';
import FullLogo from 'src/layouts/full/shared/logo/FullLogo';

const TeacherLogin = () => {
  return (
    <>
      <div className="relative min-h-screen flex flex-col justify-center bg-lightinfo/50">
        <div className="flex h-full justify-center items-center px-4 relative !z-20">
          <CardBox className="xl:max-w-6xl lg:max-w-3xl md:max-w-xl w-full border-none p-0 !shadow-elevation4">
            <div className="p-6">
              <FullLogo />
            </div>
            <div className="grid grid-cols-12 items-center justify-center">
              <div className="xl:col-span-6 col-span-12 xl:block hidden px-8">
                <img src="/DTU_LOGO.png" alt="DTU Logo" className="mx-auto h-94 w-94 object-contain" />
              </div>
              <div className="xl:col-span-6 col-span-12 xl:px-8 px-6">
                <div className="lg:px-6 pb-8">
                  <h3 className="text-3xl font-bold mb-3">Teacher Sign in</h3>
                  <p className="text-base text-ld">Access your Teacher Dashboard</p>
                  <SocialButtons title="or sign in with" />
                  <AuthLogin redirectPath="/teacher" />
                  <div className="flex gap-2 text-sm dark:text-white font-medium mt-6 items-center ">
                    <p>Student?</p>
                    <Link to={'/auth/auth1/student-login'} className="text-primary text-sm font-medium ">
                      Go to student login
                    </Link>
                  </div>
                  <div className="flex gap-2 text-sm dark:text-white font-medium mt-4 items-center ">
                    <p>New Teacher?</p>
                    <Link to={'/auth/auth1/teacher-register'} className="text-primary text-sm font-medium ">
                      Create account
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

export default TeacherLogin;


