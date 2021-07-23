import { AxiosInstance } from "axios";
import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { Dashboard } from "../pages/dashboard/dashboard";
import { NotFound } from "../pages/not-found/not-found";
import { SignIn } from "../pages/sign-in/sign-in";
import PrivateRoute from "./private-route";
import PublicRoute from "./public-route";

interface Props {
  apiClient: AxiosInstance;
}

export const Router = ({ apiClient }: Props) => (
  <BrowserRouter>
    <Switch>
      <PublicRoute
        restricted={true}
        apiClient={apiClient}
        component={SignIn}
        path="/"
        exact
      />
      <PrivateRoute
        component={Dashboard}
        apiClient={apiClient}
        path="/dashboard"
        exact
      />
      <PublicRoute restricted={false} component={NotFound} />
    </Switch>
  </BrowserRouter>
);
