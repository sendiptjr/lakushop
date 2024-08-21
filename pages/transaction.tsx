import Header from "components/header";
import Layout from "../layouts/Main";
import { useEffect, useState } from "react";
// import { currencyFormat } from "utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { useRouter } from "next/router";
import axios from "./../config/axiosConfig";
import { resetUser, setUserLogged } from "store/reducers/user";
import { resetCart, setCountCart } from "store/reducers/cart";
import { currencyFormat, trackingAnalytics } from "utils/helper";
import moment from "moment";
import { MdOutlineShoppingCart, MdCalendarMonth } from "react-icons/md";
import { resetTransaction } from "store/reducers/transaction";
import Footer from "components/footer";

const Transaction = ({}) => {
  const [showLogin, setShowLogin] = useState(false);
  const [menu] = useState([
    {
      name: "Semua Transaksi",
      value: "",
    },
    {
      name: "Menunggu Pembayaran",
      value: 0,
    },
    {
      name: "Transaksi Selesai",
      value: 1,
    },
    {
      name: "Transaksi Dibatalkan",
      value: 2,
    },
  ]);
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [keyword, setKeyword] = useState("");

  const [header, setHeader] = useState('');
  const dispatch = useDispatch();
  const [searchOpen, setSearchOpen] = useState(false);
  // const memoizedTransaction = useMemo(() => transaction, [transaction]);
  const { user } = useSelector((state: RootState) => state.user);
  // useMemo(() => {
  //   if (memoizedTransaction) {
  //     setTransactions(memoizedTransaction);
  //   }
  // }, [memoizedTransaction]);

  const fetchListTransaction = async () => {
    try {
      const res = await axios.get(
        `transaction/api/trx/list?code=${keyword}&status=${header}`
      );
      setTransactions(res?.data?.data);
      // setGrandTotal(res?.data?.data?.GrandTotal);
    } catch (error) {
      localStorage.removeItem("token");
      dispatch(setUserLogged(null));
      router.push("/");
    }
  };

  useEffect(() => {
    fetchInfo();
    fetchListTransaction();
    trackingAnalytics(`page_view_transaction`, user?.first_name, user?.email);
  }, [keyword, header]);
  const fetchInfo = async () => {
    try {
      const resp = await axios.get("user/api/profile");
      dispatch(setUserLogged(resp?.data?.data));
      const res = await axios.get("transaction/api/cart/total_item");
      dispatch(setCountCart(res?.data?.data));
    } catch (error) {}
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setUserLogged(null));
    dispatch(resetCart());
    dispatch(resetTransaction());
    dispatch(resetUser());
    router.push("/");
  };
  const returnStatus = (status: any): string => {
    let stat;
    if (status === "0") {
      stat = "Menunggu Pembayaran";
    } else if (status === "1") {
      stat = "Transaksi Selesai";
    } else if (status === "2") {
      stat = "Transaksi Dibatalkan";
    } else {
      stat = "Menunggu Pembayaran";
    }
    return stat;
  };

  // const handleXendit = async (item: any) => {
  //   const data = {
  //     external_id: "payment-link-example",
  //     amount: item?.total_payment,
  //     items: [
  //       {
  //         name: "Voucher Emas",
  //         quantity: item?.total_product,
  //         price: item?.total_payment,
  //         category: "Gold",
  //         url: "https://yourcompany.com/example_item",
  //       },
  //     ],
  //   };
  //   try {
  //     const username =
  //       "xnd_development_2b7OqsDBnYrmKdorBKnly7PA7OHFe3ESvz5P0RraoVfi4tyzv8UdE0IiS2LNwDHN";
  //     const password = "";
  //     const credentials = btoa(`${username}:${password}`);
  //     const response = await fetch("https://api.xendit.co/v2/invoices", {
  //       method: "POST",
  //       mode: "cors",
  //       cache: "no-cache",
  //       credentials: "same-origin",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Basic ${credentials}`,
  //       },
  //       redirect: "follow",
  //       referrerPolicy: "no-referrer",
  //       body: JSON.stringify(data),
  //     });
  //     const jsonData = await response.json();
  //     window.open(jsonData?.invoice_url, "_blank");
  //     // setTransactions(res?.data?.data);
  //     // setGrandTotal(res?.data?.data?.GrandTotal);
  //   } catch (error) {
  //     // localStorage.removeItem("token");
  //     // dispatch(setUserLogged(null));
  //     // router.push("/");
  //   }
  // };
  const isMobileMidle =
    typeof window !== "undefined" &&
    window.innerWidth > 280 &&
    window.innerWidth <= 760;

  const formatTime = (value: any) => {
    const responseTime = value;
    const parsedTime = moment(responseTime);
    const formatted = parsedTime.format("YYYY-MM-DD HH:mm");
    return formatted;
  };
  
  return (
    <Layout>
      <Header showLogin={showLogin} />
      <div className="containerCardTransaction">
        <div className="cardProfile">
          <div className="profileInfo">
            <p
              className="textProfile"
              style={{ fontFamily: "Montserrat-Semibold" }}
            >
              Profil
            </p>
            <div className="headerCpass">
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
              </div>
            </div>
            <div>
              <p
                className="textProfile"
                style={{
                  marginBottom: "7px",
                  fontFamily: "Montserrat-Semibold",
                }}
              >
                {user?.first_name + " " + user?.last_name}
              </p>
              <p
              className="textEmail"
              style={{ fontFamily: "Montserrat-Semibold", }}
            >
              {user?.email.length > 30 ? `${user?.email.substring(0, 30)}...` : `${user?.email}`}
            </p>
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
                <h1
                  style={{ fontFamily: "Montserrat-Semibold", marginLeft: 10 }}
                >
                  Dashboard
                </h1>
              </button>
              <div className="line"></div>
              <button
                onClick={() =>
                  router.push({ pathname: "/profile", query: { header: 0 } })
                }
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <img src="/images/icons/icon-account.png" width={30} />
                <h1
                  style={{ fontFamily: "Montserrat-Semibold", marginLeft: 10 }}
                >
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
                <h1
                  style={{ fontFamily: "Montserrat-Semibold", marginLeft: 10 }}
                >
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
                <h1
                  style={{ fontFamily: "Montserrat-Semibold", marginLeft: 10 }}
                >
                  Keluar
                </h1>
              </button>
            </div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              margin: 20,
            }}
          >
            {/* <div style={{ fontSize: 18 }}>Profile</div> */}

            <div style={{ fontSize: 18, fontFamily: "Montserrat-Semibold" }}>
              Daftar Transaksi
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: 20,
              // alignItems: "flex-end",
              // justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                flexDirection: "row",
                backgroundColor: "white",
                width: 400,
                borderRadius: 20,
                paddingLeft: 10,
                display: "flex",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="icon-search"
                ></i>
              </div>

              <input
                className={"inputField"}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{
                  padding: 10,
                  borderRadius: 20,
                  flex: 1,
                  fontSize: isMobileMidle ? 12 : 14,
                  fontFamily: "Montserrat-Semibold",
                }}
                placeholder="Cari Nomor Transaksi Anda"
              />
            </div>
          </div>
          <div style={{ margin: 20, paddingBottom: 50 }}>
            <div style={{ backgroundColor: "#f1f1f1" }}>
              <div
                style={{
                  display: "flex",
                  overflowX: "scroll",
                  marginBottom: 10,
                }}
              >
                {menu.map((item: any) => (
                  <div
                    className="textProfile"
                    onClick={() => setHeader(item.value)}
                    style={{
                      cursor: 'pointer',
                      marginRight: 20,
                      backgroundColor:
                        header === item.value ? "#E0BF4B" : "white",
                      paddingInline: 20,
                      paddingTop: 10,
                      padding: 10,
                      borderRadius: 20,
                      fontFamily: "Montserrat-Semibold",
                      textAlign: "center",
                      color: header === item.value ? "white" : "black",
                    }}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {transactions &&
                transactions.map((item: any, idx) => (
                  <div
                    style={{
                      backgroundColor: "white",
                      borderRadius: 20,
                      padding: 20,
                      marginBottom: 10,
                    }}
                  >
                    <div
                      key={idx}
                      // style={{
                      //   flexDirection: "row",
                      //   display: "flex",
                      // }}
                      className="flexResponsive"
                    >
                      <div className="product__transaction">
                        <img
                          // style={{ width: 200, height: 200 }}
                          src={`${process.env.URL_ASSET_PRODUCT}${item.product_img}`}
                          alt="img-transaction"
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginLeft: 20,
                          flex: 1,
                        }}
                      >
                        <h1
                          style={{
                            display: "flex",
                            alignItems: "center",
                            // justifyContent: "center",
                            fontSize: 20,
                          }}
                        >
                          <h1
                            className="transaction_status"
                            style={{
                              fontFamily: "Montserrat-Semibold",
                              color:
                                item?.payment_status === "1"
                                  ? "#5ACC4D"
                                  : item?.payment_status === "0"
                                  ? "#E0BF4B"
                                  : "red",
                            }}
                          >
                            {returnStatus(item?.payment_status)}
                          </h1>{" "}
                          -{" "}
                          <h1
                            className="transaction_status"
                            style={{
                              color: "#E0BF4B",
                              fontFamily: "Montserrat-Semibold",
                            }}
                          >
                            {" "}
                            {` `}
                            {item?.code}
                          </h1>
                        </h1>
                        <h1
                          style={{
                            display: "flex",
                            // alignItems: "center",
                            // justifyContent: "center",
                            fontSize: 26,
                            fontWeight: "bold",
                            fontFamily: "Montserrat-Semibold",
                          }}
                        >
                          Rp. {currencyFormat(item.total_payment)}
                        </h1>
                        <div
                          style={{
                            border: 1,
                            borderStyle: "solid",
                            borderColor: "grey",
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            flex: 1,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 20,
                              flexDirection: "row",
                            }}
                          >
                            <MdCalendarMonth color="black" />{" "}
                            <h1
                              className="transaction_status"
                              style={{ fontFamily: "Montserrat-Semibold" }}
                            >{`${formatTime(item.order_date)} WIB`}</h1>
                          </div>
                          <h1
                            className="transaction_status"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 20,
                              fontFamily: "Montserrat-Semibold",
                            }}
                          >
                            <MdOutlineShoppingCart />
                            {` `} {item.total_product}
                          </h1>
                        </div>
                      </div>
                    </div>
                    <div
                      className="flexResponsive"
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      {item?.payment_status === "0" ? (
                        <button
                          onClick={() =>
                            // handleXendit(item)
                            window.open(item?.payment_url, "_blank")
                          }
                          style={{
                            backgroundColor: "#E0BF4B",
                            padding: 10,
                            paddingInline: 20,
                            borderRadius: 20,
                            fontFamily: "Montserrat-Semibold",
                            margin: 10,
                            minWidth: 200,
                            color: "white",
                          }}
                        >
                          Bayar Sekarang
                        </button>
                      ) : null}
                      {/* <button onClick={() => window.open(transactions?.transactionList?.url, '_blank')} style={{ backgroundColor: '#5ACC4D', marginLeft: 20, padding: 10, paddingInline: 20, borderRadius: 20, color: 'white'}}>Lihat Detail</button> */}
                      <button
                        onClick={() => {
                          router.push({
                            pathname: "/transaction/detail",
                            query: { code: item.code },
                          });
                        }}
                        style={{
                          backgroundColor: "#04AA87",
                          padding: 10,
                          paddingInline: 20,
                          borderRadius: 20,
                          color: "white",
                          fontFamily: "Montserrat-Semibold",
                          margin: 10,
                          minWidth: 200,
                        }}
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                ))}
              {transactions === null ? (
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    marginTop: 20,
                  }}
                >
                  <img
                    src="/images/icons/noTransaction.png"
                    alt="transaction"
                  />
                  <h1
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      marginTop: 20,
                      fontFamily: "Montserrat-Semibold",
                    }}
                  >
                    Data Belum Tersedia
                  </h1>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div style={{ backgroundColor: "white" }}>
      <Footer showLogin={() => setShowLogin(true)}/>
      </div>
    </Layout>
  );
};

export default Transaction;
