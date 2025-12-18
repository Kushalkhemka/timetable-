import { Badge } from 'src/components/shadcn-ui/Default-Ui/badge';
import CardBox from 'src/components/shared/CardBox';
import Chart from 'react-apexcharts';
import { IconCircle } from '@tabler/icons-react';

const ProfitCard = () => {
  const ChartData: any = {
    color: '#adb5bd',
    series: [70, 18, 12],
    labels: ['2025', '2024', '2023'],
    chart: {
      height: 160,
      type: 'donut',
      fontFamily: 'inherit',
      foreColor: '#adb0bb',
    },
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '85%',
        },
      },
    },
    stroke: {
      show: true,
      colors: 'var(--color-surface-ld)',
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    colors: ['var(--color-primary)', 'var(--color-error)', 'var(--color-info)'],

    tooltip: {
      theme: 'dark',
      fillSeriesColor: false,
    },
  };
  return (
    <>
      <CardBox>
        <div className="flex justify-between align-baseline">
          <div>
            <h5 className="card-title">Profit</h5>
            <p className="card-subtitle">Years</p>
          </div>
          <div className="text-end">
            <h5 className="card-title">432</h5>
            <Badge variant="outlineSuccess" className="bg-lightsuccess">
              +26.5%
            </Badge>
          </div>
        </div>
        <div className="my-2">
          <Chart
            options={ChartData}
            series={ChartData.series}
            type="donut"
            height="160px"
            width="100%"
          />
        </div>
        <div className="mx-auto">
          <div className="flex gap-4">
            <div className="flex gap-1 items-center text-xs text-info">
              <IconCircle size={12} className="text-info" /> 2023
            </div>
            <div className="flex gap-1 items-center text-xs text-error">
              <IconCircle size={12} className="text-error" /> 2024
            </div>
            <div className="flex gap-1 items-center text-xs text-primary">
              <IconCircle size={12} className="text-primary" /> 2025
            </div>
          </div>
        </div>
      
      </CardBox>
    </>
  );
};

export default ProfitCard;
