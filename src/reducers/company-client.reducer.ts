import { PayloadAction } from "@reduxjs/toolkit";
import { CompanyClient } from "../entities";

const initialState: CompanyClient[] = [];

export enum CompanyClientActionType {
  SET_COMPANY_CLIENT = "SET_COMPANY_CLIENT",
  SET_COMPANY_CLIENTS = "SET_COMPANY_CLIENTS",
}

export const companyClientReducer = (
  state = initialState,
  action: PayloadAction<CompanyClient>
) => {
  switch (action.type) {
    case CompanyClientActionType.SET_COMPANY_CLIENT:
      return state.concat(action.payload);
    case CompanyClientActionType.SET_COMPANY_CLIENTS:
      return state.concat(action.payload);
    default:
      return state;
  }
};
