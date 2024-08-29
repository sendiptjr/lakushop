import Layout from "../layouts/Main";
import PageIntro from "../components/page-intro";
import ProductsFeatured from "../components/products-featured";
import Footer from "../components/footer";
// import Subscribe from '../components/subscribe';
import { useEffect, useState } from "react";
import axios from "./../config/axiosConfig";
import { useDispatch } from "react-redux";
import { resetUser, setUserLogged } from "store/reducers/user";
import { resetCart, setCountCart } from "store/reducers/cart";
import Header from "components/header";
import {
  logEvent,
  Analytics,
  getAnalytics,
  setUserProperties,
  setUserId,
} from "firebase/analytics";
import FirebaseAnalytics from "./../firebase";
import Modal from "components/modal";
import { trackingAnalytics } from "utils/helper";
import { resetTransaction } from "store/reducers/transaction";
// import { useRouter } from "next/router";
// import moment from "moment";

const IndexPage = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  //const router = useRouter();
  //const pathname = router.pathname;
  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("token");
      if (data !== null && window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(data);
      }
      dispatch(setCountCart(0));
      if (data != null) {
        fetchInfo();
      }
    }
  }, []);

  // useEffect(() => {
  //   // Daftar rute yang diizinkan
  //   const allowedPaths = ['/', '/transaction', '/profile', '/cart', '/products/', '/transaction/detail', '/cart/checkout'];

  //   // Logika untuk memeriksa apakah pathname ada dalam daftar yang diizinkan
  //   const isAllowed = allowedPaths.some(path => pathname === path || pathname.startsWith(path));

  //   if (!isAllowed) {
  //     router.push('/404');
  //   }
  // }, [pathname, router]);
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const data = localStorage.getItem("date");
  //     const date = moment(new Date()).format("YYYY-MM-DD");
  //     if (data != date) {
  //       setShowModal(true);
  //       localStorage.setItem("date", date);
  //     }
  //   }
  // }, []);
  const sendAnalyticsEvent = async () => {
    // Get the analytics instance from the dynamic import
    const analyticsInstance = await getAnalytics(FirebaseAnalytics);

    // Ensure that analyticsInstance is not null
    if (analyticsInstance) {
      // Use type assertion to inform TypeScript that analyticsInstance is not null
      const analytics: Analytics = analyticsInstance;

      // Log the event
      logEvent(analytics, "page_view_homepage");
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      sendAnalyticsEvent();
    }
  }, []);
  


  const fetchInfo = async () => {
    try {
      const resp = await axios.get("user/api/profile");
      const analyticsInstance = await getAnalytics(FirebaseAnalytics);

      // Ensure that analyticsInstance is not null
      if (analyticsInstance) {
        // Use type assertion to inform TypeScript that analyticsInstance is not null
        const analytics: Analytics = analyticsInstance;
        setUserId(analytics, resp?.data?.data?.email);
        setUserProperties(analytics, {
          email: resp?.data?.data?.email,
        });
        setUserProperties(analytics, {
          Gender:
            resp?.data?.data?.gender === "p"
              ? "Perempuan"
              : resp?.data?.data?.gender === ""
              ? "-"
              : "Laki-laki",
        });

        trackingAnalytics(
          `page_view_homepage`,
          resp?.data?.data?.first_name,
          resp?.data?.data?.email
        );
        // Log the event
      }

      dispatch(setUserLogged(resp?.data?.data));
      const res = await axios.get("transaction/api/cart/total_item");
      dispatch(setCountCart(res?.data?.data));
    } catch (error) {
      localStorage.removeItem("token");
      dispatch(setUserLogged(null));
      dispatch(resetCart());
      dispatch(resetTransaction());
      dispatch(resetUser());
    }
  };

  return (
    <Layout>
      <Header showLogin={showLogin}/>
      <PageIntro />

      {/* <section className="featured">
        <div className="container">
          <article style={{backgroundImage: 'url(https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//98/MTA-83909113/lakuemas_lakuemas_elite_bundle_12_full01_o0to2sep.jpg)'}} className="featured-item featured-item-large">
            <div className="featured-item__content">
              <h3>New arrivals are now in!</h3>
              <a href="#" className="btn btn--rounded">Show Collection</a>
            </div>
          </article>
          
          <article style={{backgroundImage: 'url(https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//103/MTA-83908730/lakuemas_lakuemas_elite_bundle_06_full01_qqegx1be.jpg)'}} className="featured-item featured-item-small-first">
            <div className="featured-item__content">
              <h3>Voucher Elite</h3>
              <a href="#" className="btn btn--rounded">More details</a>
            </div>
          </article>
          
          <article style={{backgroundImage: 'url(https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//106/MTA-88710657/antam_paket_bundling_antam_25_gram-_voucher_250k_full01_fca0d2gg.jpg)'}} className="featured-item featured-item-small">
            <div className="featured-item__content">
              <h3>Sale Products</h3>
              <a href="#" className="btn btn--rounded">VIEW ALL</a>
            </div>
          </article>
        </div>
      </section> */}

      {/* <section className="section">
        <div className="container">
          <header className="section__intro">
            <h4>Why should you choose us?</h4>
          </header>

          <ul className="shop-data-items">
            <li>
              <i className="icon-shipping"></i>
              <div className="data-item__content">
                <h4>Free Shipping</h4>
                <p>All purchases over $199 are eligible for free shipping via USPS First Class Mail.</p>
              </div>
            </li>
            
            <li>
              <i className="icon-payment"></i>
              <div className="data-item__content">
                <h4>Easy Payments</h4>
                <p>All payments are processed instantly over a secure payment protocol.</p>
              </div>
            </li>
            
            <li>
              <i className="icon-cash"></i>
              <div className="data-item__content">
                <h4>Money-Back Guarantee</h4>
                <p>If an item arrived damaged or you've changed your mind, you can send it
                back for a full refund.</p>
              </div>
            </li>
            
            <li>
              <i className="icon-materials"></i>
              <div className="data-item__content">
                <h4>Finest Quality</h4>
                <p>Designed to last, each of our products has been crafted with the finest materials.</p>
              </div>
            </li>
          </ul>
        </div>
      </section> */}

      <ProductsFeatured />
      {/* <Subscribe /> */}
      <Modal
        isOpen={showModal}
        transparant={true}
        onClose={() => setShowModal(false)}
      >
        <img
          src={"https://images.tokopedia.net/img/unify/il_footer_hd_v2.png"}
          alt=""
        />
      </Modal>
      <Footer showLogin={() => setShowLogin(true)}/>

    </Layout>
  );
};

export default IndexPage;
