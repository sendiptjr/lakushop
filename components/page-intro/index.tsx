import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { EffectFade, Navigation, Autoplay } from "swiper";
import { Key, useEffect, useState } from "react";
import axios from "./../../config/axiosConfig";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
SwiperCore.use([EffectFade, Navigation, Autoplay]);

const PageIntro = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setLoading(true);
      fetchSlider();
    }
  }, []);

  const fetchSlider = async () => {
    try {
      const res = await axios.get(`product/api/promo/sliders`);
      setData(res?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <section className="page-intro">
      {loading || data.length === 0 ? (
        <Skeleton className="swiper-wrapper page-intro__slide" />
      ) : (
        <Swiper
          navigation
          effect="cube"
          className="swiper-wrapper"
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          speed={2000}
        >
          {data?.map((item: { image: any }, index: Key | null | undefined) => (
            <SwiperSlide key={index}>
              <div
                className="page-intro__slide"
                style={{
                  backgroundImage: `url(${process.env.URL_ASSET_SLIDER}${item?.image})`,
                }}
              >
                <div className="container">
                  {/* <div className="page-intro__slide__content">
                  <h2 style={{ fontFamily: "Montserrat-SemiBold" }}>
                    {item?.description}
                  </h2>
                  <a
                    href="#"
                    className="btn-shop"
                    style={{ fontFamily: "Montserrat-Semibold" }}
                  >
                    <i className="icon-right"></i>Shop now
                  </a>
                </div> */}
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* <SwiperSlide>
        <div className="page-intro__slide" style={{ backgroundImage: "url('https://www.static-src.com/merchant/uploads/full/104/1701235131364.png')" }}>
            <div className="container">
              <div className="page-intro__slide__content">
                <h2>Make your house into a home</h2>
                <a href="#" className="btn-shop"><i className="icon-right"></i>Shop now</a>
              </div>
            </div>
          </div>
        </SwiperSlide> */}
        </Swiper>
      )}

      {/* <div className="shop-data">
        <div className="container">
          <ul className="shop-data__items">
            <li>
              <i className="icon-shipping"></i>
              <div className="data-item__content">
                <h4>Free Shipping</h4>
                <p>On purchases over $199</p>
              </div>
            </li>
            
            <li>
              <i className="icon-shipping"></i>
              <div className="data-item__content">
                <h4>99% Satisfied Customers</h4>
                <p>Our clients' opinions speak for themselves</p>
              </div>
            </li>
            
            <li>
              <i className="icon-cash"></i>
              <div className="data-item__content">
                <h4>Originality Guaranteed</h4>
                <p>30 days warranty for each product from our store</p>
              </div>
            </li>
          </ul>
        </div>
      </div> */}
    </section>
  );
};

export default PageIntro;
