/* eslint-disable @next/next/no-css-tags */
import Document, { Head, Html, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="stylesheet" href="/fonts/CeraPro/stylesheet.css" />
        </Head>
        <body className="flex min-h-screen flex-col bg-cs-dark-900">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
