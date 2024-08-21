import React, { Fragment, useEffect } from "react";
import Router, { useRouter } from "next/router";
import { wrapper } from "../store";

// types
import type { AppProps } from "next/app";

// global styles
import "swiper/swiper.scss";
import "rc-slider/assets/index.css";
import "react-rater/lib/react-rater.css";
import "../assets/css/styles.scss";
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
  }, [pathname, router]);
  return (
    <Fragment>
      <Component {...pageProps} />
    </Fragment>
  );
};

export default wrapper.withRedux(MyApp);
