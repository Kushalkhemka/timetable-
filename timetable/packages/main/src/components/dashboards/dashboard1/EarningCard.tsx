import { Badge } from 'src/components/shadcn-ui/Default-Ui/badge';
import CardBox from 'src/components/shared/CardBox';
import Chart from 'react-apexcharts';
import { IconCircle } from '@tabler/icons-react';
const ChartData: any = {
  series: [
    {
      name: 'Paypal',
      data: [29, 52, 38, 47, 56, 41, 46],
    },
    {
      name: 'Amazon',
      data: [71, 71, 71, 71, 71, 71, 71],
    },
  ],
  chart: {
    type: 'bar',
    fontFamily: 'inherit',
    foreColor: '#adb0bb',
    toolbar: {
      show: false,
    },
    height: 150,
    stacked: true,
  },
  colors: ['var(--color-primary)', '#D9D9D9'],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '26%',
      borderRadius: [3],
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'all',
    },
  },

  stroke: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  grid: {
    show: false,
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  },
  xaxis: {
    categories: [['M'], ['T'], ['W'], ['T'], ['F'], ['S'], ['S']],
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
    x: {
      show: false,
    },
    followCursor: true,
  },
};

const EarningCard = () => {
  return (
    <div>
      <CardBox>
        <div className="flex justify-between align-baseline">
          <div>
            <h5 className="card-title">Earning</h5>
            <p className="card-subtitle">Last 7 days</p>
          </div>
          <div>
            <h5 className="card-title">12,389</h5>
            <Badge variant="outlineWarning" className="bg-lightwarning">
              -3.8%
            </Badge>
          </div>
        </div>

        <div className="mt-3 rounded-bars -ms-4">
          <Chart
            options={ChartData}
            series={ChartData.series}
            type="bar"
            height="150px"
            width="100%"
          />
        </div>
        <div className="flex justify-between">
          <div className="flex gap-3 items-center">
            <IconCircle size={16}  className='text-primary'/> Paypal
          </div>
          52%
        </div>
        <div className="flex justify-between">
          <div className="flex gap-3 items-center">
            <IconCircle size={16}  className='text-secondary/20'/> Amazon
          </div>
         48%
        </div>
      </CardBox>
    </div>
  );
};

export default EarningCard;
