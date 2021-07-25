import { AxiosInstance } from "axios";
import { FunctionComponent } from "react";
import { RouteComponentProps } from "react-router-dom";

import { Layout } from "../../components/layout/layout";

export interface CompanyProps extends RouteComponentProps {
  apiClient: AxiosInstance;
}

export const Company: FunctionComponent<CompanyProps> = ({
  history,
  location,
  match,
}) => (
  <Layout history={history} location={location} match={match}>
    <h1>Company Page</h1>
  </Layout>
);
