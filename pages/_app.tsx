import React, { Fragment, useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { wrapper } from "../store";

// types
import type { AppProps } from "next/app";

// global styles
import "swiper/swiper.scss";
import "rc-slider/assets/index.css";
import "react-rater/lib/react-rater.css";
import "../assets/css/styles.scss";
import Modal from "components/modal";
//import * as gtag from './../utils/gtag';
const isProduction = process.env.NODE_ENV === "production";

// only events on production
if (isProduction) {
  // Notice how we track pageview when route is changed
  Router.events.on("routeChangeComplete", () => {});
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const pathname = router.pathname;
  const [modal, showModal] = useState<boolean>(false)
  useEffect(() => {
    // Daftar rute yang diizinkan
    const allowedPaths = [
      "/",
      "/transaction",
      "/profile",
      "/cart",
      "/products/",
      "/transaction/detail",
      "/cart/checkout",
    ];

    // Logika untuk memeriksa apakah pathname ada dalam daftar yang diizinkan
    const isAllowed = allowedPaths.some(
      (path) => pathname === path || pathname.startsWith(path)
    );

    if (!isAllowed) {
      router.push("/404");
    }
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if(!/mobile/i.test(userAgent)){
     router.push('/info')
    }
  
  }, [pathname, router]);

  return (
    <>
  
      <Fragment>
      
      <Component {...pageProps} />
    </Fragment>
    {/* <Modal
        isOpen={modal}
        transparant={true}
        onClose={() => showModal(false)}
      >
        <div className="bg-white p-8 rounded-md items-center flex flex-col justify-center content-center">
          <h1>Feature hanya bisa digunakan pada Mobile Device</h1>
          <h1>Silahkan akses dari mobile browser</h1>
        </div>
      </Modal> */}
    </>
   
  );
};

export default wrapper.withRedux(MyApp);
