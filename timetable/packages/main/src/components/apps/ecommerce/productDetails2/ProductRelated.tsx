import { Button } from 'flowbite-react';
import { Link } from 'react-router';
import ProductsData from 'src/api/eCommerce/ProductsData';
import CardBox from 'src/components/shared/CardBox';
import { IconHeart } from '@tabler/icons-react';
import { IconBasket } from '@tabler/icons-react';
import { IconStar } from '@tabler/icons-react';
const ProductRelated = () => {
  return (
    <>
      <div className="mt-10">
        <h5 className="text-xl">You might also like</h5>
        <div className="grid grid-cols-12 gap-5 mt-8">
          {ProductsData.map((product) => (
            <>
              {product.related == true ? (
                <div className="lg:col-span-3 md:col-span-6 col-span-12" key={product.id}>
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
              ) : null}
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductRelated;
