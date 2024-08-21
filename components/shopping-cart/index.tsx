import { useDispatch, useSelector } from "react-redux";
import CheckoutStatus from "../../components/checkout-status";
import Item from "./item";
import Link from "next/link";
import { currencyFormat, trackingAnalytics } from "utils/helper";
import { useEffect, useState } from "react";
import axios from "./../../config/axiosConfig";
import { setUserLogged } from "store/reducers/user";
import { useRouter } from "next/router";
import { setCountCart } from "store/reducers/cart";
import { setSuccessTransaction } from "store/reducers/transaction";
import { RootState } from "store";
import LoadingSpinner from "components/loading-spinner";
import { CartDetail } from "types";
import Modal from "components/modal";
import { GoInfo } from "react-icons/go";

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [data, setData] = useState<CartDetail[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const fetchListCart = async () => {
    try {
      const res = await axios.get(`transaction/api/cart`);
      setData(res?.data?.data);
      // setGrandTotal(res?.data?.data?.GrandTotal);
    } catch (error) {
      localStorage.removeItem("token");
      dispatch(setUserLogged(null));
      router.push("/");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchListCart();
      trackingAnalytics("page_view_checkout", user?.first_name, user?.email);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Hitung total harga saat komponen dimuat dan setiap kali ada perubahan pada item
      calculateTotalPrice();
    }
  }, [data]); // data sebagai dependensi

  const calculateTotalPrice = () => {
    let total = 0;
    data.forEach((item) => {
      total += item?.qty * item?.Product?.current_price;
    });
    setGrandTotal(total);
  };

  const handleUpdate = (count: any, idx: number, id: any) => {
    // Jika item ditemukan, perbarui jumlahnya
    if (idx >= 0 && idx < data.length && count >= 0) {
      const updatedData = [...data];
      updatedData[idx].qty = count;
      setData(updatedData);
      let value = {
        product_id: id,
        qty: count,
      };
      fetchUpdate(value);
    }
  };
  const fetchUpdate = async (data: any) => {
    try {
      const res = await axios.post(`transaction/api/cart/update_item`, data);
      if (res) {
        fetchListCart();
      }
    } catch (error) {
      localStorage.removeItem("token");
      dispatch(setUserLogged(null));
      router.push("/");
    }
  };
  const fetchRemove = async (id: any) => {
    try {
      const res = await axios.get(`transaction/api/cart/remove_item/${id}`);
      if (res) {
        fetchListCart();
        const resp = await axios.get("transaction/api/cart/total_item");
        dispatch(setCountCart(resp?.data?.data));
      }
    } catch (error) {
      localStorage.removeItem("token");
      dispatch(setUserLogged(null));
      router.push("/");
    }
  };

  const handleRemove = async (id: any) => {
    fetchRemove(id);
  };

  const paymentOy = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`transaction/api/trx/checkout`);
      if (res) {
        setError("");
        trackingAnalytics("Success_Checkout", user?.first_name, user?.email);
        dispatch(setSuccessTransaction(res?.data));
        dispatch(setCountCart(0));
        setLoading(false);
        router.push({
          pathname: "/transaction/detail",
          query: { code: res?.data?.data?.code },
        });
      }
    } catch (error: any) {
      setLoading(false);
      setShow(true)
      setError(error?.res?.data?.error);
      // localStorage.removeItem("token");
      // dispatch(setUserLogged(null));
      // router.push("/");
    }
  };

  const renderCart = () => {
    const dataProduct = data;

    return (
      <div
        style={{
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {dataProduct &&
          dataProduct.map((item: any, idx: number) => (
            <Item
              key={idx}
              item={item}
              setProductCount={(count: any, id: any) => {
                if (count === 0) {
                } else {
                  handleUpdate(count, idx, id);
                }
              }}
              removeFromCart={(value: any) => handleRemove(value?.product_id)}
            />
          ))}
      </div>
    );
  };

  const isMobileMidle =
    typeof window !== "undefined" && window.innerWidth > 800;
  return (
    <section className="cart">
      <Modal isOpen={show} onClose={() => setShow(false)}>
      <div className="flex items-center flex-col">
          <GoInfo size={50} color="#E0BF4B" />
          <h1 className="my-4 mx-4 text-center">{error ? error : `Telah terjadi kesalahan, Silahkan mencoba beberapa saat lagi.`}</h1>
          <div onClick={() => setShow(false)} className=" cursor-pointer btn bg-[#E0BF4B] p-2 rounded-md">
            <h1>OK</h1>
          </div>
        </div>
      </Modal>
      <div className="container-product">
        <div className="cart__intro">
          <Link href="/products">
            <a
              style={{ fontFamily: "Montserrat-Semibold" }}
              className="cart__btn-back"
            >
              <i
                className="icon-left"
                style={{ fontFamily: "Montserrat-Semibold" }}
              ></i>{" "}
              Back
            </a>
          </Link>

          <CheckoutStatus step="cart" />
        </div>
        {/* <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={() => {
              router.push("/products");
            }}
            style={{
              backgroundColor: "#33d65c",
              cursor: "pointer",
              borderRadius: 10,
              padding: 10,
              maxWidth: 200,
              marginBottom: 10,
            }}
          >
            <h1
              style={{
                color: "white",
                textAlign: "center",
                fontFamily: "Montserrat-Semibold",
              }}
            >
              Tambah Produk
            </h1>
          </div>
        </div> */}

        <div
          className="cart-list"
          style={{
            flexDirection: "column",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          {data.length > 0 && renderCart()}
          {data.length === 0 && (
            <p
              style={{
                fontFamily: "Montserrat-Semibold",
              }}
            >
              Belum ada produk dikeranjang
            </p>
          )}
        </div>

        <div className="cart-actions">
          {/* <div className="cart__btn-back"></div> */}
          {/* <input type="text" placeholder="Promo Code" className="cart__promo-code" /> */}

          <div
            className="cart-actions__items-wrapper"
            style={{
              flexDirection: isMobileMidle ? "row" : "column",
            }}
          >
            <p
              className="cart-actions__total"
              style={{
                fontFamily: "Montserrat-Semibold",
                alignItems: "center",
                display: "flex",
                marginRight: 0,
              }}
            >
              Total cost <strong>Rp. {currencyFormat(grandTotal)}</strong>
            </p>
            <div style={{ marginTop: 10 }}>
              <div
                onClick={() => {
                  router.push("/products");
                }}
                className="btn btn--rounded "
                style={{
                  backgroundColor: "#E0BF4B",

                  cursor: "pointer",
                  borderRadius: 25,
                  padding: 10,
                  maxWidth: 200,
                }}
              >
                <h1
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontFamily: "Montserrat-Semibold",
                    fontSize: isMobileMidle ? 14 : 10,
                  }}
                >
                  Add Product
                </h1>
              </div>

              <button
                disabled={data.length === 0 || loading ? true : false}
                onClick={() => paymentOy()}
              >
                <a
                  className="btn btn--rounded "
                  style={{
                    backgroundColor: "#04AA87",
                    fontFamily: "Montserrat-Semibold",
                    opacity: data.length === 0 ? 0.5 : 1,
                    color: "white",
                    padding: 10,
                    fontSize: isMobileMidle ? 14 : 10,
                  }}
                >
                  {loading ? <LoadingSpinner loading={loading} /> : "Checkout"}
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShoppingCart;
