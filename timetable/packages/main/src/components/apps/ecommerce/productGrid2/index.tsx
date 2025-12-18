import { Drawer } from 'flowbite-react';
import { useState } from 'react';
import { ProductProvider } from 'src/context/Ecommercecontext';
import CardBox from 'src/components/shared/CardBox';
import ProductFilter from './Productfilter';
import ProductFilterMobile from '../productGrid/ProductFilter';
import ProductList from './ProductList';

const EcommerceShop = () => {
  const [isOpenShop2, setIsOpenShop] = useState(false);
  const handleClose = () => setIsOpenShop(false);

  return (
    <>
      <ProductProvider>
        <ProductFilter />
        <div className="lg:hidden ">
          <Drawer
            open={isOpenShop2}
            onClose={handleClose}
            className="lg:relative lg:translate-none lg:h-auto lg:bg-transparent dark:bg-dark max-w-[250px] w-full lg:z-0"
          >
            <ProductFilterMobile />
          </Drawer>
        </div>

        <CardBox className="p-0 overflow-hidden">
          <div>
            {/* ------------------------------------------- */}
            {/* Right part */}
            {/* ------------------------------------------- */}
            <div className="p-6 w-full">
              <ProductList openShopFilter={setIsOpenShop} />
            </div>
          </div>
        </CardBox>
      </ProductProvider>
    </>
  );
};

export default EcommerceShop;
