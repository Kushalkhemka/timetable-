import { Icon } from '@iconify/react';
import { HR } from 'flowbite-react';
import CardBox from 'src/components/shared/CardBox';

const AboutCard = () => {
  const AboutData = [
    {
      icon: 'tabler:phone',
      title: 'Call',
      subtitle: '(123) 456-7890',
      color: 'error',
    },
    {
      icon: 'tabler:mail',
      title: 'Email',
      subtitle: 'info@spike.com',
      color: 'success',
    },
    {
      icon: 'tabler:brand-skype',
      title: 'Skype',
      subtitle: 'Mike.Nielsen',
      color: 'primary',
    },
  ];

  const OtherData = [
    {
      icon: 'tabler:map-pin',
      title: 'Location',
      subtitle: 'Newyork, USA - 100001',
      color: 'warning',
    },
    {
      icon: 'tabler:school',
      title: 'Education',
      subtitle: 'Saint Josef Institute of Science',
      color: 'success',
    },
    {
      icon: 'tabler:language',
      title: 'Language',
      subtitle: 'English',
      color: 'indigo',
    },
  ];
  return (
    <>
      <CardBox>
        <h5 className="card-title">About me</h5>
        <p className="card-subtitle text-ld">
          Hello, I’m Mike Nielsen. I’m a professional who designs, develops, tests, and maintains
          software applications and systems.
        </p>
        <HR className="my-2" />
        <h5 className="card-title mb-2">Contact</h5>
        <div className="flex flex-col gap-5">
          {AboutData.map((item, index) => (
            <div key={index} className="flex gap-3 items-center">
              <span
                className={`h-10 w-10 rounded-full flex items-center justify-center  bg-light${item.color} dark:bg-dark${item.color} text-${item.color}`}
              >
                <Icon icon={item.icon} height={20} />
              </span>
              <div>
                <h4 className="text-sm">{item.title}</h4>
                <p className="font-medium">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
        <HR className="my-2" />
        <h5 className="card-title mb-2">Other</h5>
        <div className="flex flex-col gap-5">
          {OtherData.map((item, index) => (
            <div key={index} className="flex gap-3 items-center">
              <span
                className={`h-10 w-10 rounded-full flex items-center justify-center  bg-light${item.color} dark:bg-dark${item.color} text-${item.color}`}
              >
                <Icon icon={item.icon} height={20} />
              </span>
              <div>
                <h4 className="text-sm">{item.title}</h4>
                <p className="font-medium">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </CardBox>
    </>
  );
};

export default AboutCard;
