import { AxiosInstance } from "axios";
import { FunctionComponent } from "react";
import { RouteComponentProps } from "react-router-dom";

import { Layout } from "../../components/layout/layout";

export interface InventoryProps extends RouteComponentProps {
  apiClient: AxiosInstance;
}

export const Inventory: FunctionComponent<InventoryProps> = ({
  history,
  location,
  match,
}) => (
  <Layout history={history} location={location} match={match}>
    <h1>Inventory Page</h1>
  </Layout>
);
