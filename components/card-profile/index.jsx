import { useEffect, useMemo, useState } from "react";
import Logo from "../../assets/icons/logout";
import { useDispatch, useSelector } from "react-redux";
import { resetUser, setUserLogged } from "store/reducers/user";
import { useRouter } from "next/router";
import { RootState } from "store";
import axios from "./../../config/axiosConfig";
import axiosFile from "./../../config/axiosFile";
import { FaUnlockAlt } from "react-icons/fa";
import { BsKeyFill } from "react-icons/bs";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Cropper from "react-easy-crop";
import Modal from "./../modal";
import getCroppedImg from "../../utils/cropImage";
import CodeVerification from "./../code-verification";
import { MdVerified } from "react-icons/md";
import Loader from "../../components/loader";
import moment from "moment";
import { resetCart } from "store/reducers/cart";
import { resetTransaction } from "store/reducers/transaction";
import EyeIcon from "components/eye";
import { currencyFormat, trackingAnalytics } from "utils/helper";
const CardProfile = ({values}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.user);
  const memoizedCart = useMemo(() => user, [user]);
  const [tabIndex, setTabIndex] = useState(1);
  const [passwordOld, setPasswordOld] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  const [toggleNewPassword, setToggleNewPassword] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showUpdatePassword, setUpdatePassword] = useState(false);
  const [changeFullName, setChangeFullName] = useState(false);
  const [changePhoneNumber, setChangePhoneNumber] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [position, setPosition] = useState("");
  const [changeGender, setChangeGender] = useState(false);
  const [showModalProfile, setShowModalProfile] = useState(false);
  const [gender, setGender] = useState("");
  const [changeTitle, setChangeTitle] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState("");
  const [error, setError] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(1);
  const [userInfoData, setUserInfo] = useState({
    userName: user?.username,
    email: user?.email,
    contactNumber: user?.phone,
    firstName: user?.first_name,
    lastName: user?.last_name,
    idCardNumber: "123123123",
    customerCode: "23234234",
    customerName: "Test Ajaa",
    taxPayerNumber: "02q342",
    picture: user?.picture,
    dob: moment(user?.dob).format("YYYY-MM-DD"),
    gender:
      user?.gender === "p"
        ? "Perempuan"
        : user?.gender === ""
        ? "-"
        : "Laki-laki",
  });
  const tabDataUserOnetime = [
    {
      title: "Data Diri",
      index: 1,
    },
    {
      title: "Hubungkan Akun",
      index: 2,
    },
    {
      title: "Keamanan Akun",
      index: 3,
    },
  ];
  
  const [seconds, setSeconds] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [errImgFile, setErrImgFile] = useState(false);
  const [errImgSize, setErrImgSize] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCode, setLoadingCode] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  const [header, setHeader] = useState(values);
  const [imagePathSecond, setImagePathSecond] = useState(null);
  const [dataDashboard, setDataDashboard] = useState({
    total_vouchers: 0,
    total_purchases: 0,
  });
  const [code, setCode] = useState("");
  const handleChangePhoneNumber = async () => {};
  const onChangePhoneNumber = (value) => {
    const val1 = value.replace(/[^0-9]+/g, "");
    const val2 = val1.slice(0, 13);
    setUserInfo({ ...userInfoData, contactNumber: val2 });
  };

  const onChangeDob = async (value) => {
    setUserInfo({ ...userInfoData, dob: value });
    const body = {
      first_name: userInfoData?.firstName,
      last_name: userInfoData?.lastName,
      dob: value,
      gender: userInfoData?.gender,
      phone: userInfoData?.contactNumber,
    };
    try {
      const resp = await axios.post("user/api/profile/update", body);
      fetchInfo();
      router.reload();
    } catch (error) {}
  };
  const handleChangeFullName = async () => {
    setChangeFullName(false);
    const body = {
      first_name: userInfoData?.firstName,
      last_name: userInfoData?.lastName,
      dob: userInfoData?.dob,
      gender: userInfoData?.gender,
      phone: userInfoData?.contactNumber,
    };
    try {
      const resp = await axios.post("user/api/profile/update", body);
      fetchInfo();
      router.reload();
    } catch (error) {}
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserInfo({
        ...userInfoData,
        userName: user?.username,
        email: user?.email,
        contactNumber: user?.phone,
        firstName: user?.first_name,
        lastName: user?.last_name,
        dob: moment(user?.dob).format("YYYY-MM-DD"),
        gender: user?.gender === "p" ? "Perempuan" : user?.gender === "l"  ? "Laki-laki" : '-',
      });
      trackingAnalytics(`page_view_profile `, user?.first_name, user?.email);
    }
  }, [memoizedCart]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchInfo();
    }
  }, []);

  useEffect(() => {
    setHeader(values)
  }, [values])

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (header === 1) {
        trackingAnalytics(
          `page_view_dashboard `,
          user?.first_name,
          user?.email
        );
        fetchDashboard();
      }
    }
  }, [header]);

  const fetchDashboard = async () => {
    try {
      const resp = await axios.get("transaction/api/trx/dashboard");
      if (resp?.data?.data) {
        setDataDashboard({
          ...dataDashboard,
          total_purchases: resp?.data?.data?.total_purchases,
          total_vouchers: resp?.data?.data?.total_vouchers,
        });
      }
    } catch (error) {}
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleRouteChange = (url) => {
        // Lakukan sesuatu ketika terjadi perubahan rute
        // console.log("Route changed to:", url);
      };

      router.events.on("routeChangeStart", handleRouteChange);

      return () => {
        router.events.off("routeChangeStart", handleRouteChange);
      };
    }
  }, []);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };
  const fetchInfo = async () => {
    try {
      const resp = await axios.get("user/api/profile");
      dispatch(setUserLogged(resp?.data?.data));
      const res = await axios.get("transaction/api/cart/total_item");
      dispatch(setCountCart(res?.data?.data));
    } catch (error) {}
  };

  const verifyEmail = async () => {
    setLoadingCode(true);
    try {
      const resp = await axios.get("user/api/send_email_verification");
      if (resp?.data) {
        setLoadingCode(false);
        setSeconds(resp?.data?.minute_expired * 60);
        setShowVerify(true);
      }
    } catch (error) {
      setLoadingCode(false);
    }
  };
  const resetTimer = () => {
    setSeconds(0);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      let intervalId;

      if (showVerify === true) {
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
    }
  }, [showVerify]);

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    try {
      const body = {
        otp_code: code,
      };
      const resp = await axios.post("user/api/check_email_verification", body);
      if (resp?.data) {
        setLoading(false);
        setShowVerify(false);
        resetTimer();
        fetchInfo();
        setError("");
        router.reload();
      } else {
        setLoading(false);
      }
    } catch (error) {
      setError(error?.response?.data?.error);
      setLoading(false);
      // setShowVerify(false);
    }
  };
  const handleLogout = () => {
    trackingAnalytics(`success_logout`, user?.first_name, user?.email);
    router.push("/");
    localStorage.removeItem("token");
    dispatch(setUserLogged(null));
    dispatch(resetCart());
    dispatch(resetTransaction());
    dispatch(resetUser());
  };
  const _renderInformation = () => {
    return (
      <div className="tabInformasi">
        <div className="mb-4">
          <div
            className="judulInformasi"
            style={{ fontFamily: "Montserrat-Semibold" }}
          >
            Nama Lengkap
          </div>
          <div style={{ margin: 0, flexDirection: "row", display: "flex" }}>
            {changeFullName ? (
              <div className="formEditFullname flex-row flex">
                <input
                  type="text"
                  value={userInfoData?.firstName}
                  maxLength={15}
                  className="inputFullName"
                  placeholder="Nama Pertama"
                  onChange={(e) =>
                    setUserInfo({
                      ...userInfoData,
                      firstName: e.target.value?.replace(/[^a-z A-Z]+/g, ""),
                    })
                  }
                  style={{
                    width: userInfoData?.firstName
                      ? userInfoData?.firstName.length * 12 > 110
                        ? userInfoData?.firstName.length * 12
                        : 110
                      : 110,
                  }}
                />
                <div
                  style={{
                    height: "70%",
                    width: "1px",
                    backgroundColor: "#d4d5d5",
                    margin: "auto 10px",
                  }}
                />
                <input
                  type="text"
                  value={userInfoData?.lastName}
                  className="inputFullName"
                  placeholder="Nama Terakhir"
                  maxLength={15}
                  onChange={(e) =>
                    setUserInfo({
                      ...userInfoData,
                      lastName: e.target.value?.replace(/[^a-z A-Z]+/g, ""),
                    })
                  }
                  style={{
                    width: userInfoData?.lastName
                      ? userInfoData?.lastName.length * 12 > 110
                        ? userInfoData?.lastName.length * 12
                        : 110
                      : 110,
                  }}
                />
              </div>
            ) : (
              <span className="textInformasi">
                {userInfoData?.firstName} {userInfoData?.lastName}
              </span>
            )}
            <span
              className="btnChange"
              style={{ cursor: "pointer", marginLeft: 30 }}
              onClick={() => {
                changeFullName
                  ? handleChangeFullName()
                  : setChangeFullName(true);
              }}
            >
              {changeFullName ? "Simpan" : "Ubah"}
            </span>
          </div>
        </div>
        <div className="mb-4">
          <div
            className="judulInformasi"
            style={{ fontFamily: "Montserrat-Semibold" }}
          >
            Email
          </div>
          <div className="rowInformasi">
            <input
              type="email"
              value={userInfoData?.email}
              className="textInformasi"
              disabled={true}
              onKeyPress="this.style.width = ((this.value.length + 1) * 8) + 'px';"
              style={{ width: "100%", fontFamily: "Montserrat-Semibold" }}
            ></input>
            {user?.email_verified != "1" ? (
              <button
                disabled={loadingCode}
                onClick={() => verifyEmail()}
                className="judulInformasi"
                style={{
                  fontFamily: "Montserrat-Semibold",
                  color: "white",
                  backgroundColor: "#00AA13",
                  padding: 10,
                  borderRadius: 5,
                  marginTop: 5,
                }}
              >
                {loadingCode ? <Loader /> : "Verifikasi Email Sekarang"}
              </button>
            ) : (
              <div
                className="judulInformasi"
                style={{
                  fontFamily: "Montserrat-Semibold",
                  color: "blue",
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <MdVerified color="#2196f3" size={15} />{" "}
                <h1 style={{ color: "#2196f3", marginLeft: 5 }}>
                  Email Terverifikasi
                </h1>
              </div>
            )}
          </div>
        </div>
        <div className="mb-4">
          <div
            className="judulInformasi"
            style={{ fontFamily: "Montserrat-Semibold" }}
          >
            Nomor Telepon
          </div>
          <div style={{ margin: 0, flexDirection: "row", display: "flex" }}>
            {changePhoneNumber ? (
              <input
                className="changePhoneNumber"
                value={userInfoData?.contactNumber}
                onChange={(e) => onChangePhoneNumber(e.target.value)}
              />
            ) : (
              <span className="textInformasi">
                {userInfoData?.contactNumber}
              </span>
            )}
            <span
              className="btnChange"
              style={{ cursor: "pointer", marginLeft: 30 }}
              onClick={() => {
                changePhoneNumber
                  ? handleChangeFullName()
                  : setChangePhoneNumber(true);
              }}
            >
              {changePhoneNumber ? "Simpan" : "Ubah"}
            </span>
          </div>
        </div>
        {/* <div className="mb-4">
          <div
            className="judulInformasi"
            style={{ fontFamily: "Montserrat-Semibold" }}
          >
            Tanggal Lahir
          </div>
          <div className="rowInformasi">
            <input
              type="date"
              className="changePhoneNumber"
              value={userInfoData?.dob}
              onChange={(e) => onChangeDob(e.target.value)}
            />
          </div>
        </div> */}
        <div className="mb-4">
          <div
            className="judulInformasi"
            style={{ fontFamily: "Montserrat-Semibold" }}
          >
            Gender
          </div>
          <div
            className="rowInformasi"
            style={{ display: "flex", flexDirection: "row" }}
          >
            {changeGender ? (
              <select
                value={userInfoData?.gender}
                disabled={!changeGender}
                className="textInformasi"
                style={{
                  width: (userInfoData?.gender?.length + 10) * 10,
                  backgroundColor: "#ffffff",
                  fontFamily: "Montserrat-Semibold",
                }}
                onChange={(e) => {
                  setUserInfo({ ...userInfoData, gender: e.target.value });
                }}
              >
                <option
                  style={{ fontFamily: "Montserrat-Semibold" }}
                  selected={position && position == "l"}
                  value="l"
                >
                  Laki-Laki
                </option>
                <option
                  style={{ fontFamily: "Montserrat-Semibold" }}
                  selected={position && position == "p"}
                  value="p"
                >
                  Perempuan
                </option>
              </select>
            ) : (
              <span className="textInformasi">{userInfoData?.gender}</span>
            )}
            <span
              className="btnChange"
              style={{ cursor: "pointer", marginLeft: 30 }}
              onClick={() => {
                if (changeGender) {
                  setChangeGender(false);
                  handleChangeFullName();
                } else {
                  setChangeGender(true);
                }
              }}
            >
              {!changeGender ? "Ubah" : "Simpan"}
            </span>
          </div>
        </div>

        <Modal isOpen={showVerify} onClose={() => setShowVerify(false)}>
          <div style={{ display: "flex", height: 300 }}>
            <div>
              <div
                onClick={() => {
                  setShowVerify(false);
                  resetTimer();
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
                Masukkan Kode Verifikasi
              </h1>
              <h1
                style={{
                  textAlign: "center",
                  marginBottom: 10,
                  fontFamily: "Montserrat-Semibold",
                }}
              >
                yang dikirimkan ke email anda
              </h1>
              <div>
                <CodeVerification
                  length={6}
                  onComplete={(value) => {
                    setCode(value);
                  }}
                />
                {seconds ? (
                  <h1
                    style={{
                      textAlign: "center",
                      marginTop: 10,
                      marginBottom: 20,
                      color: "orange",
                      fontFamily: "Montserrat-Semibold",
                    }}
                  >
                    Waktu Verifikasi : {seconds} detik
                  </h1>
                ) : (
                  <h1
                    onClick={() => {
                      verifyEmail();
                    }}
                    style={{
                      cursor: "pointer",
                      color: "orange",
                      textAlign: "center",
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                  >
                    Kirim Ulang Kode Verifikasi
                  </h1>
                )}
                {error ? (
                  <h1
                    style={{
                      textAlign: "center",
                      marginBottom: 10,
                      color: "red",
                      fontFamily: "Montserrat-Semibold",
                    }}
                  >
                    {error}
                  </h1>
                ) : null}
                <div style={{ flexDirection: "column", display: "flex" }}>
                  <button
                    disabled={code?.length < 6 || loading}
                    onClick={() => {
                      handleVerify();
                    }}
                    type="submit"
                    className="btn btn--rounded btn--yellow btn-submit"
                    style={{
                      fontFamily: "Montserrat-Semibold",
                      opacity: code?.length < 6 ? 0.5 : 1,
                    }}
                  >
                    {loading ? <Loader /> : "Konfirmasi"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  };

  const _renderDashboard = () => {
    return (
      <div className="tabInformasi">
        <div className="flexResponsive">
          <div
            style={{
              backgroundColor: "white",
              flex: 1,
              margin: 10,
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              padding: 10,
              borderRadius: 15,
              flexDirection: "column",
              minHeight: 120,
              maxWidth: 250,
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.6)",
            }}
          >
            <h1
              style={{
                color: "black",
                fontFamily: "Montserrat-Semibold",
                textAlign: "center",
              }}
            >{`Total Pembelian`}</h1>
            <h1
              style={{
                color: "black",
                fontFamily: "Montserrat-Semibold",
                textAlign: "center",
              }}
            >{`Voucher Bulan Berjalan`}</h1>
            <h1
              style={{
                color: "black",
                marginTop: 20,
                fontFamily: "Montserrat-Semibold",
                textAlign: "center",
              }}
            >
              {dataDashboard?.total_vouchers} Voucher
            </h1>
          </div>
          <div
            style={{
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.6)",
              backgroundColor: "orange",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              padding: 10,
              borderRadius: 15,
              flexDirection: "column",
              minHeight: 120,
              maxWidth: 250,
              margin: 10,
            }}
          >
            <h1
              style={{
                color: "white",
                fontFamily: "Montserrat-Semibold",
                textAlign: "center",
              }}
            >{`Jumlah Belanja Kamu`}</h1>
            <h1
              style={{
                color: "white",
                marginTop: 20,
                fontFamily: "Montserrat-Semibold",
                textAlign: "center",
              }}
            >
              Rp {currencyFormat(dataDashboard?.total_purchases)}
            </h1>
          </div>
        </div>
      </div>
    );
  };
  const _renderConnect = () => {
    return (
      <div
        style={{
          margin: 40,
          // border: "1px solid #E0BF4B",
          // cursor: "pointer",
          borderRadius: 20,
          padding: 20,
        }}
      >
        {user?.linkage?.map((item) => (
          <div
            style={{
              maxWidth: 200,
              borderRadius: 20,
              backgroundColor: "#FFF",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              cursor: "pointer",
              flexDirection: "column",
              display: "flex",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <img
              src={
                item?.name === "LAKUEMAS"
                  ? "/images/icons/iconLakuemas.png"
                  : "/images/icons/iconCmk.png"
              }
              width={150}
              alt="iconLakuemas"
            />
            {item?.status ? (
              <h1
                style={{
                  textAlign: "center",
                  color: "#2196f3",
                  fontSize: 12,
                  marginBottom: 20,
                  fontFamily: "Montserrat-Semibold",
                }}
              >
                Akun Sudah Terhubung
              </h1>
            ) : null}
            {item?.status ? null : (
              <div
                onClick={() => {
                  item?.name === "LAKUEMAS"
                    ? window.open(
                        `${process?.env.URL_LINKAGE}/linkage/login?email=${user?.email}&code=${user?.unique_code}`,
                        "_blank"
                      )
                    : window.open(
                        "https://member.cmkclub.com/frontdesk/login/",
                        "_blank"
                      );
                }}
                style={{
                  border: "1px solid #E0BF4B",
                  cursor: "pointer",
                  borderRadius: 20,
                  padding: 10,
                  marginBottom: 10,
                }}
              >
                <h1
                  style={{
                    textAlign: "center",
                    color: item?.status ? "red" : "#2196f3",
                    fontSize: 12,
                    fontFamily: "Montserrat-Semibold",
                  }}
                >
                  {item?.status ? "Lepaskan Akun" : "Hubungkan Akun"}
                </h1>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const onSubmit = () => {};
  const _handleBackgroundChange = async (event) => {
    // let file_size = e.target.files[0].size / 1024 / 1024;
    // let file_type = e.target.files[0].type;
    // if (file_size > 1) {
    //   setErrImgSize(true);
    // } else if (file_type != "image/jpeg" && file_type != "image/png" && file_type != "image/jpg") {
    //   setErrImgFile(true);
    // }
    // else {
    setImagePathSecond(URL.createObjectURL(event));
    setShowModalProfile(!showModalProfile);
    setImageFile(event);

    // }
  };
  const urltoFile = (url, filename, mimeType) => {
    mimeType = mimeType || (url.match(/^data:([^;]+);/) || "")[1];
    return fetch(url)
      .then(function (res) {
        return res.arrayBuffer();
      })
      .then(function (buf) {
        return new File([buf], filename, { type: mimeType });
      });
  };
  const updateProfile = async () => {
    const imagePathSecond1 = await getCroppedImg(
      imagePathSecond,
      croppedAreaPixels
    );

    urltoFile(imagePathSecond1, "lakushop").then(async (file) => {
      const formData = new FormData();

      formData.append("file", file);
      const resp = await axiosFile.post(
        "user/api/profile/photo_upload",
        formData
      );
      if (resp) {
        fetchInfo();
        router.reload();
      }
    });
  };
  const handleUpdatePassword = async () => {
    setErrorPassword("");
    try {
      const body = {
        old_password: passwordOld,
        new_password: passwordConfirm,
      };
      const resp = await axios.post("user/api/profile/update_password", body);
      if (resp?.data) {
        setPasswordOld("");
        setPasswordConfirm("");
        setErrorPassword("");
        fetchInfo();
        setUpdatePassword(false);
      }
    } catch (error) {
      setErrorPassword(error?.response?.data?.error);
      // setShowVerify(false);
    }
  };
  const _renderPassword = () => {
    return (
      <div>
        <div
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            marginTop: 10,
            marginBottom: 10,
            marginLeft: 5,
          }}
        >
          <h1
            className="transaction_status"
            style={{
              margin: 10,
              fontFamily: "Montserrat-Semibold",
            }}
          >
            Keamanan Akun
          </h1>
          <button
            onClick={() => setUpdatePassword(!showUpdatePassword)}
            style={{
              backgroundColor: "#47d147",
              borderRadius: 10,
              alignItems: "center",
              display: "flex",
              paddingInline: 5,
            }}
          >
            <FaUnlockAlt color="white" />
            <h1
              style={{
                margin: 5,
                fontSize: 13,
                fontFamily: "Montserrat-Semibold",
              }}
            >
              Ubah Password
            </h1>
          </button>
        </div>

        <div className="form">
          <div className="border-2 border-[#E0BF4B] py-2 border-solid mx-4 rounded-lg">
            <div
              style={{ display: "flex", alignItems: "center", marginLeft: 20 }}
            >
              <BsKeyFill />
              <h1 style={{ margin: 10, fontFamily: "Montserrat-Semibold" }}>
                Password Terakhir diubah{" "}
                {moment(user?.last_update_password_at).format("DD MMMM YYYY ")}
              </h1>
            </div>
            <div
              style={{
                width: "100%",
                backgroundColor: "#f8f9fd",
                border: "1px solid #f8f9fd",
              }}
            />
            {showUpdatePassword ? (
              <>
                <h1 style={{ margin: 10, fontFamily: "Montserrat-Semibold" }}>
                  Password Lama
                </h1>
                <div
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    disabled={showUpdatePassword ? false : true}
                    onChange={(e) => setPasswordOld(e.target.value)}
                    // className="form__input"
                    className="border-2 border-[#E0BF4B] py-2 border-solid mx-4 rounded-lg pl-2"
                    type={togglePassword ? "text" : "password"}
                    placeholder="Password Lama"
                    name="password"
                    value={passwordOld}
                  />
                  <EyeIcon
                    isVisible={togglePassword}
                    toggleVisibility={() => setTogglePassword(!togglePassword)}
                  />
                </div>

                <h1 style={{ margin: 10, fontFamily: "Montserrat-Semibold" }}>
                  Password Baru
                </h1>
                <div
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    disabled={showUpdatePassword ? false : true}
                    // className="form__input"
                    className="border-2 border-[#E0BF4B] py-2 border-solid mx-4 rounded-lg pl-2"
                    type={toggleNewPassword ? "text" : "password"}
                    placeholder="Password Baru"
                    name="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                  />
                  <EyeIcon
                    isVisible={toggleNewPassword}
                    toggleVisibility={() =>
                      setToggleNewPassword(!toggleNewPassword)
                    }
                  />
                </div>

                <button
                  onClick={() => handleUpdatePassword()}
                  style={{
                    backgroundColor: "#47d147",
                    borderRadius: 10,
                    alignItems: "center",
                    display: "flex",
                    paddingInline: 10,
                    marginTop: 10,
                    marginLeft: 15,
                  }}
                >
                  <h1
                    style={{
                      color: "white",
                      margin: 10,
                      fontSize: 14,
                      fontFamily: "Montserrat-Semibold",
                    }}
                  >
                    Simpan
                  </h1>
                </button>
                {errorPassword ? (
                  <h1
                    style={{
                      margin: 10,
                      color: "red",
                      fontFamily: "Montserrat-Semibold",
                    }}
                  >
                    {errorPassword}
                  </h1>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="containerCardProfile">
      <div className="cardProfile">
        <div className="profileInfo">
          <p
            className="textProfile"
            style={{ fontFamily: "Montserrat-Semibold" }}
          >
            Profil
          </p>
          <row className="headerCpass">
            <div className="containerProfile">
              {
                <img
                  src={
                    user?.picture
                      ? process.env.URL_ASSET_PROFILE + user.picture
                      : "/images/icons/userIcon.png"
                  }
                  width={200}
                  height={100}
                  alt="Avatar"
                  className="imageProfile"
                />
              }
              <label for="files">
                <div className="middleProfile">
                  {/* <img
                    src="/images/icons/takePicture.png"
                    style={{ opacity: 0.5, width: "2rem" }}
                  /> */}
                  {/* <div
                    className="textProfile1"
                    style={{ fontFamily: "Montserrat-Semibold" }}
                  >
                    Maks. file : 1Mb Format : .jpg, .jpeg, .png
                  </div> */}
                </div>
                <div className="tar">
                  <div className="buttonchangecamera">
                    <img
                      alt="take-logo"
                      src="/images/icons/takePicture.png"
                      width={40}
                    />
                  </div>
                </div>
              </label>
              <input
                onChange={(event) =>
                  _handleBackgroundChange(event.target.files[0])
                }
                type="file"
                accept="image/*"
                id="files"
                style={{ display: "none" }}
              />
            </div>
          </row>
          <div >
            <p
              className="textProfile"
              style={{ marginBottom: "7px", fontFamily: "Montserrat-Semibold" }}
            >
              {user?.first_name + " " + user?.last_name}
            </p>
            <div >
            <p
              className="textEmail"
              style={{ fontFamily: "Montserrat-Semibold", }}
            >
              {user?.email.length > 30 ? `${user?.email.substring(0, 30)}...` : `${user?.email}`}
            </p>
            </div>
            
          </div>
          <div className="line1"></div>
        </div>
        <div className="profileMenus">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <button
              onClick={() => setHeader(1)}
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
            <div className="line"></div>
            <button
              onClick={() => setHeader(0)}
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
            <div className="line"></div>
            <button
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
            <div className="line"></div>
            <button
              onClick={() => {
                handleLogout();
              }}
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
          </div>
        </div>
      </div>
      <div className="container-tab-profile">
        <div className="containerCardInformation">
          <div className="cardInformation">
            {header == 1 ? (
              <div className="tabProfileRow">
                <div
                  style={{
                    cursor: "pointer",
                    fontFamily: "Montserrat-Semibold",
                    borderBottom: "5px solid #E0BF4B",

                    fontFamily: "Montserrat-Semibold",
                  }}
                  className="tabProfile"
                >
                  <p
                    className="textTabProfile"
                    style={{
                      fontWeight: "bold",
                      color: "#050505",
                      cursor: "pointer",
                      fontFamily: "Montserrat-Semibold",
                    }}
                  >
                    Dashboard
                  </p>
                </div>
              </div>
            ) : (
              <div className="tabProfileRow">
                {tabDataUserOnetime.map((tab) => (
                  <div
                    style={
                      tabIndex === tab.index
                        ? {
                            borderBottom: "5px solid #E0BF4B",
                            fontFamily: "Montserrat-Semibold",
                          }
                        : {
                            cursor: "pointer",
                            fontFamily: "Montserrat-Semibold",
                          }
                    }
                    key={tab.index}
                    className="tabProfile"
                    onClick={() => {
                      // analyticClickTab(tab.title)
                      setTabIndex(tab.index);
                    }}
                  >
                    <p
                      className="textTabProfile"
                      style={{
                        fontWeight: "bold",
                        color: "#050505",
                        cursor: "pointer",
                        fontFamily: "Montserrat-Semibold",
                      }}
                    >
                      {tab.title}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div
              style={{
                width: "100%",
                backgroundColor: "#f8f9fd",
                border: "1px solid #f8f9fd",
              }}
            />
            {header == 1
              ? _renderDashboard()
              : tabIndex === 1
              ? _renderInformation()
              : tabIndex === 2
              ? _renderConnect()
              : tabIndex === 3
              ? _renderPassword()
              : null}
          </div>
        </div>
      </div>
      <Modal
        isOpen={showModalProfile}
        onClose={() => setShowModalProfile(false)}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            height: 300,
            width: 300,
          }}
        >
          <div>
            <div
              onClick={() => setShowModalProfile(false)}
              style={{
                display: "flex",
                alignContent: "flex-end",
                justifyContent: "flex-end",
                marginBottom: 20,
              }}
            >
              <img src="/images/icons/close.svg" alt="close" />
            </div>
          </div>
         
          <div className="crop-container" style={{ marginTop: 100 }}>
            <Cropper
              image={imagePathSecond}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              classes={{
                cropAreaClassName: "Crop_Area Crop_AreaRound",
                containerClassName: "Crop_Container",
                mediaClassName: "Crop_Image",
              }}
              disableAutomaticStylesInjection
            />
          </div>
          <button
            onClick={() => {
              setShowModalProfile(false);
              updateProfile();
            }}
            style={{
              backgroundColor: "#47d147",
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              paddingInline: 10,
              height: 30,
            }}
          >
            <h1
              style={{
                margin: 10,
                fontSize: 14,
                textAlign: "center",
                fontFamily: "Montserrat-Semibold",
                color: 'white'
              }}
            >
              Update Foto
            </h1>
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CardProfile;
