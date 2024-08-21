import Head from 'next/head';
// import Header from 'components/header';
import { useRouter } from 'next/router';

type LayoutType = {
  title?: string;
  children?: React.ReactNode;
}

export default ({ children, title = 'Lakushop.id: Beli Voucher Digital & Emas Terbaik Sekarang!' }: LayoutType) => {
  const router = useRouter();
  const pathname = router.pathname;
  return (
    <div className="app-main">
      <Head>
        <title>{ title }</title>
      </Head>

    

      <main className={(pathname !== '/'  && pathname !== '/product/detail' && pathname !== '/products' &&  pathname !== '/cart' ? 'main-page' : '')}>
        { children }
      </main>
    </div>
  )
}
