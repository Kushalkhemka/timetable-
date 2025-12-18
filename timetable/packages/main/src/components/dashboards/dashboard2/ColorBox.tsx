import { Icon } from '@iconify/react';
import CardBox from 'src/components/shared/CardBox';
import shape1 from '/src/assets/images/backgrounds/top-warning-shape.png';
import shape2 from '/src/assets/images/backgrounds/top-error-shape.png';
import shape3 from '/src/assets/images/backgrounds/top-info-shape.png';
import { useEffect, useState } from 'react';

// Custom hook
const useCounter = (end: number, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const value = start + progress * (end - start);

      setCount(parseFloat(value.toFixed(end % 1 !== 0 ? 1 : 0)));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [end, duration]);

  return count;
};

const ColorBox = () => {
  const stats = [
    {
      title: 235,
      percent: '+23',
      subtitle: 'Sales',
      icon: shape1,
      iconsm: <Icon icon="solar:ruble-linear" width="30" height="30" className="text-white" />,
    },
    {
      title: 356,
      percent: '+8',
      subtitle: 'Refunds',
      icon: shape2,
      iconsm: (
        <Icon
          icon="solar:archive-down-minimlistic-line-duotone"
          width="30"
          height="30"
          className="text-white"
        />
      ),
    },
    {
      title: 280,
      percent: '-3',
      subtitle: 'Earnings',
      icon: shape3,
      iconsm: <Icon icon="solar:dollar-linear" width="30" height="30" className="text-white" />,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        {stats.map((item, index) => {
          const animatedValue = useCounter(item.title); // use custom hook here

          return (
            <div className="md:col-span-4 col-span-12" key={index}>
              <CardBox className="bg-primary dark:bg-primary overflow-hidden relative">
                <div className="flex flex-col gap-11 relative">
                  {item.iconsm}
                  <div>
                    <div className="flex gap-1 items-baseline">
                      <h5 className="font-semibold text-22 text-white">{animatedValue}</h5>
                      <span className="text-white text-xs">{item.percent}%</span>
                    </div>
                    <p className="text-white/80">{item.subtitle}</p>
                  </div>
                </div>
                <img src={item.icon} className="absolute end-0 top-0 z-0 rtl:transform rtl:scale-x-[-1]" alt="image" />
              </CardBox>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ColorBox;
