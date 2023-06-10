import Document, { Html, Head, Main, NextScript } from "next/document";
import theme from "../util/theme";

import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from "../util/createEmotionCache";

export default function MyDocument({ emotionStyleTags }) {
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
        {emotionStyleTags}
      </Head>
      <body style={{ width: "100vw", height: "100vh" }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;

  // You can consider sharing the same Emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => <App emotionCache={cache} {...props} />,
    });

  const initialProps = await Document.getInitialProps(ctx);

  // This is important. It prevents Emotion to render invalid HTML.
  // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};
