import Layout from "../layouts/Main";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setUserLogged } from "store/reducers/user";
// import { getData, postData } from "utils/services";
import axios from "./../config/axiosConfig";
// import { useRouter } from "next/router";
import { setCountCart } from "store/reducers/cart";
import LoadingSpinner from "./../components/loading-spinner/index";
import { useState } from "react";
import { trackingAnalytics } from "utils/helper";
import EyeIcon from "components/eye";
import { IReqLogin, IReqLoginResponse } from "types";

type LoginMail = {
  email: string;
  password: string;
};
interface LoginPageProps {
  handleClose: () => void;
  showRegister: () => void;
  handleForget: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  handleClose,
  showRegister,
  handleForget,
}) => {
  const { register, handleSubmit, errors } = useForm();
  const dispatch = useDispatch();
  const [togglePassword, setTogglePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const onSubmit = async (data: LoginMail) => {
    setError("");
    setLoading(true);
    const users: IReqLogin  =  {
      username: data.email,
      password: btoa(data.password),
    };
    try {
      const res: IReqLoginResponse = await axios.post(`user/api/login`, users);
      if (res.status === 200) {
        localStorage.setItem("token", JSON.stringify(res?.data?.token));
        fetchInfo();
        trackingAnalytics(
          "Success_Login",
          res?.data?.customer?.first_name,
          res?.data?.customer?.email
        );
        setError("");
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          handleClose();
          setLoading(false);
          // router.push("/");
        }, 400);

        // router.reload();
      } else {
        // Handle failed login
        setLoading(false);
        console.error("Login failed");
      }
    } catch (error: any) {
      setError(error?.response?.data?.error);
      setLoading(false);
    }
  };
  const fetchInfo = async () => {
    try {
      const resp = await axios.get("user/api/profile");
      dispatch(setUserLogged(resp?.data?.data));
      const res = await axios.get("transaction/api/cart/total_item");
      dispatch(setCountCart(res?.data?.data));
    } catch (error) {}
  };

  return (
    <Layout>
      <section>
        <div className="container">
          {/* <div className="back-button-section"></div> */}

          <div className="form-block">
            <div
              onClick={() => handleClose()}
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
              className="form-block__title"
              style={{ fontFamily: "Montserrat-Semibold" }}
            >
              Log in / Masuk
            </h1>

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

                {errors.email && errors.email.type === "required" && (
                  <p
                    className="message message--error"
                    style={{ fontFamily: "Montserrat-Semibold" }}
                  >
                    This field is required
                  </p>
                )}

                {errors.email && errors.email.type === "pattern" && (
                  <p
                    className="message message--error"
                    style={{ fontFamily: "Montserrat-Semibold" }}
                  >
                    Masukkan Email yang valid / Nomor Handphone anda
                  </p>
                )}
              </div>

              <div className="form__input-row">
                <h1 style={{ margin: 10, fontFamily: "Montserrat-Semibold" }}>
                  Password
                </h1>
                <div
                className="form__input_pass"
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    style={{
                      fontFamily: "Montserrat-Semibold",
                      paddingRight: "2rem",
                      flex: 1,
                      outline: "none", // Menghilangkan outline default pada browser
                      borderColor: togglePassword ? "transparent" : "#ccc",
                      boxShadow: "none"
              
                    }}
                    
                    className=" titleDefault"
                    type={togglePassword ? 'text' : "password"}
                    placeholder="Masukkan Password"
                    name="password"
                    ref={register({ required: true })}
                  />
                  <EyeIcon
                    isVisible={togglePassword}
                    toggleVisibility={() => setTogglePassword(!togglePassword)}
                  />
                </div>

                {/* <input
                  style={{ fontFamily: "Montserrat-Semibold" }}
                  className="form__input titleDefault"
                  type="password"
                  placeholder="Masukkan Password"
                  name="password"
                  ref={register({ required: true })}
                /> */}

                {errors.password && errors.password.type === "required" && (
                  <p
                    className="message message--error"
                    style={{ fontFamily: "Montserrat-Semibold" }}
                  >
                    This field is required
                  </p>
                )}
              </div>

              <div className="form__info">
                {/* <div className="checkbox-wrapper">
                  <label htmlFor="check-signed-in" className={`checkbox checkbox--sm`}>
                    <input 
                      type="checkbox" 
                      name="keepSigned" 
                      id="check-signed-in" 
                      ref={register({ required: false })}
                    />
                    <span className="checkbox__check"></span>
                    <p>Keep me signed in</p>
                  </label>
                </div> */}
              </div>
              {success ? (
                <h1
                  style={{
                    textAlign: "center",
                    fontFamily: "Montserrat-Semibold",
                    color: "#00AA13",
                  }}
                >
                  Berhasil Login
                </h1>
              ) : null}
              {error ? (
                <h1
                  style={{
                    textAlign: "center",
                    fontFamily: "Montserrat-Semibold",
                    color: "red",
                  }}
                >
                  {error}
                </h1>
              ) : null}
              <button
                disabled={loading}
                type="submit"
                className="btn btn--rounded btn--yellow btn-submit"
                style={{ fontFamily: "Montserrat-Semibold" }}
              >
                {loading ? <LoadingSpinner loading={loading} /> : "Login"}
              </button>
              <div
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  margin: 10,
                }}
              >
                <button onClick={() => handleForget()}>
                  <div>
                    <h1
                      style={{
                        textAlign: "center",
                        fontFamily: "Montserrat-Semibold",
                      }}
                    >
                      Lupa Password
                    </h1>
                  </div>
                </button>
              </div>

              <p
                className="form__signup-link"
                style={{ fontFamily: "Montserrat-Semibold" }}
              >
                Belum punya akun?{" "}
                <a
                  onClick={() => showRegister()}
                  style={{
                    cursor: "pointer",
                    color: "#E0BF4B",
                    fontFamily: "Montserrat-Semibold",
                  }}
                >
                  Daftar
                </a>
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LoginPage;
