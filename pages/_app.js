import React from "react";
import Head from "next/head";

import { Provider as StateProvider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import theme from "../src/theme";
import { store } from "../store";

import { FeedbackProvider } from "../util/feedback";

const MyApp = ({ Component, pageProps }) => {
  const persistor = persistStore(store);

  return (
    <StateProvider store={store}>
      <Head>
        <title>Klue</title>
      </Head>
      <PersistGate loading={<p>loading...</p>} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <FeedbackProvider>
            <Component {...pageProps} />
          </FeedbackProvider>
        </ThemeProvider>
      </PersistGate>
    </StateProvider>
  );
};

export default MyApp;
