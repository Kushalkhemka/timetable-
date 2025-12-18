import { Button, Alert, Pagination } from 'flowbite-react';
import { useState, useContext, SetStateAction, Dispatch } from 'react';
import ProductSearch from './ProductSearch';
import NoProduct from '/src/assets/images/backgrounds/empty-shopping-cart.svg';
import { Link } from 'react-router';
import { ProductContext } from 'src/context/Ecommercecontext';
import CardBox from 'src/components/shared/CardBox';
import { IconBasket, IconHeart, IconStar } from '@tabler/icons-react';
import { Icon } from '@iconify/react';
type ShopProps = {
  openShopFilter: Dispatch<SetStateAction<boolean>>;
};

const ProductList = ({ openShopFilter }: ShopProps) => {
  const { filteredAndSortedProducts, addToCart, filterReset } = useContext(ProductContext);
  const [cartAlert, setCartAlert] = useState(false);
  const handleClick = () => {
    setCartAlert(true);
    setTimeout(() => {
      setCartAlert(false);
    }, 3000);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const onPageChange = (page: number) => setCurrentPage(page);

  return (
    <>
      {/* Search Products */}
      <ProductSearch onClickFilter={() => openShopFilter(true)} />
      <div className="grid grid-cols-12 gap-6 mt-6">
        {filteredAndSortedProducts.length > 0 ? (
          filteredAndSortedProducts.map((product) => (
            <div className="xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12" key={product.id}>
              <CardBox className="p-0 overflow-hidden group card-hover !shadow-none !rounded-none">
                <div className="relative">
                  <Link to={`/apps/ecommerce/detail-two/${product.id}`}>
                    <div className="overflow-hidden h-[285px] w-full rounded-lg">
                      <img
                        src={product.photo}
                        alt="Spike"
                        height={285}
                        width={500}
                        className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-110"
                      />
                    </div>
                  </Link>
                  <div className="pt-3">
                    <div className="flex justify-between items-center  absolute top-4 -end-full group-hover:end-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out ">
                      <div className="flex gap-3">
                        <div className="group/icon">
                          <Button
                            color={''}
                            className="ms-auto p-0 w-9 h-9 rounded-full! bg-white dark:bg-dark   group-hover/icon:bg-primary  dark:group-hover/icon:bg-primary"
                          >
                            <IconHeart
                              className="text-dark dark:text-white group-hover/icon:text-white"
                              size={20}
                            />
                          </Button>
                        </div>
                        <div className="group/icon">
                          <Button
                            color={''}
                            className=" ms-auto p-0 w-9 h-9 rounded-full! bg-white dark:bg-dark   group-hover/icon:bg-primary  dark:group-hover/icon:bg-primary"
                            onClick={() => {
                              addToCart(product.id);
                              handleClick();
                            }}
                          >
                            <IconBasket
                              className="text-dark dark:text-white group-hover/icon:text-white"
                              size={20}
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <h6 className="text-17 line-clamp-1 group-hover:text-primary">
                      {product.title}
                    </h6>
                    <p className="flex gap-2 font-medium py-1 items-center">
                      <IconStar className="text-warning" size={16} />
                      <b className="text-ld">{product.star}</b> ({product.totalstar})
                    </p>
                    <div className="flex justify-between items-center">
                      <h5 className="text-base flex gap-2 items-center ">
                        ${product.price}
                        <span className="text-sm text-darklink dark:text-bodytext line-through font-medium">
                          ${product.salesPrice}
                        </span>
                      </h5>
                    </div>
                  </div>
                </div>
              </CardBox>
            </div>
          ))
        ) : (
          <>
            <div className="col-span-12">
              <div className="flex justify-center text-center">
                <div>
                  <img src={NoProduct} alt="no product" height={400} />
                  <h2 className="text-2xl">There is no Product</h2>
                  <p className="text-darklink dark:text-bodytext my-3">
                    The product you are searching for is no longer available.
                  </p>
                  <Button color={'primary'} className="w-fit px-4 mx-auto" onClick={filterReset}>
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex justify-end w-full mt-8 pt-4 border-t border-ld">
        <div className="overflow-x-auto  ">
          <Pagination currentPage={currentPage} totalPages={2} onPageChange={onPageChange} />
        </div>
      </div>
      {cartAlert && (
        <Alert color="primary" rounded className="fixed top-3 start-0 end-0 mx-auto w-fit z-9999">
          <span className="flex gap-3">
            <Icon icon="solar:cart-large-4-bold" height="25" /> Item Added to the Cart!!!
          </span>
        </Alert>
      )}
    </>
  );
};
export default ProductList;
