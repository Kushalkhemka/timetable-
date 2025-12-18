import { Link } from 'react-router';
import Bg from "/src/assets/images/landingpage/background/slider-group.png";

import { Button } from 'flowbite-react';

const banner = () => {
  return (
    <>
      <div className="bg-muted dark:bg-darkmuted/50 md:py-20 py-12 relative overflow-hidden">
        <div className="container relative">
          <div className="text-center">
            <h1
              className="md:text-56 text-4xl font-bold "
              data-aos="fade-up"
              data-aos-delay="400"
              data-aos-duration="1000"
            >
              Revolutionize your development with Powerfull React Tailwind dashboard
            </h1>
            <p className='text-lg font-medium text-ld py-8'

             data-aos="fade-up"
              data-aos-delay="500"
              data-aos-duration="1000"
            
            >Spike comes with light & dark color skins, well designed dashboards, applications and pages</p>
            <div
              className="flex gap-3.5 justify-center"
              data-aos="fade-up"
              data-aos-delay="800"
              data-aos-duration="1000"
            >
              <Button as={Link} to="/auth/auth1/login" color={'primary'} className="px-8" size='lg'>
                Login
              </Button>
              <Button  href="#demos" color={'outlineprimary'} className="px-8" size='lg'>
                  Live Preview
              </Button>
             
            </div>
          </div>
        </div>

        <div className="slider-group flex flex-row w-full gap-3 pt-20">
            <div className="slide">
              <img src={Bg} alt="slide" className='max-w-none' />
            </div>
            <div className="slide">
              <img src={Bg} alt="slide" className='max-w-none'/>
            </div>
            <div className="slide">
              <img src={Bg} alt="slide" className='max-w-none'/>
            </div>
            <div className="slide">
              <img src={Bg} alt="slide" className='max-w-none'/>
            </div>
            <div className="slide">
              <img src={Bg} alt="slide " className='max-w-none'/>
            </div>
          </div>
      </div>
    </>
  );
};

export default banner;
