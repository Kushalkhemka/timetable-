import 'flowbite';
import { Button, HR, Rating, RatingStar, Select } from 'flowbite-react';
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle } from 'flowbite-react';
import { useContext, useState } from 'react';
import { useParams } from 'react-router';
import { ProductContext } from 'src/context/Ecommercecontext';
import { ProductType } from 'src/types/apps/eCommerce';
import { IconStar } from '@tabler/icons-react';

const ProductDetail = () => {
  const { products, addToCart } = useContext(ProductContext);
  const { id } = useParams<{ id: string }>();

  // Find product by id
  const product: ProductType | undefined = products.find(
    (prod) => prod.id === parseInt(id as string),
  );

  // States for color selection and quantity
  
  const [count, setCount] = useState<number>(1);

  // Handle color selection


  // Handle quantity change
  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      setCount(count + 1);
    } else {
      setCount(count > 1 ? count - 1 : 1);
    }
  };

  // Handle adding to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, qty: count });
    }
  };

  const dropdownItems = ['Small', 'Medium', 'Large', 'Extra Large'];
  const dropdownItemscolors = ['Red', 'Green', 'Blue', 'Yellow'];

  return (
    <>
      {/* Category */}
      {product ? (
        <>
          <h4 className="text-28 ">{product.title}</h4>
          <div className="flex gap-2 text-lg items-center py-2">
            <IconStar className="text-warning" size={20} />
            <span className="text-ld font-semibold">{product.star}</span>
            <span className="font-medium">({product.totalstar} reviews)</span>
          </div>
          <p className="text-base text-ld font-medium py-1">{product.description}</p>
          {/* Price */}
          <h5 className="text-22 flex gap-2 items-center my-3">
            ${product.price}
            <span className=" text-22 text-darklink dark:text-bodytext line-through font-semibold">
              ${product.salesPrice}
            </span>
          </h5>

          <HR className="my-6" />

          <div className="flex items-center gap-5 mb-5">
            <span className="text-base text-ld font-semibold">Size:</span>

            <Select required className="form-control select-option ms-4 ">
              {dropdownItems.map((items, index) => {
                return <option key={index}>{items}</option>;
              })}
            </Select>
          </div>

          <div className="flex items-center gap-5 mb-5">
            <span className="text-base text-ld font-semibold">Colors:</span>

            <Select required className="form-conterol select-option ">
              {dropdownItemscolors.map((items, index) => {
                return <option key={index}>{items}</option>;
              })}
            </Select>
          </div>

          {/* Qty */}
          <div className="flex items-center gap-10">
            <span className="text-base text-ld font-semibold">QTY:</span>
            <form className="max-w-xs">
              <div className="relative flex items-center ">
                <button
                  type="button"
                  id="decrement-button"
                  data-input-counter-decrement="quantity-input"
                  onClick={() => handleQuantityChange(false)}
                  className="focus:ring-0 focus:outline-hidden border border-ld h-10 min-w-10 rounded-s-md rounded-e-none text-center flex justify-center items-center hover:bg-lightprimary hover:text-primary"
                >
                  <span className="text-3xl -mt-1 block">-</span>
                </button>

                <input
                  type="text"
                  id="quantity-input"
                  data-input-counter
                  aria-describedby="helper-text-explanation"
                  className="rounded-s-none! rounded-e-none! text-center h-10 border-x-0! w-fit max-w-12 border-y border-ld !focus:ring-0 focus:border-ld focus:ring-transparent focus:ring-offset-0 bg-transparent"
                  placeholder="0"
                  required
                  value={count}
                />

                <button
                  type="button"
                  id="increment-button"
                  data-input-counter-increment="quantity-input"
                  onClick={() => handleQuantityChange(true)}
                  className="focus:ring-0 focus:outline-hidden border border-ld h-10 min-w-10 rounded-e-md rounded-s-none text-center flex justify-center items-center  hover:bg-lightprimary hover:text-primary"
                >
                  <span className="text-2xl -mt-1 block">+</span>
                </button>
              </div>
            </form>
          </div>

          <div className="flex gap-4 items-center mb-6 mt-6">
            <Button
              color={'outlineprimary'}
              className="px-6  rounded-full w-2/4"
              size="lg"
              onClick={handleAddToCart}
            >
              Add to Wishlist
            </Button>
            <Button
              color={'primary'}
              className="px-6  rounded-full  w-2/4"
              size="lg"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>

          <HR className="mt-6 mb-0" />

          <Accordion className="!shadow-none " collapseAll>
            <AccordionPanel>
              <AccordionTitle className="focus:ring-0 text-lg !border-b !border-border dark:!border-darkborder !rounded-none bg-transparent dark:bg-transparent hover:bg-transparent dark:hover:bg-transparent px-0">
                Description
              </AccordionTitle>
              <AccordionContent className="px-0">
                <div>
                  <h5 className="text-lg mb-6">
                    Sed at diam elit. Vivamus tortor odio, pellentesque eu tincidunt a, aliquet sit
                    amet lorem pellentesque eu tincidunt a, aliquet sit amet lorem.
                  </h5>
                  <p className="text-sm text-darklink dark:text-bodytext mb-6">
                    Cras eget elit semper, congue sapien id, pellentesque diam. Nulla faucibus diam
                    nec fermentum ullamcorper. Praesent sed ipsum ut augue vestibulum malesuada.
                    Duis vitae volutpat odio. Integer sit amet elit ac justo sagittis dignissim.
                  </p>
                  <p className="text-sm text-darklink dark:text-bodytext">
                    Cras eget elit semper, congue sapien id, pellentesque diam. Nulla faucibus diam
                    nec fermentum ullamcorper. Praesent sed ipsum ut augue vestibulum malesuada.
                    Duis vitae volutpat odio. Integer sit amet elit ac justo sagittis dignissim.
                  </p>
                </div>
              </AccordionContent>
            </AccordionPanel>
            <AccordionPanel>
              <AccordionTitle className="focus:ring-0 text-lg !border-b !border-border dark:!border-darkborder !rounded-none bg-transparent dark:bg-transparent hover:bg-transparent dark:hover:bg-transparent px-0">
                {product.totalstar} reviews
              </AccordionTitle>
              <AccordionContent className='px-0'>
                <div className="flex flex-col gap-4">
                  <div className="bg-lightprimary/50 rounded-lg p-5">
                    <Rating size={'sm'}>
                      <RatingStar filled={true} />
                      <RatingStar filled={true} />
                      <RatingStar filled={true} />
                      <RatingStar filled={true} />
                      <RatingStar filled={false} />
                    </Rating>
                    <h6 className='text-17 py-2'>Brooklyn Simmons</h6>
                    <p className='text-sm text-ld'>`"`We`'`re loving it. This is simply unbelievable! I like it more and more each day because it makes my life a lot easier.`"`</p>
                  </div>
                  <div className="bg-lightprimary/50 rounded-lg p-5">
                    <Rating size={'sm'}>
                      <RatingStar filled={true} />
                      <RatingStar filled={true} />
                      <RatingStar filled={true} />
                      <RatingStar filled={true} />
                      <RatingStar filled={false} />
                    </Rating>
                    <h6 className='text-17 py-2'>Ralph Edwards</h6>
                    <p className='text-sm text-ld'>`"`I`'`d be lost without it. It`'`s incredible. It`'`s is the real deal! Since I invested in it I made over 100,000 dollars profits.`"`</p>
                  </div>
                  <div className="bg-lightprimary/50 rounded-lg p-5">
                    <Rating size={'sm'}>
                      <RatingStar filled={true} />
                      <RatingStar filled={true} />
                      <RatingStar filled={true} />
                      <RatingStar filled={true} />
                      <RatingStar filled={false} />
                    </Rating>
                    <h6 className='text-17 py-2'>Savannah Nguyen</h6>
                    <p className='text-sm text-ld'>`"`I STRONGLY recommend it to EVERYONE interested in running a successful online business!`"`</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </>
      ) : (
        'No product'
      )}
    </>
  );
};

export default ProductDetail;
