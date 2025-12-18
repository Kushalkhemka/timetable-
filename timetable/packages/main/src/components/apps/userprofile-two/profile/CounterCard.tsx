import CardBox from 'src/components/shared/CardBox';
import { Icon } from '@iconify/react';
const CounterCard = () => {
  const OtherData = [
    {
      icon: 'tabler:template',
      title: '680',
      subtitle: 'Tasks Done',
      color: 'primary',
    },
    {
      icon: 'tabler:layout-grid-add',
      title: '42',
      subtitle: 'Projects',
      color: 'success',
    },
    {
      icon: 'tabler:id',
      title: '$780',
      subtitle: 'Sales',
      color: 'error',
    },
  ];
  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        {OtherData.map((item, index) => (
          <div className="md:col-span-4 col-span-12" key={index}>
            <CardBox>
              <div className="flex gap-3 items-center">
                <span
                  className={`h-12 w-12 rounded-full flex items-center justify-center  bg-light${item.color} dark:bg-dark${item.color} text-${item.color}`}
                >
                  <Icon icon={item.icon} height={24} />
                </span>
                <div>
                  <h4 className="text-lg">{item.title}</h4>
                  <p className="font-medium">{item.subtitle}</p>
                </div>
              </div>
            </CardBox>
          </div>
        ))}
      </div>
    </>
  );
};

export default CounterCard;
