import { AxiosInstance } from "axios";
import { BrowserRouter, Switch } from "react-router-dom";

import { CompanyClient } from "../pages/company-client/company-client";
import { Company } from "../pages/company/company";
// import { Dashboard } from "../pages/dashboard/dashboard";
import { EditCompany } from "../pages/edit-company/edit-company";
import { Inventory } from "../pages/inventory/inventory";
import { NotFound } from "../pages/not-found/not-found";
import { SignIn } from "../pages/sign-in/sign-in";
import { SingleInventory } from "../pages/single-inventory/single-inventory";
import PrivateRoute from "./private-route";
import PublicRoute from "./public-route";

interface Props {
  apiClient: AxiosInstance;
}

export const Router = ({ apiClient }: Props) => {
  return (
    <BrowserRouter>
      <Switch>
        <PublicRoute
          restricted={true}
          apiClient={apiClient}
          component={SignIn}
          path="/"
          exact
        />
        {/* <PrivateRoute
          component={Dashboard}
          apiClient={apiClient}
          path="/dashboard"
          exact
        /> */}
        <PrivateRoute
          component={Company}
          apiClient={apiClient}
          path="/firma"
          exact
        />
        <PrivateRoute
          component={CompanyClient}
          apiClient={apiClient}
          path="/komitent"
          exact
        />
        <PrivateRoute
          component={EditCompany}
          apiClient={apiClient}
          path="/firma/:id"
          exact
        />
        <PrivateRoute
          component={Inventory}
          apiClient={apiClient}
          path="/magacin"
          exact
        />
        <PrivateRoute
          component={SingleInventory}
          apiClient={apiClient}
          path="/magacin/:id"
          exact
        />
        <PublicRoute restricted={false} component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};
