import CardBox from 'src/components/shared/CardBox';
import { Icon } from '@iconify/react';
import { Select } from 'flowbite-react';
import bg from '/src/assets/images/backgrounds/man-working-on-laptop.png';
import Chart from 'react-apexcharts';
const ChartData: any = {
  series: [
    {
      name: '',
      data: [0, 20, 15, 19, 14, 25, 32],
    },
    {
      name: '',
      data: [0, 12, 19, 13, 26, 16, 25],
    },
  ],
  chart: {
    fontFamily: 'inherit',
    foreColor: '#adb0bb',
    height: 250,
    width: '100%',
    type: 'line',
    offsetX: -10,
    toolbar: {
      show: false,
    },
    stacked: false,
  },
  legend: {
    show: false,
  },
  stroke: {
    width: 3,
    curve: 'smooth',
  },
  grid: {
    show: true,
    borderColor: 'rgba(173,181,189,0.2)',
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
    padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
  },
  colors: ['var(--color-primary)', 'var(--color-info)'],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      gradientToColors: ['#6993ff'],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100, 100, 100],
    },
  },
  markers: {
    size: 0,
  },
  xaxis: {
    labels: {
      show: true,
    },
    type: 'category',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
   
    axisBorder: {
      show: false,
    },
  },
  yaxis: {
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    labels: {
      show: true,
      formatter: function (value: string) {
        return value + 'k';
      },
    },

    min: 0,
    max: 32,
    tickAmount: 4,
  },
  tooltip: {
    theme: 'dark',
  },
};

const CongratulationCard = () => {
  const dropdownItems = ['This Weeek', 'April 2025', 'May 2025', 'June 2025'];
  const CongratsData = [
    {
      icon: 'solar:cart-4-line-duotone',
      title: '64 new orders',
      subtitle: 'Processing',
      color: 'success',
    },
    {
      icon: 'solar:pause-line-duotone',
      title: '4 orders',
      subtitle: 'On hold',
      color: 'warning',
    },
    {
      icon: 'solar:bicycling-round-bold-duotone',
      title: '12 orders',
      subtitle: 'Delivered',
      color: 'indigo',
    },
  ];
  return (
    <>
      <CardBox className="!rounded-b-none">
        <div>
          <h5 className="card-title">Congratulations Mike</h5>
          <p className="card-subtitle">You have done 38% more sales</p>
        </div>
        <div className="flex flex-col gap-4 mt-3">
          {CongratsData.map((item, index) => (
            <div key={index} className="flex gap-3 items-center">
              <span
                className={`h-12 w-12 rounded-full flex items-center justify-center  bg-light${item.color} dark:bg-dark${item.color} text-${item.color}`}
              >
                <Icon icon={item.icon} height={24} />
              </span>
              <div>
                <h4 className="text-base">{item.title}</h4>
                <p className="text-darklink">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
        <img src={bg} className="md:absolute md:end-0 bottom-0 md:mb-0 -mb-6 md:me-0 -me-6" alt="image" />
      </CardBox>
      <CardBox className=" !rounded-t-none p-0">
        <div className="border-t border-ld p-6">
          <div className="flex justify-between align-baseline">
            <div>
              <h5 className="card-title">Total Orders</h5>
              <p className="card-subtitle">Weekly Order Updates</p>
            </div>
            <Select required className="form-conterol select-option">
              {dropdownItems.map((items, index) => {
                return <option key={index}>{items}</option>;
              })}
            </Select>
          </div>

          <div className="mt-3 ">
            <Chart
              options={ChartData}
              series={ChartData.series}
              type="line"
              height="250px"
              width="100%"
            />
          </div>
        </div>
      </CardBox>
    </>
  );
};

export default CongratulationCard;
