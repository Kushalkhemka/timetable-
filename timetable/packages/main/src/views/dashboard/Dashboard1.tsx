import CongratulationCard from 'src/components/dashboards/dashboard1/CongratulationCard';
import Customers from 'src/components/dashboards/dashboard1/Customers';
import EarningCard from 'src/components/dashboards/dashboard1/EarningCard';
import LatestDeal from 'src/components/dashboards/dashboard1/LatestDeal';
import LatestReview from 'src/components/dashboards/dashboard1/LatestReview';
import ProductsTable from 'src/components/dashboards/dashboard1/ProductsTable';
import ProfitCard from 'src/components/dashboards/dashboard1/ProfitCard';
import VisitFromUsa from 'src/components/dashboards/dashboard1/VisitFromUsa';
import Toaster from '../toaster';

const Dashboard1 = () => {
  return (
    <>
      <Toaster />
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-3 col-span-12">
          <EarningCard />
          <div className="mt-6">
            <LatestDeal />
          </div>
        </div>
        <div className="lg:col-span-6 col-span-12">
          <CongratulationCard />
        </div>
        <div className="lg:col-span-3 col-span-12">
          <ProfitCard />
          <div className="mt-6">
            <Customers />
          </div>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <VisitFromUsa />
        </div>
        <div className="lg:col-span-8 col-span-12">
          <ProductsTable />
        </div>
        <div className="col-span-12">
          <LatestReview />
        </div>
      </div>
    </>
  );
};

export default Dashboard1;
