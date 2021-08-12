import "./css/styles.css";

import i18next from "i18next";
import React from "react";
import ReactDOM from "react-dom";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { createClient } from "./api/client/client";
import { Router } from "./router/router";
import commonEn from "./translations/en/common.json";
import commonRs from "./translations/rs/common.json";
import { store } from "./store/configure-store";
import { SnackbarProvider } from "notistack";
import { getBankInfo } from "./api";
import { ThemeProvider } from "@material-ui/core";
import { createTheme, lighten, darken } from "@material-ui/core/styles";

const lng = localStorage.getItem("language");

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: lng ?? "rs",
  resources: {
    en: {
      common: commonEn,
    },
    rs: {
      common: commonRs,
    },
  },
  whitelist: ["en", "rs"],
  fallbackLng: ["rs"],
});

getBankInfo(createClient()).then((data) =>
  store.dispatch({ type: "BANK_INFO", payload: data })
);

const theme = createTheme({});

ReactDOM.render(
  <Provider store={store}>
    <I18nextProvider i18n={i18next}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={6}>
          <Router apiClient={createClient()} />
        </SnackbarProvider>
      </ThemeProvider>
    </I18nextProvider>
  </Provider>,
  document.getElementById("root")
);
