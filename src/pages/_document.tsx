import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="kr">
      <Head>
        <title>돌핀 - 맞춤형 IT 소식 서비스</title>
        <meta name="description" content="돌핀에서 최신 기사 및 IT 소식을 한 눈에 확인하세요. 웹, 안드로이드, AI 등의 다양한 주제들을 쉽게 탐색할 수 있습니다." />
        <meta name="keywords" content="기사, IT 소식, IT, 웹, 안드로이드, AI, 최신 기술, 뉴스, 트렌드, 서핏, 일일일, Nuzzel, Feedly, Pocket, Inoreader, 뉴스 앱, RSS, 콘텐츠 큐레이션, 핀터레스트, 트위터, 페이스북" />
        <meta name="author" content="Dolphin" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="돌핀 - 다양한 기사 및 IT 소식을 한 눈에 보다" />
        <meta property="og:description" content="돌핀에서 최신 기사 및 IT 소식을 한 눈에 확인하세요. 웹, 안드로이드, AI 등의 다양한 주제들을 쉽게 탐색할 수 있습니다." />
        <meta property="og:image" content="https://yourwebsite.com/image_url_here" />
        <meta property="og:url" content="https://yourwebsite.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="돌핀 - 다양한 기사 및 IT 소식을 한 눈에 보다" />
        <meta name="twitter:description" content="돌핀에서 최신 기사 및 IT 소식을 한 눈에 확인하세요. 웹, 안드로이드, AI 등의 다양한 주제들을 쉽게 탐색할 수 있습니다." />
        <meta name="twitter:image" content="https://yourwebsite.com/image_url_here" />
        <link rel="canonical" href="https://yourwebsite.com" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
