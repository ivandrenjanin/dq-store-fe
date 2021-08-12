import { Redirect, Route } from "react-router-dom";

import { isLoggedIn } from "../helpers/is-logged-in.helper";

const PublicRoute = ({
  component: Component,
  restricted,
  apiClient,
  ...rest
}: any) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn() && restricted ? (
          <Redirect to="/firma" />
        ) : (
          <Component {...props} apiClient={apiClient} />
        )
      }
    />
  );
};

export default PublicRoute;
