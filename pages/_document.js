import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheets } from "@mui/styles";
import theme from "../util/theme";

export default class MyDocument extends Document {
  render() {
    return (
      <Html style={{ width: "100vw", height: "100vh" }}>
        <Head>
          <meta charSet="utf-8" />

          <meta name="theme-color" content={theme.palette.primary.main} />
          <link
            href="https://fonts.googleapis.com/css2?&family=Inter:wght@700&family=Roboto:wght@500&display=swapfamily=Fira+Mono"
            rel="stylesheet"
          />
          <style>{`
						#__next {
              height: 100%;
              display: flex;
						}
					`}</style>
        </Head>
        <body style={{ width: "100vw", height: "100vh" }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...initialProps.styles, sheets.getStyleElement()],
  };
};
