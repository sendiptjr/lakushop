// import { useDispatch } from 'react-redux';

import { currencyFormat } from "utils/helper";
// import { ProductStoreType } from 'types';
// import { currencyFormat } from 'utils/helper';

const ShoppingCart = ({ item, setProductCount, removeFromCart }: any) => {
  return (
    <div className="cart-product">
      {/* <div> */}
      <img
        alt="img-item"
        width={80}
        height={80}
        src={process.env.URL_ASSET_PRODUCT + item?.Product?.img_thumbnail}
        style={{ marginRight: 20, borderRadius: "50%" }}
      />
      {/* </div> */}
      <div className="cart-product__content">
        <h3 style={{ fontFamily: "Montserrat-Semibold" }}>
          {item?.Product?.name}
        </h3>
        <p
          className="cart-product__price"
          style={{ fontFamily: "Montserrat-Semibold" }}
        >
          {" "}
          Rp. {currencyFormat(item?.Product?.current_price)}
        </p>
      </div>
      <div
        className="quantity-button"
        style={{ marginLeft: 5, marginRight: 5 }}
      >
        <button
          type="button"
          style={{
            marginLeft: 5,
            fontSize: 16,
            marginRight: 5,
            color: "black",
          }}
          onClick={() => setProductCount(item?.qty - 1, item?.product_id)}
          className="quantity-button__btn"
        >
          -
        </button>
        <span  style={{
                fontFamily: "Montserrat-Semibold",}}>{item?.qty}</span>
        <button
          type="button"
          style={{
            marginLeft: 5,
            fontSize: 16,
            marginRight: 5,
            color: "black",
          }}
          onClick={() => setProductCount(item?.qty + 1, item?.product_id)}
          className="quantity-button__btn"
        >
          +
        </button>
      </div>
      {/* <div className="cart-product__price" style={{ fontFamily: 'Montserrat-Semibold' }}>
      Rp. {currencyFormat(item?.Product?.current_price)}
    </div> */}
      <div className="cart-product__cancel" style={{ marginLeft: 20 }}>
        <i className="icon-cancel" onClick={() => removeFromCart(item)}></i>
      </div>
    </div>
  );
};

export default ShoppingCart;
