import { CompanyClient } from "../entities";
import { CompanyClientActionType } from "../reducers/company-client.reducer";

export const setCompanyClient = (payload: CompanyClient) => ({
  type: CompanyClientActionType.SET_COMPANY_CLIENT,
  payload,
});

export const setCompanyClients = (payload: CompanyClient[]) => ({
  type: CompanyClientActionType.SET_COMPANY_CLIENTS,
  payload,
});
