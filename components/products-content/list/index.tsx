import { useEffect, useState } from "react";
import ProductItem from "../../product-item";
import ProductsLoading from "./loading";
import axios from "./../../../config/axiosConfig";

import "react-loading-skeleton/dist/skeleton.css";
const ProductsContent = () => {
  const [dataProduct, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
    setLoading(true);
    fetchProduct();
    }
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`product/api/list`);
      setProduct(res?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
          <>
        <ProductsLoading />
        <ProductsLoading />
        <ProductsLoading />
        <ProductsLoading />
        <ProductsLoading />
        <ProductsLoading />
        </>
      ) : (
        <section className="products-list">
          {dataProduct.map((item: any) => (
            <ProductItem
              id={item.id}
              name={item.name}
              price={item.price}
              discount={item.discount}
              currentPrice={item.current_price}
              key={item.id}
              images={item.img_thumbnail}
              data={item}
              type={'list'}
            />
          ))}
        </section>
      )}
    </>
  );
};

export default ProductsContent;
