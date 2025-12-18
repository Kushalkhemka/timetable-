import { Button, Dropdown, DropdownItem } from 'flowbite-react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import CardBox from 'src/components/shared/CardBox';
import Chart from 'react-apexcharts';
import { Icon } from '@iconify/react';
const ProfitExpense = () => {
  const dropdownItems = ['Action', 'Another action', 'Something else'];

  const ChartData: any = {
    series: [
      {
        name: 'Profit',
        data: [60, 40, 37, 35, 35, 20, 30, 20],
      },
      {
        name: 'Expenses',
        data: [15, 30, 15, 35, 25, 30, 30, 40],
      },
    ],
    labels: ['2024', '2023', '2022'],
    chart: {
      height: 300,
      stacked: true,
      type: 'bar',
      fontFamily: 'inherit',
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
    },
    colors: ['var(--color-primary)', 'var(--color-info)'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '27%',
        borderRadius: 6,
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
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      padding: { top: 0, bottom: -8, left: 20, right: 20 },
    },
    xaxis: {
      categories: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'March'],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      max: 80,
      tickAmount: 4, // (80 - 0) / 20 = 4 intervals
      labels: {
        formatter: function (val: number) {
          return val.toFixed(0);
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      theme: 'dark',
      fillSeriesColor: false,
      y: {
        formatter: function (value: number) {
          return `$${value.toLocaleString()}K`;
        },
      },
    },
  };

  const stats = [
    {
      title: '$63,489.50',
      subtitle: 'Profit',
      color: 'primary',
      profit: false,
      icon: 'solar:graph-new-up-bold',
    },
    {
      title: '$48,820.00',
      subtitle: 'Expenses',
      color: 'error',
      profit: true,
      icon: 'solar:pie-chart-2-bold',
    },
    {
      title: '$103,582.50',
      subtitle: 'Overall earnings',
      color: 'success',
      profit: false,
      icon: 'solar:archive-up-minimlistic-bold',
    },
  ];
  return (
    <>
      <CardBox>
        <div className="flex justify-between align-baseline">
          <h5 className="card-title">Profit & Expenses</h5>
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

        <div className="grid grid-cols-12 gap-6">
          <div className="md:col-span-8 col-span-12">
            <div className="mt-3 rounded-bars -ms-3">
              <Chart
                options={ChartData}
                series={ChartData.series}
                type="bar"
                height="300px"
                width="100%"
              />
            </div>
          </div>
          <div className="md:col-span-4 col-span-12  pt-8 pe-4">
            <div className="flex flex-col gap-7">
              {stats.map((item, index) => (
                <div className="flex items-center justify-between" key={index}>
                  <div className="items-center gap-4">
                    <p className="font-medium text-sm">{item.subtitle}</p>
                    <h5 className="text-22 flex gap-2 items-baseline">{item.title} </h5>

                    {/*  */}
                  </div>

                  <div
                    className={`h-10 w-10 rounded-full flex justify-center items-center bg-light${item.color}`}
                  >
                    <Icon icon={item.icon} className={`text-${item.color}`} height="22" />
                  </div>
                </div>
              ))}
              <Button color={'primary'}>View Full Report</Button>
            </div>
          </div>
        </div>
      </CardBox>
    </>
  );
};

export default ProfitExpense;
