import { Link } from 'react-router';
const Footer = () => {
  return (
    <>
      <div className="bg-white dark:bg-dark">
        <div className="container">
          <div className=" py-10 text-center">
            
            <div>
              <p className="text-ld">
                All rights reserved by Spike Admin.<br></br>
                Designed & Developed by{' '}
                <Link
                  to="https://www.wrappixel.com/"
                  target="_blank"
                  className="text-primary font-medium underline underline-offset-4 decoration-primary text-primary-ld"
                >
                  Wrappixel
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
