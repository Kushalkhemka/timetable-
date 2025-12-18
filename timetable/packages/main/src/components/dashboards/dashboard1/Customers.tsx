import { Badge } from 'src/components/shadcn-ui/Default-Ui/badge';
import CardBox from 'src/components/shared/CardBox';
import Chart from 'react-apexcharts';

const Customers = () => {
  const ChartData: any = {
    series: [
      {
        name: 'Customers',
        color: 'var(--color-primary)',
        data: [25, 66, 20, 40, 12, 30],
      },
    ],
    chart: {
      fontFamily: `inherit`,
      type: 'area',
      height: 103,
      sparkline: {
        enabled: true,
      },
      group: 'sparklines',
    },

    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0,
        inverseColors: false,
        opacityFrom: 0.05,
        opacityTo: 0,
        stops: [20, 180],
      },
    },

    markers: {
      size: 0,
    },
    tooltip: {
      theme: "dark",
      fillSeriesColor: false,
    },
  };
  return (
    <>
      <CardBox>
        <div className="flex justify-between align-baseline">
          <div>
            <h5 className="card-title">Customers</h5>
            <p className="card-subtitle">Last 7 Days</p>
          </div>
          <div className="text-end">
            <h5 className="card-title">6,380</h5>
            <Badge variant="outlineSuccess" className="bg-lightsuccess">
              +28.5%
            </Badge>
          </div>
        </div>
        <div className="my-11 rounded-circle" >
          <Chart
            options={ChartData}
            series={ChartData.series}
            type="area"
            height="103px"
            width="100%"
          />
        </div>
        <div className="flex gap-3 justify-between items-center font-medium">
          <p>April 07 - April 14</p> 6,380
        </div>
        <div className="flex gap-3 justify-between items-center font-medium">
          <p>Last Week</p> 4,298
        </div>
      </CardBox>
    </>
  );
};

export default Customers;
