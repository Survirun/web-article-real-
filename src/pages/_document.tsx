import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>돌핀</title>
        <meta name="description" content="다양한 기사 및 IT 소식을 한 눈에 보다." />
        <meta name="keywords" content="기사, IT 소식, IT, 웹, 안드로이드, AI" />
        <meta property="og:title" content="Title Here" />
        <meta property="og:description" content="Description Here" />
        <meta property="og:image" content="image_url_here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
