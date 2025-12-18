// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import EcommerceShop from 'src/components/apps/ecommerce/productGrid2';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';





const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Shop 2',
  },
];
const Ecommerce2 = () => {


  return (
    <>
        <BreadcrumbComp title="Shop App 2" items={BCrumb} />
        <EcommerceShop />
    </>

  );
};

export default Ecommerce2;
