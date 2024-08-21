// import { Fragment } from 'react'
import Document, {
  Head,
  Main,
  NextScript,
  DocumentInitialProps,
  DocumentContext,
} from "next/document";
// import { GA_TRACKING_ID } from '../utils/gtag';

interface DocumentProps extends DocumentInitialProps {
  isProduction: boolean;
}

export default class CustomDocument extends Document<DocumentProps> {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentProps> {
    const initialProps = await Document.getInitialProps(ctx);

    // Check if in production
    const isProduction = process.env.NODE_ENV === "production";

    return {
      ...initialProps,
      isProduction,
    };
  }

  render() {
    const { isProduction } = this.props;

    return (
      <html lang="id">
        <Head>
          {/* We only want to add the scripts if in production */}
          {isProduction && (
            <></>
            // <Fragment>
            //   {/* Global Site Tag (gtag.js) - Google Analytics */}
            //   <script
            //     async
            //     src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            //   />
            //   <script
            //     dangerouslySetInnerHTML={{
            //       __html: `
            //         window.dataLayer = window.dataLayer || [];
            //         function gtag(){dataLayer.push(arguments);}
            //         gtag('js', new Date());

            //         gtag('config', '${GA_TRACKING_ID}', {
            //           page_path: window.location.pathname,
            //         });
            //       `,
            //     }}
            //   />
            // </Fragment>
          )}

          <meta property="og:title" content="LakuShop" />
          <meta
            property="og:description"
            content="E-Commerce Penjualan Voucher Digital Lakuemas, kamu dapat melakukan pembelian secara online sekarang dan reedem di aplikasi Lakuemas apps."
          />
          <meta name="google-site-verification" content="GKe4tIIKQpQwf-VGLdy0505YMaKChI8jqwO8zCIc47Q" />
          <meta property="og:url" content="https://lakushop.id/" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
