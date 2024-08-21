import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../layouts/Main";
import Header from "components/header";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import axios from "./../../config/axiosConfig";
import moment from "moment";
import {
  currencyFormat,
  trackingAnalytics,
  trackingAnalyticsPurchase,
} from "utils/helper";
import EyeIcon from "components/eye";
import { setCountCart } from "store/reducers/cart";
// import { IoMdCopy } from "react-icons/io";
const Product = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [transactions, setTransactions] = useState<any>();
  const { user } = useSelector((state: RootState) => state.user);
  const [visibleCards, setVisibleCards] = useState<{ [key: number]: boolean }>(
    {}
  );
  useEffect(() => {
    if (router?.query?.code) {
      trackingAnalytics(
        `page_view_transaction_detail`,
        user?.first_name,
        user?.email
      );
      const fetchProduct = async () => {
        try {
          const res = await axios.get(
            `transaction/api/trx/detail/${router?.query?.code}`
          );
          // console.log(JSON.stringify(res?.data?.data));
          setTransactions(res?.data?.data);
        } catch (error) {
          router?.push("/");
        }
      };
      fetchProduct();
    }
  }, [router?.query?.code]);

  useEffect(() => {
    const value = localStorage.getItem(transactions?.code);

    if (value === null) {
      localStorage.setItem(transactions?.code, transactions?.code);
      if (transactions?.payment_status === "1") {
        const params10 = {
          transaction_id: transactions?.code,
          currency: "IDR",
          value: transactions?.total_payment,
          items: transactions?.transaction_detail_list,
        };
        trackingAnalyticsPurchase("purchase", params10);
      }
    }
  }, [transactions]);
  const toggleVoucherVisibility = (voucherCode: number) => {
    setVisibleCards((prevVisibleCards) => ({
      ...prevVisibleCards,
      [voucherCode]: !prevVisibleCards[voucherCode],
    }));
  };
  const getMaskedVoucherCode = (value: any, index: any) => {
    // const visiblePart = visibleCards ? value : value?.slice(0, 4);
    return visibleCards[index] ? value  : value;
  };

  const handleCheckout = async () => {
    try {
      const body = {
        transaction_code: transactions?.code,
      };
      trackingAnalytics(`success_reorder`, user?.first_name, user?.email);
      await axios.post(`transaction/api/trx/reorder`, body);
      const resp = await axios.get("transaction/api/cart/total_item");
      dispatch(setCountCart(resp?.data?.data));
      router?.push("/cart");
    } catch (error) {}
  };
  // const handleXendit = async(item: any) => {

  //   const data = {
  //     "external_id": "payment-link-example",
  //     "amount": item?.total_payment,
  //     "items": [
  //       {
  //         "name": "Voucher Emas",
  //         "quantity": item?.total_product,
  //         "price": item?.total_payment,
  //         "category": "Gold",
  //         "url": "https://yourcompany.com/example_item"
  //       }
  //     ]
  //   }
  //   try {
  //     const username = 'xnd_development_2b7OqsDBnYrmKdorBKnly7PA7OHFe3ESvz5P0RraoVfi4tyzv8UdE0IiS2LNwDHN';
  //     const password = '';
  //     const credentials = btoa(`${username}:${password}`);
  //     const response = await fetch('https://api.xendit.co/v2/invoices', {
  //       method: 'POST',
  //       mode: 'cors',
  //       cache: 'no-cache',
  //       credentials: 'same-origin',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Basic ${credentials}`,
  //       },
  //       redirect: 'follow',
  //       referrerPolicy: 'no-referrer',
  //       body: JSON.stringify(data)
  //     });
  //     const jsonData = await response.json();
  //     window.open(jsonData?.invoice_url, "_blank")
  //     // setTransactions(res?.data?.data);
  //     // setGrandTotal(res?.data?.data?.GrandTotal);
  //   } catch (error) {
  //     // localStorage.removeItem("token");
  //     // dispatch(setUserLogged(null));
  //     // router.push("/");
  //   }
  // }
  const isMobileMidle =
    typeof window !== "undefined" && window.innerWidth <= 800;

    const formatTime = (value: any) => {
      const responseTime = value;
      const parsedTime = moment(responseTime);
      const formatted = parsedTime.format("YYYY-MM-DD HH:mm");
      return formatted;
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
  return (
    <Layout>
      <Header />
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div
          onClick={() => router.push("/transaction")}
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            margin: 20,
          }}
        >
          {/* <div style={{ fontSize: 18 }}>Profile</div> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Outline"
            viewBox="0 0 24 24"
            width="35"
            height="35"
          >
            <path d="M19,11H9l3.29-3.29a1,1,0,0,0,0-1.42,1,1,0,0,0-1.41,0l-4.29,4.3A2,2,0,0,0,6,12H6a2,2,0,0,0,.59,1.4l4.29,4.3a1,1,0,1,0,1.41-1.42L9,13H19a1,1,0,0,0,0-2Z" />
          </svg>
          <div style={{ fontSize: 18, fontFamily: "Montserrat-Semibold" }}>
            Transaksi
          </div>
        </div>
        <div
          style={{
            overflowY: isMobileMidle ? "auto" : "hidden",
          }}
        >
          <div className="cardTransaction">
            <div style={{ flexDirection: "row", display: "flex" }}>
              <h1
                className="transaction_status"
                style={{
                  color:
                  transactions?.payment_status === "1"
                  ? "#5ACC4D"
                  : transactions?.payment_status === "0"
                  ? "#E0BF4B"
                  : "red",
                  fontFamily: "Montserrat-Semibold",
                }}
              >
                {returnStatus(transactions?.payment_status)}
                -
              </h1>{" "}
              <h1
                className="transaction_status"
                style={{
                  color: "#E0BF4B",
                  fontFamily: "Montserrat-Semibold",
                }}
              >
                {transactions?.code}
              </h1>
            </div>
            <div
              style={{ flexDirection: "row", display: "flex", marginTop: 10 }}
            >
              <h1
                className="transaction_status"
                style={{ flex: 1, fontFamily: "Montserrat-Semibold" }}
              >
                Tanggal Transaksi
              </h1>
              <h1
                className="transaction_status"
                style={{ fontFamily: "Montserrat-Semibold" }}
              >
                {formatTime(transactions?.order_date)}{" "}
                WIB
              </h1>
            </div>
            
            <div
              style={{ flexDirection: 'row', flexWrap: 'wrap', display: 'flex', marginTop: 10 }}
            >
              <h1
                className="transaction_status"
                style={{ flex: 1, fontFamily: "Montserrat-Semibold" }}
              >
                Dikirim ke
              </h1>
              <h1
                className="transaction_status"
                style={{
                  fontFamily: "Montserrat-Semibold",
                  marginLeft: 0,
                  fontStyle: 'italic',
                  textDecoration: 'underline',
                  color: "#149cff",
                }}
              >
                {user?.email}
              </h1>
            </div>
            { transactions?.payment_status === "1" && transactions?.transaction_detail_list[0].CampaignVouchers?.length > 0 ? 
            <div
              style={{ flexDirection: 'row', flexWrap: 'wrap', display: 'flex', marginTop: 10 }}
            >
              <h1
                className="transaction_status"
                style={{ flex: 1, fontFamily: "Montserrat-Semibold" }}
              >
                Masa Aktif Hingga
              </h1>
              <h1
                className="transaction_status"
                style={{
                  fontFamily: "Montserrat-Semibold",
                  marginLeft: 0,
                  color: "black",
                }}
              >
                {formatTime(transactions?.voucher_valid_until)} WIB
              </h1>
            </div> : null }
            <div
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "#f1f1f1",
                marginTop: 20,
                marginBottom: 20,
                borderStyle: "solid",
              }}
            />
            <h1
              className="transaction_status"
              style={{ flex: 1, fontFamily: "Montserrat-Semibold" }}
            >
              Detail Barang
            </h1>
            {transactions?.transaction_detail_list?.map((item: any) => (
              <div className="cart-product">
                <div className="transaction-product__img_cart">
                  <img
                    src={process.env.URL_ASSET_PRODUCT + item?.payment_img}
                    alt="img-detail"
                  />
                </div>

                <div className="cart-product__content">
                  <h1
                    className="transaction_status"
                    style={{ fontFamily: "Montserrat-Semibold" }}
                  >
                    {item?.product_name}
                  </h1>
                  <h1
                    className="transaction_status"
                    style={{ fontFamily: "Montserrat-Semibold" }}
                  >
                    {item?.qty} Qty
                  </h1>
                  <h1
                    className="transaction_status"
                    style={{ fontFamily: "Montserrat-Semibold" }}
                  >
                    Total Price Rp. {currencyFormat(item.total_price)}
                  </h1>
                  {item.CampaignVouchers?.valid_until &&
                  transactions?.payment_status != "0" ? (
                    <h1
                      className="transaction_status"
                      style={{ fontFamily: "Montserrat-Semibold" }}
                    >
                      Rp. {currencyFormat(item.price)} - Exp.{" "}
                      {item.CampaignVouchers?.valid_until &&
                      transactions?.payment_status != "0"
                        ? moment(item.CampaignVouchers?.valid_until).format(
                            "DD MMMM YYYY"
                          )
                        : ""}
                    </h1>
                  ) : (
                    <h1
                      className="transaction_status"
                      style={{ fontFamily: "Montserrat-Semibold" }}
                    >
                      @ Rp. {currencyFormat(item.price)}
                    </h1>
                  )}
                  <div
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: "#E0BF4B",
                      marginTop: 20,
                      borderStyle: "solid",
                    }}
                  />
                  {transactions?.payment_status != "0"
                    ? item?.CampaignVouchers?.map((value: any) => (
                        <div
                          style={{
                            borderWidth: 1,
                            borderColor: "#f1f1f1",
                            marginTop: 20,
                            marginBottom: 20,
                            borderStyle: "solid",
                            padding: 20,
                            borderRadius: 20,
                          }}
                        >
                          <h1
                            className="transaction_status"
                            style={{
                              fontFamily: "Montserrat-Semibold",
                              color:
                                value?.voucher_status === "0"
                                  ? "#00AA13"
                                  : value.voucher_status === "1"
                                  ? "#E0BF4B"
                                  : "red",
                            }}
                          >
                            {value?.voucher_status === "0"
                              ? "Voucher Belum Terpakai"
                              : value.voucher_status === "1"
                              ? "Voucher Terpakai"
                              : "Voucher Expired"}
                          </h1>
                          <div
                            style={{ flexDirection: "row", display: "flex" }}
                          >
                            <h3
                              className="transaction_status"
                              style={{
                                fontFamily: "Montserrat-Semibold",
                                marginRight: 5,
                              }}
                            >
                              {getMaskedVoucherCode(
                                value.voucher_code,
                                value.voucher_code
                              )}
                            </h3>
                            <EyeIcon
                              isVisible={visibleCards[value.voucher_code]}
                              toggleVisibility={() =>
                                toggleVoucherVisibility(value.voucher_code)
                              }
                            />
                            
                          </div>
                  
                          {visibleCards[value.voucher_code] ? 
                            <h1
                            className="transaction_status"
                            style={{
                              fontFamily: "Montserrat-Semibold",
                              marginLeft: 0,
                              fontStyle: 'italic',
                              textDecoration: 'underline',
                              color: "#149cff",
                            }}
                          >
                            {'Cek Kode Voucher yang dikirim ke email anda'}
                          </h1> : null }
                          {/* <button
                            onClick={() => {
                              navigator.clipboard.writeText(value.voucher_code);
                              alert("Berhasil Salin Voucher");
                            }}
                            style={{
                              flexDirection: "row",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <IoMdCopy color="#149cff" />
                            <h1
                              className="transaction_status"
                              style={{
                                fontFamily: "Montserrat-Semibold",
                                color: "#149cff",

                                marginLeft: 5,
                              }}
                            >
                              Salin Voucher
                            </h1>
                          </button> */}
                        </div>
                      ))
                    : null}
                    {transactions?.payment_status !=  "0" && transactions?.payment_status != '2' && item?.CampaignVouchers === null ?
                    <div>
                      <h1
                      className="transaction_status"
                      style={{ fontFamily: "Montserrat-Semibold", color: 'gray', marginTop: 20 }}
                    >
                      Sedang proses generate voucher . . .
                    </h1></div> : null}
                </div>
              </div>
            ))}
            <div
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "#f1f1f1",
                marginTop: 20,
                marginBottom: 20,
                borderStyle: "solid",
              }}
            />
            <div className="flexResponsive">
              {transactions?.payment_status === "0" ? (
                <button
                  onClick={() => {
                    // handleXendit(transactions)
                    window.open(transactions?.payment_url, "_blank");
                    trackingAnalytics(
                      `click_payment`,
                      user?.first_name,
                      user?.email
                    );
                  }}
                  style={{
                    backgroundColor: "#E0BF4B",
                    padding: 15,
                    paddingInline: 30,
                    borderRadius: 20,
                    minWidth: 200,
                    margin: 10,
                  }}
                >
                  <h1
                    className="transaction_status"
                    style={{
                      color: "white",
                      fontFamily: "Montserrat-Semibold",
                    }}
                  >
                    Bayar Sekarang
                  </h1>
                </button>
              ) : null}
              <button
                onClick={() => {
                  handleCheckout();
                }}
                style={{
                  backgroundColor: "#04AA87",
                  padding: 15,
                  paddingInline: 30,
                  borderRadius: 20,
                  minWidth: 200,
                }}
              >
                <h1
                  className="transaction_status"
                  style={{ color: "white", fontFamily: "Montserrat-Semibold" }}
                >
                  Beli kembali
                </h1>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Product;
