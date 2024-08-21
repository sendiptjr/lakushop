import Skeleton from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";

const ProductsLoading = () => {
  const isMobile = window.innerWidth <= 768; // Adjust the threshold as needed

  const productImageStyle = {
    width: isMobile ? 150 : 250,
    height: isMobile ? 150 : 250,
  };

  const productImage2Style = {
    width: isMobile ? 150 : 200,
    height: isMobile ? 20 : 50,
  };

  const productDescriptionStyle = {
    width: isMobile ? 150 : 200,
    height: isMobile ? 20 : 50,
  };

  return (
   <div style={{marginRight: 10}}>
     <Skeleton style={productImageStyle} className='product__image' />
      <Skeleton style={productImage2Style} className='product__image' />
      <Skeleton style={productDescriptionStyle} className='product__description' />
   </div>
  );
};
  
export default ProductsLoading