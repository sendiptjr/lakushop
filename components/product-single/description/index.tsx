

import React from 'react';

const Description = ({ show }: any) => {
  const style = {
    display: show ? 'flex' : 'none',
  }
 
  return (
    <section style={style} className="product-single__description">
      <div className="product-description-block">
        {/* <i className="icon-cart"></i> */}
        <div >
          {/* <h1>{parse(`<h1 style="text-align: center;"><strong>Selamat datang di LAKUEMAS Official Store!</strong></h1>
<p><br></p>
<h1 style="text-align: left;">- Apakah Kamu ingin mencoba pengalaman baru berbelanja Emas? Kini <strong>LAKUEMAS&nbsp;</strong>hadir sebagai solusinya.</h1>
<h1 style="text-align: left;">- <strong>LAKUEMAS</strong> menyediakan beragam nominal emas dalam bentuk e-voucher.</h1>
<h1 style="text-align: left;">- E-voucher merupakan emas dalam bentuk baru yang disertakan dengan kode unik untuk diredeem ke dalam aplikasi <strong>LAKUEMAS</strong> yang akan menjadi saldo emas.</h1>
<h1 style="text-align: left;">- Saldo emas yang disimpan dalam aplikasi nantinya dapat dicetak menjadi emas fisik logam mulia 99,99%. Kamu dapat mengambil emas fisiknya di mesin <strong>ATM</strong> Lakuemas yang tersebar di berbagai kota dan outlet-outlet jewellery yang satu grup dengan Lakuemas seperti; <strong>Mondial</strong>, <strong>Frank &amp; co</strong>, dan <strong>The Palace</strong>.</h1>
<h1 style="text-align: left;">- Jenis E-voucher yang kami tawarkan dalam bentuk nominal uang (100k, 300k, 500k, 1jt, 3jt, 5jt, 10jt, 50jt).</h1>
<h1 style="text-align: left;">- Masa berlaku voucher adalah 3 Bulan dari tanggal pembelian. Jika sudah melewati masa berlaku, maka voucher tidak bisa digunakan dan tidak bisa diperpanjang dengan alasan apapun.</h1>`)}</h1> */}
        {/* <h1  style={{fontFamily: 'Montserrat-Regular', textAlign: 'left', marginBottom: 20}} >{parse(`${product?.description}`)}</h1> */}
        </div>
       
        <h4 style={{fontFamily: 'Montserrat-Regular'}}>PT Laku Emas Indonesia, merupakan anak perusahaan dari PT Central Mega Kencana yang bergerak pada Jual Beli Emas Digital. PT Laku Emas Indonesia telah terdaftar resmi di Badan Pengawas Perdagangan Berjangka Komoditi (BAPPEBTI) No. <a style={{color: 'blue'}} target="_blank" href="https://bappebti.go.id/pedagang_emas">002/BAPPEBTI/P-ED/02/2022</a></h4>
        {/* <p  style={{fontFamily: 'Montserrat-Regular'}}>White Summer Vibes T-shirt in the uiKit line with a colorful print. <br></br>Made of jersey cotton. T-shirt fits perfectly with jeans, pants or shorts.</p> */}
      </div>
    </section>
  );
};
  
export default Description;
    