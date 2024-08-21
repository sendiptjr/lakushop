import Layout from '../layouts/Main';
import Footer from '../components/footer';
import Breadcrumb from '../components/breadcrumb';
// import ProductsFilter from '../components/products-filter';
import ProductsContent from '../components/products-content';
import Header from 'components/header';
import { useState } from 'react';

const Products = () => {
  const [showLogin, setShowLogin] = useState(false);
 
  return(
    <Layout>
    <Header showLogin={showLogin}/>
    <Breadcrumb />
    <section className="products-page main-detail">
      <div className='container-product'>
        {/* <ProductsFilter /> */}
        <ProductsContent />
      </div>
    </section>
    <Footer showLogin={() => setShowLogin(true)}/>
  </Layout>
  )
 
}
  
export default Products
  