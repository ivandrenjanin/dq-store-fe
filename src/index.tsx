import "./css/styles.css";

import i18next from "i18next";
import React from "react";
import ReactDOM from "react-dom";
import { I18nextProvider } from "react-i18next";

import client from "./api/client/client";
import { Router } from "./router/router";
import commonEn from "./translations/en/common.json";
import commonRs from "./translations/rs/common.json";

const lng = localStorage.getItem("language");

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: lng ?? "en",
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
