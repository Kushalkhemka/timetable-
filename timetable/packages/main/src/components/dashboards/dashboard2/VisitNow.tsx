import { useEffect, useState } from 'react';
import CardBox from 'src/components/shared/CardBox';
import bg from '/src/assets/images/backgrounds/welcome-bg.png';
import { Button } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router';
const VisitNow = () => {
  const [greeting, setGreeting] = useState<string>('');
  const [GreetingIcon, setGreetingIcon] = useState<JSX.Element | null>(null);

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting('Good Morning');
      setGreetingIcon(
        <span className="h-8 w-8 bg-lightprimary rounded-full flex justify-center items-center">
          <Icon icon="solar:sun-2-outline" className="text-primary" height={20} />
        </span>,
      );
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good Afternoon');
      setGreetingIcon(
        <span className="h-8 w-8 bg-lighterror rounded-full flex justify-center items-center">
          <Icon icon="solar:cloud-sun-2-linear" className="text-error" height={20} />
        </span>,
      );
    } else if (hour >= 17 && hour < 21) {
      setGreeting('Good Evening');
      setGreetingIcon(
        <span className="h-8 w-8 bg-lightsuccess rounded-full flex justify-center items-center">
           <Icon icon="solar:water-sun-outline" className=" text-success" height={20} />
        </span>,
      );
    } else {
      setGreeting('Good Night');
      setGreetingIcon(
        <span className="h-8 w-8 bg-dark/40 dark:bg-white/20  rounded-full flex justify-center items-center">
          <Icon icon="solar:moon-outline" className=" text-dark dark:text-white" height={20} />
        </span>,
      );
    }
  }, []);

  return (
    <>
      <CardBox>
        <div className="flex flex-col gap-8">
          <div>
            <h5 className="card-title flex items-center gap-3">
              {greeting}, Mike
              {GreetingIcon}
            </h5>
            <p className="card-subtitle">Welcome to SpikeAdmin!</p>
          </div>
          <div>
            <Button as={Link} to={'/apps/user-profile/profiletwo'} className='w-fit' color={'primary'}>Visit Now</Button>
          </div>
        </div>
        <img src={bg} className="md:absolute -end-3 bottom-0 rtl:transform rtl:scale-x-[-1]" alt="image" />
      </CardBox>
    </>
  );
};

export default VisitNow;
