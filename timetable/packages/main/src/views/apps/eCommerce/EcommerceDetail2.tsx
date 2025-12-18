import ProductDetail from '../../../components/apps/ecommerce/productDetails2';
import ProductCarousel from '../../../components/apps/ecommerce/productDetails2/ProductCarousel';
import ProductRelated from '../../../components/apps/ecommerce/productDetails2/ProductRelated';
import CardBox from '../../../components/shared/CardBox';
import { ProductProvider } from '../../../context/Ecommercecontext';
import BreadcrumbComp from '../../../layouts/full/shared/breadcrumb/BreadcrumbComp';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Shop Detail Two',
  },
];

const EcommerceDetail = () => {
  return (
    <>
      <ProductProvider>
        <BreadcrumbComp title="Shop Detail Two" items={BCrumb} />
        {/* Slider and Details of Products */}
        <CardBox>
          <div className="grid grid-cols-12 gap-8">
            <div className="lg:col-span-6 col-span-12">
              <ProductCarousel />
            </div>
            <div className="lg:col-span-6 col-span-12">
              <ProductDetail />
            </div>
          </div>

          {/* Related Products */}
          <ProductRelated />
        </CardBox>
      </ProductProvider>
    </>
  );
};

export default EcommerceDetail;
