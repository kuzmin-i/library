import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

import YMCounter from "@/components/ym-counter";
import colors from "@/styles/theme/colors";

const counter = process.env.NEXT_PUBLIC_YM_COUNTER;
const { black } = colors;

const fontNames = ["fugue-mono-kb", "root-ui-regular", "root-ui-bold"];
const handleFont = (name, woff2) => ({
  href: `/fonts/${name}.woff${woff2 ? 2 : ""}`,
  type: `font/woff${woff2 ? 2 : ""}`,
});
const fonts = fontNames.flatMap((name) =>
  [false, true].map((woff2) => handleFont(name, woff2))
);

const FontPreloadLink = ({ href, type }) => (
  <link {...{ href, type }} rel="preload" as="font" crossOrigin="anonymous" />
);

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="ru">
        <Head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color={black} />
          <meta name="theme-color" content={black} />
          {fonts.map((font, i) => (
            <FontPreloadLink key={i} {...font} />
          ))}
          {counter && <YMCounter {...{ counter }} />}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
