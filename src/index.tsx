import React from "react";
import ReactDOM from "react-dom";
import client from "./api/client/client";
import { Router } from "./router/router";

ReactDOM.render(
  <React.StrictMode>
    <Router apiClient={client} />
  </React.StrictMode>,
  document.getElementById("root")
);
