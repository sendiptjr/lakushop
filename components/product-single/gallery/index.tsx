import { useEffect, useState } from "react";



const Gallery = ({ images } : any) => {
  const [imageDefault, setImageDefault] =  useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
    setImageDefault(images?.img_thumbnail)
    }
  }, [images])
  return (
    <section className="product-gallery">
      <div className="product-gallery__thumbs">
        {images?.productImages && images?.productImages?.map((item :  any, idx: any) => (
          <div onClick={() => {
            setImageDefault(item?.imgName)
          }} key={idx} className="product-gallery__thumb">
            <img alt="img-prdct" src={process.env.URL_ASSET_PRODUCT+item?.imgName}  />
          </div>
        ))}
      </div>

      <div className="product-gallery__image">
        <img  alt="img-container" src={process.env.URL_ASSET_PRODUCT+imageDefault} />
      </div>
    </section>
  );
};
  
export default Gallery;
  