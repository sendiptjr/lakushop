import { useForm } from "react-hook-form";
import Layout from "../layouts/Main";
import axios from "./../config/axiosConfig";
import { useState } from "react";
import { trackingAnalytics } from "utils/helper";
import { IReqRegister } from "types";
interface RegisterPageProps {
  handleClose: () => void;
  showLogin: () => void;
}
type RegisterMail = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phone: string;
};
const RegisterPage: React.FC<RegisterPageProps> = ({
  handleClose,
  showLogin,
}) => {
  const { register, handleSubmit, errors } = useForm();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const onSubmit = async (data: RegisterMail) => {
    if (
      data.email != "" &&
      data.password != "" &&
      data?.firstname != "" &&
      data?.lastname != "" &&
      data?.phone != ""
    ) {
      const users : IReqRegister = {
        email: data.email,
        password: data.password,
        first_name: data.firstname,
        last_name: data.lastname,
        phone: data.phone,
      };
      try {
        const res = await axios.post(`user/api/register`, users);
        if (res.status === 200) {
          trackingAnalytics("Success_Register", data.firstname, data.email);
          setError("");
          setSuccess("Berhasil Register user, silahkan login");
          setTimeout(() => {
            showLogin();
          }, 500);
        } else {
          // Handle failed login
          console.error("Login failed");
        }
      } catch (error: any) {
        setError(error?.response?.data?.error);
      }
    } else {
      setError("Lengkapi Form Register Anda!");
    }
  };

  return (
    <Layout>
      <section>
        <div className="container">
          <div
            className="form-block"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "Montserrat-Semibold",
                    }}
                  >
                    Daftar / Register
                  </h3>
                </div>

                <div
                  onClick={() => handleClose()}
                  style={{
                    display: "flex",
                    // alignContent: "flex-end",
                    // justifyContent: "flex-end",
                  }}
                >
                  <img src="/images/icons/close.svg" alt="close" />
                </div>
              </div>
            </div>

            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              <h3
                className="form__signup"
                style={{ fontFamily: "Montserrat-Semibold" }}
              >
                Nama Depan
              </h3>
              <div className="form__input-row">
                <input
                  className="form__input titleDefault"
                  placeholder="Masukkan Nama Depan"
                  type="text"
                  name="firstname"
                  style={{ fontFamily: "Montserrat-Semibold" }}
                  maxLength={15}
                  ref={register}
                />
              </div>
              <h3
                className="form__signup"
                style={{ fontFamily: "Montserrat-Semibold" }}
              >
                Nama Belakang
              </h3>
              <div className="form__input-row">
                <input
                  className="form__input titleDefault"
                  placeholder="Masukkan Nama Belakang"
                  type="text"
                  name="lastname"
                  style={{ fontFamily: "Montserrat-Semibold" }}
                  maxLength={15}
                  ref={register}
                />
              </div>
              <h3
                className="form__signup"
                style={{ fontFamily: "Montserrat-Semibold" }}
              >
                Email
              </h3>
              {errors.email && errors.email.type === "pattern" && (
                <p
                  className="message message--error"
                  style={{ fontFamily: "Montserrat-Semibold" }}
                >
                  Masukkan Email yang valid / Nomor Handphone anda
                </p>
              )}
              <div className="form__input-row">
                <input
                  style={{ fontFamily: "Montserrat-Semibold" }}
                  className="form__input titleDefault"
                  placeholder="Masukkan Email"
                  type="text"
                  name="email"
                  ref={register({
                    required: true,
                    pattern:
                      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|^(?=.*[0-9])[-.+0-9]+$/i,
                  })}
                />
              </div>

              <h3
                className="form__signup"
                style={{ fontFamily: "Montserrat-Semibold" }}
              >
                Nomor Handphone
              </h3>
              <div className="form__input-row">
                <input
                  style={{ fontFamily: "Montserrat-Semibold" }}
                  className="form__input titleDefault"
                  placeholder="Masukkan Nomor Handphone"
                  type="text"
                  name="phone"
                  ref={register}
                />
              </div>

              <h3
                className="form__signup"
                style={{ fontFamily: "Montserrat-Semibold" }}
              >
                Password
              </h3>
              <div className="form__input-row">
                <input
                  style={{ fontFamily: "Montserrat-Semibold" }}
                  className="form__input titleDefault"
                  type="Password"
                  placeholder="Masukkan Password"
                  name="password"
                  ref={register}
                />
              </div>
              {success != "" ? (
                <h3
                  style={{
                    color: "green",
                    fontFamily: "Montserrat-Semibold",
                    textAlign: "center",
                  }}
                >
                  {success}
                </h3>
              ) : null}
              {error != "" ? (
                <h3
                  style={{
                    color: "red",
                    fontFamily: "Montserrat-Semibold",
                    textAlign: "center",
                  }}
                >
                  {error}
                </h3>
              ) : null}
              <button
                disabled={false}
                type="submit"
                className="btn btn--rounded btn--yellow btn-submit"
                style={{ fontFamily: "Montserrat-Semibold" }}
              >
                Daftar
              </button>

              <p className="form__signup-link">
                <button onClick={() => showLogin()}>
                  <a
                    title="signup"
                    href="#"
                    style={{ fontFamily: "Montserrat-Semibold" }}
                  >
                    Sudah Punya Akun ?
                  </a>
                </button>
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RegisterPage;
