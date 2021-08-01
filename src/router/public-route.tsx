import { Redirect, Route } from "react-router-dom";

import { isLoggedIn } from "../helpers/is-logged-in.helper";

const PublicRoute = ({
  component: Component,
  restricted,
  apiClient,
  ...rest
}: any) => {
  console.log({ rest });
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn() && restricted ? (
          <Redirect to="/company" />
        ) : (
          <Component {...props} apiClient={apiClient} />
        )
      }
    />
  );
};

export default PublicRoute;
