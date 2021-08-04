import React from "react";
import { Redirect, Route } from "react-router-dom";
import { Layout } from "../components/layout/layout";

import { isLoggedIn } from "../helpers/is-logged-in.helper";

const PrivateRoute = ({ component: Component, apiClient, ...rest }: any) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return isLoggedIn() ? (
          <Layout
            history={props.history}
            match={props.match}
            location={props.location}
          >
            <Component {...props} apiClient={apiClient} />
          </Layout>
        ) : (
          <Redirect to="/" />
        );
      }}
    />
  );
};

export default PrivateRoute;
