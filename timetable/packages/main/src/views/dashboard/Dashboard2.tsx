import ColorBox from 'src/components/dashboards/dashboard2/ColorBox';
import DeveloperCard from 'src/components/dashboards/dashboard2/DeveloperCard';
import FigmaCard from 'src/components/dashboards/dashboard2/FigmaCard';
import NewGoal from 'src/components/dashboards/dashboard2/NewGoal';
import ProductSales from 'src/components/dashboards/dashboard2/ProductSales';
import ProfitExpense from 'src/components/dashboards/dashboard2/ProfitExpense';
import TopEmployee from 'src/components/dashboards/dashboard2/TopEmployee';
import TrafficDistribution from 'src/components/dashboards/dashboard2/TrafficDistribution';
import UpcommingSchedule from 'src/components/dashboards/dashboard2/UpcommingSchedule';
import VisitNow from 'src/components/dashboards/dashboard2/VisitNow';
import Toaster from '../toaster';

const Dashboard2 = () => {
  return (
    <>
      <Toaster />
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-6 col-span-12">
          <VisitNow />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <ColorBox />
        </div>
        <div className="lg:col-span-8 col-span-12">
          <ProfitExpense />
        </div>
        <div className="lg:col-span-4 col-span-12">
          <ProductSales />
        </div>
        <div className="lg:col-span-3 col-span-12">
          <NewGoal />
          <div className="mt-6">
            <DeveloperCard />
          </div>
        </div>
        <div className="lg:col-span-6 col-span-12">
          <TrafficDistribution />{' '}
        </div>
        <div className="lg:col-span-3 col-span-12">
          <FigmaCard />
        </div>
        <div className="lg:col-span-4 col-span-12">
          <UpcommingSchedule />
        </div>
        <div className="lg:col-span-8 col-span-12">
          <TopEmployee />
        </div>
      </div>
    </>
  );
};

export default Dashboard2;
