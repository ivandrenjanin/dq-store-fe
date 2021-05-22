import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { Dashboard } from "../pages/dashboard/dashboard";
import { NotFound } from "../pages/not-found/not-found";
import { SignIn } from "../pages/sign-in/sign-in";
import PrivateRoute from "./private-route";
import PublicRoute from "./public-route";

export const Router = () => (
  <BrowserRouter>
    <Switch>
      <PublicRoute restricted={false} component={SignIn} path="/" exact />
      <PrivateRoute component={Dashboard} path="/dashboard" exact />
      <PublicRoute restricted={false} component={NotFound} />
    </Switch>
  </BrowserRouter>
);
