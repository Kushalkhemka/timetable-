


import  { useState, useEffect, useRef, useContext } from "react";
// Carousel slider for product


// Carousel slider data
import SliderData from "./SliderData";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useParams } from "react-router";
import Slider from "react-slick";
import { ProductContext } from "src/context/Ecommercecontext";

const ProductCarousel = () => {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);

  const sliderRef1 = useRef(null);
  const sliderRef2 = useRef(null);

  useEffect(() => {
    setNav1(sliderRef1.current);
    setNav2(sliderRef2.current);
  }, []);

  const { id } = useParams();
  const { products } = useContext(ProductContext);
  // Find the product by Id
  const product = products.find((p) => p.id === Number(id));
  const getProductImage = product ? product.photo : '';

  const settings = {
    focusOnSelect: true,
    infinite: true,
    slidesToShow: 7,
    arrows: false,
    swipeToSlide: true,
    slidesToScroll: 1,
    centerMode: false,
    className: "centerThumb",
    speed: 500,
  };

  return (
    <>
      <div className="product product-details">
        <Slider
          asNavFor={nav2 || undefined}
          ref={sliderRef1}
          arrows={false}
          className="rounded-lg overflow-hidden"
        >
          <img
            src={getProductImage}
            alt="Main Product"
            height={500}
             
          />
          {SliderData.map((items, index) => (
            <div key={index}>
              <img
                src={items.imgPath}
                height={500}
                alt="carousel"
                className="rounded-md"
              />
            </div>
          ))}
        </Slider>
        <Slider
          asNavFor={nav1 || undefined}
          ref={sliderRef2}
          {...settings}
          className="mt-2 product-thumb"
        >
          <div className="cursor-pointer p-2">
            <img
              src={getProductImage}
              alt="Thumbnail"
              width={70}
              height={70}
              className="rounded-full"
            />
          </div>
          {SliderData.map((items, index) => (
            <div key={index} className="cursor-pointer p-2">
              <img
                src={items.imgPath}
                alt={`Thumbnail ${items.id}`}
                width={70}
                height={70}
                className="rounded-full"
              />
            </div>
          ))}
        </Slider >
      </div >
    </>
  );
};

export default ProductCarousel;



