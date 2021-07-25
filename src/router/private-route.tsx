import React from "react";
import { Redirect, Route } from "react-router-dom";

import { isLoggedIn } from "../helpers/is-logged-in.helper";

const PrivateRoute = ({ component: Component, apiClient, ...rest }: any) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn() ? (
          <Component {...props} apiClient={apiClient} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default PrivateRoute;
