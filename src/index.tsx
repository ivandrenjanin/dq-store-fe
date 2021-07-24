import React from "react";
import ReactDOM from "react-dom";
import client from "./api/client/client";
import { Router } from "./router/router";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import commonRs from "./translations/rs/common.json";
import commonEn from "./translations/en/common.json";
import "./css/styles.css";

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: "rs",
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

ReactDOM.render(
  <I18nextProvider i18n={i18next}>
    <Router apiClient={client} />
  </I18nextProvider>,
  document.getElementById("root")
);
