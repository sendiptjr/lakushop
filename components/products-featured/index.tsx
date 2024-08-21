import ProductsCarousel from './carousel';
import Link from 'next/link';
import axios from "./../../config/axiosConfig";
import { useEffect, useState } from 'react';
import ProductsLoading from "./loading";
const ProductsFeatured = () => {
  const [dataProduct, setProduct] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined') {
    setLoading(true)
    fetchProduct()
    }
  }, []) 

  const fetchProduct = async() => {
    try {
      const res = await axios.get(`product/api/list`);
      setProduct(res?.data?.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  
 
  return (
    <section className="section section-products-featured">
      <div className="container">
        <header className="section-products-featured__header" style={{marginTop: 20}}>
        <h3 style={{ fontFamily: "Montserrat-Semibold" }}>Produk Terbaru untuk kamu</h3>
          <Link href="/products">
          <a title="products" className="btn btn--rounded btn--border"  style={{ fontFamily: "Montserrat-Semibold", textAlign: 'center' }}>Lihat Semua</a>
          </Link>
         
        </header>
        {loading ? (
        <div style={{flexDirection: 'row', display: 'flex'}}>
            <ProductsLoading />
            <ProductsLoading />
            <ProductsLoading />
            <ProductsLoading />
            <ProductsLoading />
        </div>
        
      
      ) :
        <ProductsCarousel products={dataProduct} /> }
      </div>
    </section>
  )
};

export default ProductsFeatured