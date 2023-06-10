import Head from "next/head";

import { Provider as StateProvider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";

import { Main as KeyBinds } from "../components/util/keybinds";

import theme from "../util/theme";
import store from "../store";

import createEmotionCache from '../util/createEmotionCache'

import { FeedbackProvider } from "../util/feedback";

const clientSideEmotionCache = createEmotionCache();

const MyApp = ({ Component, emotionCache = clientSideEmotionCache, pageProps }) => {
  const persistor = persistStore(store);

  return (
    <CacheProvider value={emotionCache}>
      <StateProvider store={store}>
        <Head>
          <title>Klue</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
        </Head>
        <PersistGate loading={<p>loading...</p>} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <KeyBinds />
            <FeedbackProvider>
              <Component {...pageProps} />
            </FeedbackProvider>
          </ThemeProvider>
        </PersistGate>
      </StateProvider>
    </CacheProvider>
  );
};

export default MyApp;
