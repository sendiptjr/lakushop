import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { currencyFormat } from 'utils/helper';
import LoadingSpinner from "./../../../components/loading-spinner/index";
// import { RootState } from 'store';
import parse from 'html-react-parser';

const Content = ({ product, addToCart, loading } : any) => {
  // const dispatch = useDispatch();
  const [count, setCount] = useState<number>(1);
  const [show, setShow] = useState<boolean>(false);
  // const { user } = useSelector((state: RootState) => state.user);
 
  // const onColorSet = (e: string) => setColor(e);
  // const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => setItemSize(e.target.value);

  // const { favProducts } = useSelector((state: RootState) => state.user);
  // // const isFavourite = some(favProducts, productId => productId === product.ID);

  // const toggleFav = () => {
  //   dispatch(toggleFavProduct(
  //     { 
  //       id: product.ID,
  //     }
  //   ))
  // }

  // const addToCart = () => {
  //   // const productToSave: any = { 
  //   //   id: product.ID,
  //   //   name: product.name,
  //   //   thumb: product.img_thumbnail,
  //   //   price: product.currentPrice,
  //   //   count: count,
  //   // }
  //   // const productStore = {
  //   //   count,
  //   //   product: productToSave
  //   // }
  //   // if(user?.email != null){
  //   //   dispatch(addProduct(productStore))
  //   // }else{
  //   //   setShowModal(true)
  //   // }
  
  // }

  return (
    <section className="product-content">
 
      <div className="product-content__intro">
        {/* <h5 className="product__id"  style={{fontFamily: 'Montserrat-Bold'}}>Product ID: {product?.sku}</h5> */}
        {/* <span className="product-on-sale"  style={{fontFamily: 'Montserrat-Bold'}}>Sale</span> */}
        <h1 className="product__name"  style={{fontFamily: 'Montserrat-Bold'}}>{product?.name}</h1>
        {product?.price != product?.current_price  &&
            <h1 style={{ textDecorationLine: "line-through", color: "#b3b2b2", fontFamily: 'Montserrat-Semibold'}}>Rp. {currencyFormat(product?.price )}</h1>
          }
        <div className="product__prices"  style={{fontFamily: 'Montserrat-Semibold'}}>
          <h4>Rp{ currencyFormat( product?.current_price ? product?.current_price : 0) }</h4>
          
        </div>
      </div>

      <div className="product-content__filters">
        {/* <div className="product-filter-item">
          <h5 style={{fontFamily: 'Montserrat-Regular'}}>Color:</h5>
          <div className="checkbox-color-wrapper">
            {productsColors.map(type => (
              <CheckboxColor 
                key={type.id} 
                type={'radio'} 
                name="product-color" 
                color={type.color}
                valueName={type.label}
                onChange={onColorSet} 
              />
            ))}
          </div>
        </div> */}
        {/* <div className="product-filter-item">
          <h5 style={{fontFamily: 'Montserrat-Regular'}}>Size: <strong>See size table</strong></h5>
          <div className="checkbox-color-wrapper">
            <div className="select-wrapper">
              <select onChange={onSelectChange}>
                <option style={{fontFamily: 'Montserrat-Regular'}}>Choose size</option>
                {productsSizes.map(type => (
                  <option style={{fontFamily: 'Montserrat-Regular'}} value={type.label}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div> */}
        <div className="product-filter-item">
          <h5 style={{fontFamily: 'Montserrat-Regular'}}>Quantity:</h5>
          <div className="quantity-buttons">
            <div className="quantity-button">
              <button type="button" onClick={() => setCount( count === 1 ? 1 : count - 1)} className="quantity-button__btn">
                -
              </button>
              <span style={{fontFamily: 'Montserrat-Regular'}}>{count}</span>
              <button type="button" onClick={() => setCount(count + 1)} className="quantity-button__btn">
                +
              </button>
            </div>
            
            <button disabled={loading} type="submit" onClick={() => addToCart(count, product?.ID)} style={{fontFamily: 'Montserrat-Regular', padding: 10, backgroundColor: '#E0BF4B'}} className="btn btn--rounded">
              {loading ?<LoadingSpinner loading={loading} /> : 'Add to cart'}</button>
            {/* <button type="button" onClick={toggleFav} className={`btn-heart ${isFavourite ? 'btn-heart--active' : ''}`}><i className="icon-heart"></i></button> */}
          </div>
        </div>
        {show ? 
         <h1  style={{fontFamily: 'Montserrat-Regular', textAlign: 'left', marginTop: '5vh'}} >{parse(`${product?.description}`)}<h1 onClick={() => setShow(!show)} style={{fontFamily: 'Montserrat-Regular', textAlign: 'left', marginTop: '5vh', color: '#E0BF4B'}}>Lihat Lebih Sedikit</h1></h1> : 
         <h1  style={{fontFamily: 'Montserrat-Regular', textAlign: 'left', marginTop: '5vh'}} >{parse(`${product?.description.substring(0, 200)}...`)}<h1 onClick={() => setShow(!show)} style={{fontFamily: 'Montserrat-Regular', textAlign: 'left', marginTop: '5vh', color: '#E0BF4B'}}>Lihat Selengkapnya</h1></h1>
        }
        
      </div>
    </section>
  );
};
  
export default Content;
    