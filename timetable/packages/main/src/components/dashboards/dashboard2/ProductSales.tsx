import CardBox from 'src/components/shared/CardBox';
import { Icon } from '@iconify/react';
import { Dropdown, DropdownItem } from 'flowbite-react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import Chart from 'react-apexcharts';
import { Badge } from 'src/components/shadcn-ui/Default-Ui/badge';
const ProductSales = () => {
  const dropdownItems = ['Action', 'Another action', 'Something else'];

  const ChartData: any = {
    series: [
      {
        colors: ['var(--color-primary)'],
        name: 'Product Sales',
        data: [13, 15, 14, 17, 16, 19, 17],
      },
    ],

    chart: {
      height: 240,
      type: 'area',
      fontFamily: 'inherit',
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0,
        inverseColors: false,
        opacityFrom: 0.2,
        opacityTo: 0,
        stops: [20, 180],
      },
    },
    dataLabels: {
      enabled: false,
    },

    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 4,
      strokeWidth: 1,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 5,
      },
    },
    stroke: {
      curve: 'smooth',
      width: '2',
    },
    xaxis: {
      categories: ['2016', '2017', '2018', '2019', '2020', '2021', '2022'],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },

    tooltip: {
      theme: 'dark',
      fillSeriesColor: false,
    },
  };
  return (
    <>
      <CardBox>
        <div className="flex justify-between align-baseline">
          <h5 className="card-title">Product Sales</h5>
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
        <div className="my-3">
          <Chart
            options={ChartData}
            series={ChartData.series}
            type="area"
            height="240px"
            width="100%"
          />
        </div>

        <div className="flex gap-4">
          <div
            className={`h-11 w-11 rounded-full flex justify-center items-center bg-lightprimary`}
          >
            <Icon
              icon="solar:user-circle-outline"
             height={25}
              className="text-primary"
            />
          </div>
          <div>
            <h5 className="text-base flex gap-2">
              36,436{' '}
              <Badge variant="outlineSuccess" className="bg-lightsuccess">
                +12%
              </Badge>
            </h5>
            <p className="text-ld text-sm">New Customer</p>
          </div>
        </div>
      </CardBox>
    </>
  );
};

export default ProductSales;
