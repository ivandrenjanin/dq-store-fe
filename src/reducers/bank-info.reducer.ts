import { PayloadAction } from "@reduxjs/toolkit";

import { BankInfo } from "../entities";

const initialState: BankInfo[] = [];

export enum BankInfoActionType {
  BANK_INFO = "BANK_INFO",
}

export const bankInfoReducer = (
  state = initialState,
  action: PayloadAction
) => {
  switch (action.type) {
    case BankInfoActionType.BANK_INFO:
      return action.payload;
    default:
      return state;
  }
};
