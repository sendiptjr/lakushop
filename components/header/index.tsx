import { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import useOnClickOutside from "use-onclickoutside";
import Link from "next/link";
import { useRouter } from "next/router";
import { RootState } from "store";
import LoginPage from "pages/login";
import RegisterPage from "pages/register";
import CodeVerification from "./../code-verification";
import Lottie from "lottie-react";
import cartAnimasi from "./cart.json";
import { resetCart, setSuccessCart } from "store/reducers/cart";
import Modal from "./../modal";
import { useForm } from "react-hook-form";
import { setUserLogged, resetUser } from "store/reducers/user";
import { resetTransaction } from "store/reducers/transaction";
import axios from "./../../config/axiosConfig";
import { RxHamburgerMenu } from "react-icons/rx";

type HeaderType = {
  isErrorPage?: Boolean;
  showLogin?: Boolean;
};

const Header = ({ isErrorPage, showLogin }: HeaderType) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const arrayPaths = ["/"];
  const cart = useSelector((state: RootState) => state.cart);

  const memoizedCart = useMemo(() => cart, [cart]);
  const [onTop, setOnTop] = useState(
    !arrayPaths.includes(router.pathname) || isErrorPage ? false : true
  );
  const [seconds, setSeconds] = useState(0);
  const [code, setCode] = useState("");
  const { register, handleSubmit, errors } = useForm();
  const [menuOpen, setMenuOpen] = useState(false);
  // const [ setSearchOpen] = useState(false);
  const navRef = useRef(null);
  // const searchRef = useRef(null);
  const [showAnime, setShowAnime] = useState(false);
  const [email, setEmail] = useState("");
  const [restart, setRestart] = useState(false);
  const [disable, setDisable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalProfile, setShowModalProfile] = useState(false);
  const [showModalRegister, setShowModalRegister] = useState(false);
  const [showModalForgetPassword, setShowForgetPassword] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successReset, setSuccessReset] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [activeButton, setActiveButton] = useState<any>(null);
  const { user } = useSelector((state: RootState) => state.user);
  const [hover, setHover] = useState("");

  const headerClass = () => {
    if (window.pageYOffset === 0) {
      setOnTop(true);
    } else {
      setOnTop(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!arrayPaths.includes(router.pathname) || isErrorPage) {
        return;
      }

      headerClass();
      window.onscroll = function () {
        headerClass();
      };
    }
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // const closeSearch = () => {
  //   setSearchOpen(false);
  // };
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
  // on click outside
  useOnClickOutside(navRef, closeMenu);
  // useOnClickOutside(searchRef, closeSearch);

  useMemo(() => {
    if (memoizedCart?.cartSuccess) {
      setShowAnime(true);
      setTimeout(() => {
        setShowAnime(false);
        dispatch(setSuccessCart(false));
      }, 1000);
    }
  }, [memoizedCart]);

  const handleProfileLinkClick = () => {
    const userToken = localStorage.getItem("token");

    if (userToken) {
      // Token ada, lakukan navigasi ke halaman profil
      // router.push("/profile");
      setShowModalProfile(!showModalProfile);
    } else {
      // Token tidak ada, tampilkan modal login atau navigasi ke halaman login
      setShowModal(true);
    }
  };
  const handleProfileLinkClickMobile = () => {
    const userToken = localStorage.getItem("token");

    if (userToken) {
      // Token ada, lakukan navigasi ke halaman profil
      // router.push("/profile");
      setMenuOpen(true);
    } else {
      // Token tidak ada, tampilkan modal login atau navigasi ke halaman login
      setShowModal(true);
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
        setCode("");
      }
    } catch (error: any) {
      setError(error?.response?.data?.error);
      // console.log(error);
    }
  };

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

  const token = () => {
    const userToken = localStorage.getItem("token");
    return userToken;
  };
  useEffect(() => {
    if (showLogin) {
      handleProfileLinkClick();
    }
  }, [showLogin]);
  const handleCart = () => {
    const userToken = localStorage.getItem("token");

    if (userToken) {
      // Token ada, lakukan navigasi ke halaman profil
      router.push("/cart");
    } else {
      // Token tidak ada, tampilkan modal login atau navigasi ke halaman login
      setShowModal(true);
    }
  };

  const handleLogout = () => {
    setShowModalProfile(false);
    localStorage.removeItem("token");
    dispatch(setUserLogged(null));
    dispatch(resetCart());
    dispatch(resetTransaction());
    dispatch(resetUser());
    router.push("/");
  };

  const handleSubmitCode = async () => {
    if (code.length === 6) {
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
        setSuccessReset("Berhasil Update Password!");

        setTimeout(() => {
          setShowPassword(false);
          setShowModal(true);
          setError("");
          setSuccessReset("");
        }, 500);
      }
    } catch (error: any) {
      setError(error?.response?.data?.error);
    }
  };
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if(!/mobile/i.test(userAgent)){
      setDisable(true)
    }
  },[])

  return (
    
    <header className={`site-header ${disable ? '' : !onTop ? "site-header--fixed" : ""}`}>
      {disable ? <>
       </> : 
       <>
       <Modal
        right={true}
        isOpen={showModalProfile}
        onClose={() => setShowModalProfile(false)}
      >
        <div
          style={{
            display: "flex",
            top: 20,
            right: 20,
            flexDirection: "column",
          }}
        >
          <div className="line"></div>
          <button
            onMouseEnter={() => setActiveButton("/profile/dash")}
            onMouseLeave={() => setActiveButton(null)}
            onClick={() =>
              router.push({ pathname: "/profile", query: { header: 1 } })
            }
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <img src="/images/icons/icon-dashboard.png" width={30} />
            <h1 style={{ fontFamily: "Montserrat-Semibold", marginLeft: 10 }}>
              Dashboard
            </h1>
          </button>
          <div
            className="line"
            style={{
              borderBottomWidth: activeButton === "/profile/dash" ? 1 : 0,
              borderBottomColor:
                activeButton === "/profile/dash" ? "orange" : "transparent",
            }}
          ></div>
          <button
            onMouseEnter={() => setActiveButton("/profile")}
            onMouseLeave={() => setActiveButton(null)}
            onClick={() => router.push("/profile")}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <img src="/images/icons/icon-account.png" width={30} />
            <h1 style={{ fontFamily: "Montserrat-Semibold", marginLeft: 10 }}>
              Profile
            </h1>
          </button>
          <div
            className="line"
            style={{
              borderBottomWidth: activeButton === "/profile" ? 1 : 0,
              borderBottomColor:
                activeButton === "/profile" ? "orange" : "transparent",
            }}
          ></div>
          <button
            onMouseEnter={() => setActiveButton("/transaction")}
            onMouseLeave={() => setActiveButton(null)}
            onClick={() => router.push("/transaction")}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <img src="/images/icons/icon-transaction.png" width={30} />
            <h1 style={{ fontFamily: "Montserrat-Semibold", marginLeft: 10 }}>
              Transaction
            </h1>
          </button>
          <div
            className="line"
            style={{
              borderBottomWidth: activeButton === "/transaction" ? 1 : 0,
              borderBottomColor:
                activeButton === "/transaction" ? "orange" : "transparent",
            }}
          ></div>
          <button
            onClick={() => handleLogout()}
            onMouseEnter={() => setActiveButton("/logout")}
            onMouseLeave={() => setActiveButton(null)}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <img src="/images/icons/icon-logout.png" width={30} />
            <h1 style={{ fontFamily: "Montserrat-Semibold", marginLeft: 10 }}>
              Keluar
            </h1>
          </button>
          <div
            className="line"
            style={{
              borderBottomWidth: activeButton === "/logout" ? 1 : 0,
              borderBottomColor:
                activeButton === "/logout" ? "orange" : "transparent",
            }}
          ></div>
        </div>
      </Modal>
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
        isOpen={showModalRegister}
        onClose={() => setShowModalRegister(false)}
      >
        <div
          className="scroll-container"
          style={{ display: "flex", overflowY: "scroll", height: 500 }}
        >
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
        <div style={{ height: 350, width: 300 }}>
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
                    style={{ fontFamily: "Montserrat-Semibold" }}
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
        <div
          className="scroll-container"
          style={{ display: "flex", overflow: "scroll", height: 400 }}
        >
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
                  style={{
                    fontFamily: "Montserrat-Semibold",
                    fontSize: 12,
                    flex: 1,
                  }}
                  className="form__input"
                  placeholder="Masukkan Konfirmasi Password Baru"
                  type="password"
                  name="passwordnew"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </div>
              {password != "" &&
              passwordConfirm != "" &&
              password != passwordConfirm ? (
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

      <div className="container">
        <Link href="/">
          <h1
            className="site-logo"
            style={{ fontFamily: "Montserrat-Semibold" }}
          >
            <img
              style={{ cursor: "pointer" }}
              alt="logo2"
              src="/images/icons/logo.png"
              width={200}
            />
          </h1>
        </Link>

        <nav
          ref={navRef}
          className={`site-nav ${menuOpen ? "site-nav--open" : ""}`}
        >
          <div className="site-header__btn-menu">
            {user != null && token() != null && isMobile && (
              <a
                title="Home"
                className="site-header__btn-avatar"
                style={{ fontFamily: "Montserrat-Semibold", color: "black" }}
              >
                {user?.first_name + " " + user?.last_name}
              </a>
            )}
          </div>

          <Link href="/">
            <a
              onMouseEnter={() => setHover("Home")}
              onMouseLeave={() => setHover("")}
              title="Home"
              style={{
                fontFamily: "Montserrat-Semibold",
                color: "black",
                fontSize: isMobile ? 16 : 20,
                borderBottomWidth: 2,
                borderColor: hover != "Home" ? "transparent" : "black",
              }}
            >
              Home
            </a>
          </Link>
          <Link  href="/products">
            <a
              onMouseEnter={() => setHover("Products")}
              onMouseLeave={() => setHover("")}
              title="products"
              style={{
                fontFamily: "Montserrat-Semibold",
                color: "black",
                fontSize: isMobile ? 16 : 20,
                borderBottomWidth: 2,
                borderColor: hover != "Products" ? "transparent" : "black",
              }}
            >
              Products
            </a>
          </Link>
          <div className="site-header__btn-menu">
            <Link href="/transaction">
              <a
                onMouseEnter={() => setHover("transaction")}
                onMouseLeave={() => setHover("")}
                title="transaction"
                style={{
                  fontFamily: "Montserrat-Semibold",
                  color: "black",
                  fontSize: isMobile ? 16 : 20,
                  borderBottomWidth: 2,
                  borderColor: hover != "Products" ? "transparent" : "black",
                }}
              >
                Transactions
              </a>
            </Link>
          </div>

          <a title="profile" className="site-nav__btn" style={{ fontSize: 14 }}>
            <button
              onClick={() => {
                closeMenu();
                router.push("/profile");
              }}
            >
              <p
                style={{
                  fontFamily: "Montserrat-Semibold",
                  color: "black",
                  fontSize: isMobile ? 16 : 20,
                }}
              >
                Profile
              </p>
            </button>
          </a>
        </nav>

        <div className="site-header__actions">
          {/* <button
            ref={searchRef}
            className={`search-form-wrapper ${
              searchOpen ? "search-form--active" : ""
            }`}
          >
            <form className={`search-form`}>
              <i
                className="icon-cancel"
                onClick={() => setSearchOpen(!searchOpen)}
              ></i>
              <input
                type="text"
                name="search"
                placeholder="Enter the product you are looking for"
              />
            </form>
            <i
              onClick={() => setSearchOpen(!searchOpen)}
              className="icon-search"
            ></i>
          </button> */}

          <button onClick={() => handleCart()}>
            {showAnime ? (
              <div
                className="btn-cart btn-cart__count"
                style={{ marginLeft: 20 }}
              >
                <div style={{ width: 30, height: 30 }}>
                  <Lottie animationData={cartAnimasi} loop={true} />
                </div>
              </div>
            ) : (
              <div className="btn-cart">
                <i className="icon-cart" style={{ color: "black" }}></i>

                {memoizedCart.cartTotal > 0 && token() != null && (
                  <span className="btn-cart__count">
                    {memoizedCart.cartTotal}
                  </span>
                )}
              </div>
            )}
          </button>

          <button
            className="site-header__btn-avatar"
            onClick={() => {
              handleProfileLinkClick();
            }}
          >
            <div style={{ flexDirection: "row", display: "flex" }}>
              <i className="icon-avatar" style={{ color: "black" }}></i>
              {user != null && token() != null && (
                <p
                  style={{
                    marginLeft: 5,
                    fontSize: 18,
                    fontFamily: "Montserrat-Semibold",
                    color: "black",
                  }}
                >
                  {user?.first_name + " " + user?.last_name}
                </p>
              )}
            </div>
          </button>

          <button
            onClick={() => {
              handleProfileLinkClickMobile();
            }}
            className="site-header__btn-menu"
          >
            <RxHamburgerMenu style={{ color: "black" }} />
            {/* <i className="btn-hamburger" style={{color: 'black'}}>
              <span></span>
            </i> */}
          </button>
        </div>
      </div> 
       </>
      }
    </header> 
  );
};

export default Header;
