import { Dropdown, DropdownItem } from 'flowbite-react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import CardBox from 'src/components/shared/CardBox';
import Chart from 'react-apexcharts';
import { IconCircle } from '@tabler/icons-react';
const TrafficDistribution = () => {
  const dropdownItems = ['Action', 'Another action', 'Something else'];

  const ChartData: any = {
    series: [5368, 3319, 3500, 4106],
    labels: ['Others', 'Direct Traffic', 'Refferal Traffic', 'Oragnic Traffic'],
    chart: {
      height: 270,
      type: 'donut',
      fontFamily: 'inherit',
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
    },
    colors: ['#E7ECF0', 'var(--color-warning)', 'var(--color-error)', 'var(--color-primary)'],
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          background: 'none',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '18px',
              color: undefined,
              offsetY: 5,
            },
            value: {
              show: false,
              color: '#98aab4',
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    legend: {
      show: false,
    },

    tooltip: {
      theme: 'dark',
      fillSeriesColor: false,
    },
  };

  
  const stats = [
    {
      title: "4,106",
      subtitle: "Oragnic Traffic",
      color: 'primary',
      profit: true,
    },
    {
      title: "3,500",
      subtitle: "Refferal Traffic",
      color: 'error',
      profit: false,
    },
    {
      title: "3,319",
      subtitle: "Direct Traffic",
      color: 'warning',
      profit: false,
    },
    {
      title: "5,368",
      subtitle: "Other",
      color: 'secondary',
      profit: false,
    },
  ];

  return (
    <div>
      <CardBox>
        <div className="flex justify-between align-baseline">
          <h5 className="card-title">Traffic Distribution</h5>
          <div>
            <Dropdown
              label=""
              dismissOnClick={false}
              renderTrigger={() => (
                <span className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-lightprimary hover:text-primary cursor-pointer">
                  <HiOutlineDotsVertical size={22} />
                </span>
              )}
            >
              {dropdownItems.map((items, index) => {
                return <DropdownItem key={index}>{items}</DropdownItem>;
              })}
            </Dropdown>
          </div>
        </div>
        <div className="flex md:flex-row flex-col gap-6 md:items-center mt-6">
          <div>
            <Chart
              options={ChartData}
              series={ChartData.series}
              type="donut"
              height="270px"
              width="100%"
            />
          </div>
          <div>
            <div className='flex flex-col gap-6'>
                {stats.map((item, index) => (
                <div className='flex gap-2 ' key={index}>

                     <IconCircle size={20} className={` text-${item.color} `}/>
                     <div>
                        <h6 className='text-base'>{item.title} {item.profit ? <span className="text-xs text-success">+23%</span> : ''}</h6>
                        <p className='text-sm font-medium'>{item.subtitle}</p>
                     </div>
                </div>
                ))}
               
            </div>
          </div>
        </div>
      </CardBox>
    </div>
  );
};

export default TrafficDistribution;
