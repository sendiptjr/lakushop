import Link from "next/link";
import { useRouter } from "next/router";
// import { some } from 'lodash';
// import { useDispatch, useSelector } from 'react-redux';
// import { toggleFavProduct } from 'store/reducers/user';
// import { RootState } from 'store';
import { currencyFormat } from "utils/helper";
const ProductItem = ({ images, id, name, currentPrice, price, type }: any) => {
  const router = useRouter();
  // const dispatch = useDispatch();
  // const { favProducts, } = useSelector((state: RootState) => state.user);

  // const isFavourite = some(favProducts, productId => productId === id);

  // const toggleFav = () => {
  //   dispatch(toggleFavProduct(
  //     {
  //       id,
  //     }
  //   ))
  // }
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 344;
  const isMobileMidle =
    typeof window !== "undefined" &&
    window.innerWidth > 280 &&
    window.innerWidth <= 760;

  return (
    <div
      onClick={() =>
        router.push({ pathname: "/product/detail", query: { id: id } })
      }
      style={{ cursor: "pointer" }}
      className={`${
        isMobileMidle
          ? "product-item cardProduct-sm"
          : "product-item cardProduct"
      }`}
    >
      <div
        className={`${
          isMobile && type
            ? "product__image_sm"
            : isMobileMidle && type
            ? "product__image_md"
            : isMobileMidle
            ? "product__image_default"
            : "product__image"
        }  `}
      >
        {/* <button type="button" onClick={toggleFav} className={`btn-heart ${isFavourite ? 'btn-heart--active' : ''}`}><i className="icon-heart"></i></button> */}

        <Link href={{ pathname: `/product/detail`, query: { id: id } }}>
          <img
            src={images ? process.env.URL_ASSET_PRODUCT + images : ""}
            alt=""
            style={{ borderRadius: 8 }}
          />
          {/* {discount && 
              <span className="product__discount">{discount}%</span>
            } */}
        </Link>
      </div>

      <div className="product__description">
        <h3 style={{ fontFamily: "Montserrat-SemiBold", textAlign: "center" }}>
          {name}
        </h3>
        {price != currentPrice ? (
          <h1
            style={{
              textDecorationLine: "line-through",
              color: "#b3b2b2",
              fontFamily: "Montserrat-Semibold",
              fontSize: isMobileMidle ? 14 : isMobile ? 12 : 14,
              textAlign: "center",
            }}
          >
            Rp. {currencyFormat(price)}
          </h1>
        ) : (
          <h1
            style={{
              color: "transparent",
              fontFamily: "Montserrat-Semibold",
              fontSize: isMobileMidle ? 14 : isMobile ? 12 : 14,
              textAlign: "center",
            }}
          >
            Rp. {currencyFormat(price)}
          </h1>
        )}
        <div
          style={{
            justifyContent: "center",
          }}
          className={
            "product__price " +
            (price != currentPrice ? "product__price--discount" : "")
          }
        >
          <h4
            style={{
              fontFamily: "Montserrat-SemiBold",
              fontSize: isMobileMidle ? 14 : isMobile ? 12 : 14,
              textAlign: "center",
            }}
          >
            Rp. {currencyFormat(currentPrice)}
          </h4>

          {/* {discount &&   */}

          {/* } */}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
