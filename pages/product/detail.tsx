import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Footer from "../../components/footer";
import Layout from "../../layouts/Main";
import Breadcrumb from "../../components/breadcrumb";
import ProductsFeatured from "../../components/products-featured";
import Gallery from "../../components/product-single/gallery";
import Content from "../../components/product-single/content";
import Description from "../../components/product-single/description";
import axios from "./../../config/axiosConfig";
import RegisterPage from "pages/register";
import LoginPage from "pages/login";
import { useDispatch, useSelector } from "react-redux";
import { setCountCart, setSuccessCart } from "store/reducers/cart";
import Modal from "components/modal";
import Header from "components/header";
import { useForm } from "react-hook-form";
import CodeVerification from "./../../components/code-verification";
import { trackingAnalytics, trackingAnalyticsPurchase } from "utils/helper";
import { RootState } from "store";
import { GoInfo } from "react-icons/go";

const Product = () => {
  const [show, setShow] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showModalForgetPassword, setShowForgetPassword] = useState(false);
  const [showBlock] = useState("description");
  const [product, setProduct] = useState<any>(null);
  const route = useRouter();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showModalRegister, setShowModalRegister] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  const [seconds, setSeconds] = useState(60);
  const [laoding, setLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const [error, setError] = useState("");
  const onSubmit = async () => {
    setShowCode(!showCode);
  };
  useEffect(() => {
    if(route?.query?.id != undefined){
      const fetchProduct = async () => {
        try {
          const res = await axios.get(`product/api/list/${route?.query?.id}`);
         
          setProduct(res?.data?.data);
       
          trackingAnalytics(`page_view_product || ${res?.data?.data?.name}`, user?.first_name, user?.email);
        } catch (error) {
          
          route.push('/404')
        }
      };
      fetchProduct();
    }
   
   
    
  }, [route?.query?.id]);


  useEffect(() => {
    let intervalId: any;

    if (showCode) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 1) {
            clearInterval(intervalId);
            // You can add additional logic here when the timer reaches 0
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [showCode]);

  const addToCart = async (qty: any, id: any) => {
    const userToken = localStorage.getItem("token");
    if (userToken) {
      setLoading(true);
      try {
        const data = {
          product_id: id,
          qty: qty,
        };
        await axios.post(`transaction/api/cart/add_to_cart`, data);
        dispatch(setSuccessCart(true));
        const resp = await axios.get("transaction/api/cart/total_item");
        const params10 = {
          transaction_id: id,
          currency: 'IDR',
          value: product?.current_price,
          items: data,
        };
        trackingAnalyticsPurchase('add_to_cart', params10)
        setLoading(false);
        dispatch(setCountCart(resp?.data?.data));
      } catch (error: any) {
        setError(error?.res?.data?.error);
        setLoading(false);
        setShow(true);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <Layout>
       <Modal isOpen={show} onClose={() => setShow(false)}>
        <div className="flex items-center flex-col">
          <GoInfo size={50} color="#E0BF4B" />
          <h1 className="my-4 mx-4 text-center">{error ? error : `Telah terjadi kesalahan, Silahkan mencoba beberapa saat lagi.`}</h1>
          <div onClick={() => setShow(false)} className=" cursor-pointer btn bg-[#E0BF4B] p-2 rounded-md">
            <h1>OK</h1>
          </div>
        </div>
      </Modal>
      <Header showLogin={showLogin} />
      <Breadcrumb />

      <div className="main-detail" style={{position: 'static'}}>
        <section className="product-single">
          <div className="container">
            <div className="product-single__content">
              <Gallery images={product} />
              <Content
                loading={laoding}
                product={product}
                addToCart={(qty: any, id: any) => addToCart(qty, id)}
              />
            </div>

            <div className="product-single__info">
              <div className="product-single__info-btns">
               
                {/* <button
                  style={{ fontFamily: "Montserrat-Semibold" }}
                  type="button"
                  onClick={() => setShowBlock("reviews")}
                  className={`btn btn--rounded ${
                    showBlock === "reviews" ? "btn--active" : ""
                  }`}
                >
                  Reviews (2)
                </button> */}
              </div>

              <Description
                show={showBlock === "description"}
                product={product}
              />

              {/* <Reviews product={product} show={showBlock === 'reviews'} /> */}
            </div>
          </div>
        </section>

        <div className="product-single-page">
          <ProductsFeatured />
        </div>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div
          className="scroll-container"
          style={{ display: "flex", overflowY: "scroll", height: 500 }}
        >
          <LoginPage
            handleClose={() => setShowModal(false)}
            showRegister={() => {
              setShowModal(false);
              setShowModalRegister(true);
            }}
            handleForget={() => {
              setShowModal(false);
              setShowForgetPassword(true);
            }}
          />
          </div>
        </Modal>
        <Modal
          isOpen={showModalForgetPassword}
          onClose={() => setShowForgetPassword(false)}
        >
          <div style={{ height: 350, width: 300  }}>
            <div>
              <div
                onClick={() => setShowForgetPassword(false)}
                style={{
                  display: "flex",
                  alignContent: "flex-end",
                  justifyContent: "flex-end",
                  marginBottom: 20,
                }}
              >
                <img src="/images/icons/close.svg" alt="close" />
              </div>
              <h1
                style={{
                  textAlign: "center",
                  marginBottom: 10,
                  fontFamily: "Montserrat-Semibold",
                }}
              >
                Lupa Password
              </h1>
              {showCode ? (
                <div>
                  <CodeVerification length={6} onComplete={(_value) => {}} />
                  <h1
                    style={{
                      textAlign: "center",
                      marginTop: 10,
                      marginBottom: 20,
                      color: "orange",
                    }}
                  >
                    {seconds ? `Timer: ${seconds} seconds` : `Kirim Ulang OTP`}
                  </h1>
                  <div style={{ flexDirection: "column", display: "flex" }}>
                    <button
                      onClick={() => handleSubmit(onSubmit)}
                      type="submit"
                      className="btn btn--rounded btn--yellow btn-submit"
                      style={{ fontFamily: "Montserrat-Semibold" }}
                    >
                      Konfirmasi
                    </button>
                    <button
                      onClick={() => {
                        setShowForgetPassword(false);
                        setShowModal(true);
                      }}
                      // type="submit"
                      className="btn btn--rounded  btn-submit"
                    >
                      <h1
                        style={{
                          color: "#E0BF4B",
                          fontFamily: "Montserrat-Semibold",
                        }}
                      >
                        Kembali ke Login
                      </h1>
                    </button>
                  </div>
                </div>
              ) : (
                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                  <div className="form__input-row">
                    <h1
                      style={{ margin: 10, fontFamily: "Montserrat-Semibold" }}
                    >
                      Nomor HP / Email
                    </h1>
                    <input
                      className="form__input titleDefault"
                      style={{ fontFamily: "Montserrat-Semibold", flex: 1 }}
                      placeholder="Masukkan Nomor HP / Email"
                      type="text"
                      name="email"
                      ref={register({
                        required: true,
                        pattern: /^(?:\d{10,12}|\S+@\S+\.\S+)$/,
                      })}
                    />

                    {errors.email && (
                      <p
                        className="message message--error"
                        style={{ fontFamily: "Montserrat-Semibold" }}
                      >
                        Email or phone number is not valid
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleSubmit(onSubmit)}
                    type="submit"
                    className="btn btn--rounded btn--yellow btn-submit"
                    style={{ fontFamily: "Montserrat-Semibold" }}
                  >
                    Kirim
                  </button>
                  <button
                    onClick={() => {
                      setShowForgetPassword(false);
                      setShowModal(true);
                    }}
                    // type="submit"
                    className="btn btn--rounded  btn-submit"
                  >
                    <h1
                      style={{
                        color: "#E0BF4B",
                        fontFamily: "Montserrat-Semibold",
                      }}
                    >
                      Kembali ke Login
                    </h1>
                  </button>
                </form>
              )}
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={showModalRegister}
          onClose={() => setShowModalRegister(false)}
        >
          <div style={{ display: "flex", overflow: "scroll", height: 500 }}>
            <RegisterPage
              handleClose={() => setShowModalRegister(false)}
              showLogin={() => {
                setShowModalRegister(false);
                setShowModal(true);
              }}
            />
          </div>
        </Modal>
      </div>

      <Footer showLogin={() => setShowLogin(true)}/>
    </Layout>
  );
};

export default Product;
