import { useEffect, useState } from "react";
import ProductItem from "./../../product-item";
import PropTypes from "prop-types";
// import Swiper core and required components
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "./../../../config/axiosConfig";
const isMobileMidle = typeof window !== "undefined" && window.innerWidth <= 760;
let slidesPerView = isMobileMidle ? 2 : 1.3;
let centeredSlides = false;
let spaceBetween = 30;
if (process.browser) {
  if (window.innerWidth > 500 && window.innerWidth < 600) {
    slidesPerView = 1.7;
    spaceBetween = 20;
    centeredSlides = false;
  }
  if (window.innerWidth > 600 && window.innerWidth < 650) {
    slidesPerView = 1.5;
    spaceBetween = 20;
    centeredSlides = false;
  }
  if (window.innerWidth > 768) {
    slidesPerView = 3;
    spaceBetween = 35;
    centeredSlides = false;
  }
  if (window.innerWidth > 1024) {
    slidesPerView = 4;
    spaceBetween = 65;
    centeredSlides = false;
  }
  if (window.innerWidth > 2000) {
    slidesPerView = 4;
    spaceBetween = 150;
    centeredSlides = false;
  }
}

const ProductsCarousel = ({ products }: any) => {
  const [dataProduct, setProduct] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchProduct();
    }
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`product/api/list`);
      setProduct(res?.data?.data);
    } catch (error) {}
  };

  if (!products) return <div>Loading</div>;

  return (
    <div className="products-carousel">
      <Swiper
        spaceBetween={spaceBetween}
        loop={false}
        centeredSlides={centeredSlides}
        watchOverflow={false}
        slidesPerView={slidesPerView}
        className="swiper-wrapper"
      >
        {dataProduct?.map((item: any) => (
          <SwiperSlide key={item.id}>
         
<ProductItem
              id={item.id}
              name={item.name}
              price={item.price}
              discount={item.discount}
              currentPrice={item.current_price}
              key={item.id}
              images={item.img_thumbnail}
              data={item}
              type={undefined}
            />
         
            
        </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
ProductsCarousel.propTypes = {
  products: PropTypes.array.isRequired,
};
export default ProductsCarousel;
