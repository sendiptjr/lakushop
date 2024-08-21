import { useRouter } from "next/router";
import Modal from "./../modal";
import { useEffect, useState } from "react";
import LoginPage from "pages/login";
import RegisterPage from "pages/register";
import CodeVerification from "./../code-verification";
import axios from "./../../config/axiosConfig";
import { useForm } from "react-hook-form";
import moment from "moment";
const Footer= ({ showLogin  }: any) => {
  const router = useRouter();
  const { register, handleSubmit, errors } = useForm();
  const [seconds, setSeconds] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showModalRegister, setShowModalRegister] = useState(false);
  const [showModalForgetPassword, setShowForgetPassword] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successReset, setSuccessReset] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [code, setCode] = useState("");
  const [restart, setRestart] = useState(false);
  const [email, setEmail] = useState("");
  useEffect(() => {
    let intervalId: any;

    if (showCode || restart) {
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
  }, [showCode, restart]);
  const resendCode = async () => {
    const body = {
      username: email,
    };
    try {
      const res = await axios.post(`user/api/forgot_password`, body);
      if (res) {
        setError("");
        setSeconds(res?.data?.minute_expired * 60);
        setRestart(true);
        setTimeout(() => {
          setRestart(false);
        }, 200);
      }
    } catch (error: any) {
      setError(error?.response?.data?.error);
    }
  };
  const onSubmit = async (data: any) => {
    const body = {
      username: data.email,
    };
    try {
      const res = await axios.post(`user/api/forgot_password`, body);
      if (res) {
        setError("");
        setEmail(data.email);
        setSeconds(res?.data?.minute_expired * 60);
        setShowCode(!showCode);
      }
    } catch (error: any) {
      setError(error?.response?.data?.error);
      // console.log(error);
    }
  };

  const handleSubmitCode = async () => {
    const body = {
      username: email,
      otp: code,
    };
    try {
      const res = await axios.post(`user/api/check_forgot_password`, body);
      if (res) {
        setSeconds(0);
        setShowCode(!showCode);
        setShowForgetPassword(false);
        setShowPassword(true);
        setError("");
      } else {
        // alert(res?.error)
      }
    } catch (error: any) {
      setError(error?.response?.data?.error);
    }
  };
  const handleNewPassword = async () => {
    const body = {
      username: email,
      new_password: passwordConfirm,
    };
    try {
      const res = await axios.post(`user/api/submit_forgot_password`, body);
      if (res) {
        setSuccessReset('Berhasil Update Password!')

        setTimeout(() => {
          setShowPassword(false);
          setShowModal(true);
          setError("");
          setSuccessReset('')
        }, 500);
       
        
      }
    } catch (error: any) {
      setError(error?.response?.data?.error);
    }
  };
  return (
    <div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <div
          className="scroll-container"
          style={{ display: "flex", overflowY: "scroll", height: 500, zIndex: '-moz-initial' }}
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
        isOpen={showModalRegister}
        onClose={() => setShowModalRegister(false)}
      >
        <div style={{ display: "flex", overflowY: "scroll", height: 500 }}>
          <RegisterPage
            handleClose={() => setShowModalRegister(false)}
            showLogin={() => {
              setShowModalRegister(false);
              setShowModal(true);
            }}
          />
        </div>
      </Modal>
      <Modal
        isOpen={showModalForgetPassword}
        onClose={() => setShowForgetPassword(false)}
      >
        <div style={{  height: 350, width: 300 }}>
          <div>
            <div
              onClick={() => {
                setShowCode(false);
                setShowForgetPassword(false);
              }}
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
              <h1
                style={{
                  textAlign: "center",
                  marginBottom: 10,
                  fontFamily: "Montserrat-Semibold",
                  fontSize: 10,
                }}
              >
                Cek Email untuk mendapatkan OTP yang sudah dikirimkan
              </h1>
            ) : null}
            {showCode ? (
              <div>
                <CodeVerification
                  length={6}
                  onComplete={(value) => {
                    setCode(value);
                    // handleSubmitCode()
                  }}
                />
                <h1
                  onClick={() => {
                    if (seconds === 0) {
                      resendCode();
                    }
                  }}
                  style={{
                    cursor: "pointer",
                    textAlign: "center",
                    marginTop: 10,
                    marginBottom: 20,
                    color: "orange",
                    fontFamily: "Montserrat-Semibold",
                  }}
                >
                  {seconds ? `Timer: ${seconds} seconds` : `Kirim Ulang OTP`}
                </h1>
                {error ? (
                  <h1
                    style={{
                      cursor: "pointer",
                      textAlign: "center",
                      marginTop: 10,
                      marginBottom: 20,
                      color: "red",
                      fontFamily: "Montserrat-Semibold",
                    }}
                  >
                    {error}
                  </h1>
                ) : null}
                <div style={{ flexDirection: "column", display: "flex" }}>
                  <button
                    onClick={() => handleSubmitCode()}
                    type="submit"
                    className="btn btn--rounded btn--yellow btn-submit"
                    style={{
                      fontFamily: "Montserrat-Semibold",
                    }}
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
                  <h1 style={{ margin: 10, fontFamily: "Montserrat-Semibold" }}>
                    Nomor HP / Email
                  </h1>
                  <input
                    style={{ fontFamily: "Montserrat-Semibold", fontSize: 12 }}
                    className="form__input titleDefault"
                    placeholder="Masukkan Nomor HP / Email"
                    type="text"
                    name="email"
                    ref={register({
                      required: true,
                      pattern:
                        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|^(?=.*[0-9])[-.+0-9]+$/i,
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
                {error && (
                  <p
                    className="message message--error"
                    style={{ fontFamily: "Montserrat-Semibold" }}
                  >
                    {error}
                  </p>
                )}
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
      <Modal isOpen={showPassword} onClose={() => setShowPassword(false)}>
        <div className="scroll-container" style={{ display: "flex", overflow: "scroll", height: 400, }}>
          <div>
            <div
              onClick={() => setShowPassword(false)}
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
              Set Password Baru
            </h1>

            <div className="form">
              <div className="form__input-row">
                <h1 style={{ margin: 10, fontFamily: "Montserrat-Semibold" }}>
                  Password Baru
                </h1>
                <input
                  style={{ fontFamily: "Montserrat-Semibold", fontSize: 12 }}
                  className="form__input"
                  placeholder="Masukkan Password Baru"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form__input-row">
                <h1 style={{ margin: 10, fontFamily: "Montserrat-Semibold" }}>
                  Konfirmasi Password Baru
                </h1>
                <input
                   style={{ fontFamily: "Montserrat-Semibold", fontSize: 12 }}
                  className="form__input"
                  placeholder="Masukkan Konfirmasi Password Baru"
                  type="password"
                  name="passwordnew"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </div>
              {password != "" && passwordConfirm != '' && password != passwordConfirm ? (
                <h1
                  style={{
                    cursor: "pointer",
                    textAlign: "center",
                    marginTop: 10,
                    marginBottom: 20,
                    color: "red",
                    fontFamily: "Montserrat-Semibold",
                  }}
                >
                  Password Tidak Sesuai
                </h1>
              ) : null}
               {successReset ? (
                <h1
                  style={{
                    textAlign: "center",
                    fontFamily: "Montserrat-Semibold",
                    color: "#00AA13",
                  }}
                >
                  {successReset}
                </h1>
              ) : null}
              <button
                onClick={() => {
                  handleNewPassword();
                }}
                type="submit"
                className="btn btn--rounded btn--yellow btn-submit"
                style={{ fontFamily: "Montserrat-Semibold" }}
              >
                Konfirmasi
              </button>
              <button
                onClick={() => {
                  setShowForgetPassword(false);
                  setShowPassword(false);
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
        </div>
      </Modal>

      <footer className="site-footer">
        <div className="container">
          <div className="site-footer__top">
            <div className="site-footer__description">
              <img alt="logo" src="/images/icons/logo.png" width={200} />
              <p style={{ fontFamily: "Montserrat-Regular" }}>
                Synthesis Square 10th Floor. Jalan Gatot Subroto Kav 64 No.177A,
                Jakarta - Selatan 12870.
              </p>
            </div>

            <div className="site-footer__links">
              <ul>
                <li style={{ fontFamily: "Montserrat-Bold" }}>Follow Us</li>
                <ul className="site-footer__social-networks">
                  <li>
                    <a
                      target="_blank" 
                      href="https://www.facebook.com/lakuemas/"
                      title="facebook"
                    >
                      <i className="icon-facebook"></i>
                    </a>
                  </li>
                  {/* <li><a href="#"><i className="icon-twitter"></i></a></li>
              <li><a href="#"><i className="icon-linkedin"></i></a></li> */}
                  <li>
                    <a
                      target="_blank" 
                      href="https://www.instagram.com/lakuemas/"
                      title="instagram"
                    >
                      <i className="icon-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      target="_blank" 
                      href="https://www.youtube.com/channel/UCeNgP3oDOQYg0EGo0SZvWzA/?themeRefresh=1"
                      title="youtube"
                    >
                      <i className="icon-youtube-play"></i>
                    </a>
                  </li>
                  <li>
                    <a
                    target="_blank" 
                      href="https://id.linkedin.com/company/lakuemasindonesia"
                      title="linkedin"
                    >
                      <i className="icon-linkedin"></i>
                    </a>
                  </li>
                </ul>
                <li style={{ fontFamily: "Montserrat-Bold" }}>Available On</li>
                <ul className="site-footer__social-networks">
                  <li>
                    <a
                    target="_blank" 
                      href="https://itunes.apple.com/us/app/lakuemas/id1401130641?mt=8"
                      title="appstore"
                    >
                      <img src="https://www.lakuemas.com/images/appstore.svg" alt="appstore"/>
                    </a>
                  </li>
                  {/* <li><a href="#"><i className="icon-twitter"></i></a></li>
              <li><a href="#"><i className="icon-linkedin"></i></a></li> */}
                  <li>
                    <a
                    target="_blank" 
                      href="https://play.google.com/store/apps/details?id=com.lakuemas.app&hl=in"
                      title="googleplay"
                    >
                      <img src="https://www.lakuemas.com/images/googleplay.svg" alt="googleplay" />
                    </a>
                  </li>
                </ul>

                {/* <li><a href="#"  style={{fontFamily: 'Montserrat-Regular'}}>Gift Cards</a></li>
              <li><a href="#"  style={{fontFamily: 'Montserrat-Regular'}}>Find a store</a></li>
              <li><a href="#"  style={{fontFamily: 'Montserrat-Regular'}}>Newsletter</a></li>
              <li><a href="#"  style={{fontFamily: 'Montserrat-Regular'}}>Bacome a member</a></li> */}
              </ul>
              <ul>
                <li style={{ fontFamily: "Montserrat-Bold" }}>Lakushop.id</li>
                <li>
                  <a
                    onClick={() => showLogin()}
                    title="profile"
                    style={{
                      fontFamily: "Montserrat-Regular",
                      cursor: "pointer",
                    }}
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => showLogin()}
                    title="cart"
                    style={{
                      fontFamily: "Montserrat-Regular",
                      cursor: "pointer",
                    }}
                  >
                    Keranjang
                  </a>
                </li>
                <li>
                  <a
                     onClick={() => showLogin()}
                    title="transaction"
                    style={{
                      fontFamily: "Montserrat-Regular",
                      cursor: "pointer",
                    }}
                  >
                    Transaksi
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => {
                      router.push("/products");
                    }}
                    title="products"
                    style={{
                      fontFamily: "Montserrat-Regular",
                      cursor: "pointer",
                    }}
                  >
                    Product
                  </a>
                </li>
              </ul>

              <ul>
                <li style={{ fontFamily: "Montserrat-Bold" }}>Contact</li>
                <li>
                  <a
                    title="mail"
                    href="mailto:support@lakuemas.com"
                    style={{
                      fontFamily: "Montserrat-Regular",
                      cursor: "pointer",
                    }}
                  >
                    support@lakuemas.com
                  </a>
                </li>
                <li>
                  <a
                    title="telp"
                    href="tel:+622121243873"
                    style={{
                      fontFamily: "Montserrat-Regular",
                      cursor: "pointer",
                    }}
                  >
                    (021) 21243873
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="site-footer__bottom">
          <div className="container">
            <p style={{ fontFamily: "Montserrat-Bold" }}>
              LAKUEMAS - © {moment(new Date()).format('YYYY')}. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
