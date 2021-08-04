import { PayloadAction } from "@reduxjs/toolkit";

export interface SnackbarState {
  variant: "default" | "error" | "success" | "warning" | "info" | "";
  message: string;
}

const initialState: SnackbarState = {
  variant: "",
  message: "",
};

export enum SnackbarActionType {
  SNACKBAR_SUCCESS = "SNACKBAR_SUCCESS",
  SNACKBAR_ERROR = "SNACKBAR_ERROR",
  SNACKBAR_WARNING = "SNACKBAR_WARNING",
  SNACKBAR_DEFAULT = "SNACKBAR_DEFAULT",
  SNACKBAR_INFO = "SNACKBAR_INFO",
}

export const snackbarReducer = (
  state = initialState,
  action: PayloadAction<{
    message: string;
  }>
) => {
  switch (action.type) {
    case SnackbarActionType.SNACKBAR_SUCCESS:
      return { variant: "success", message: action.payload.message };
    case SnackbarActionType.SNACKBAR_ERROR:
      return { variant: "error", message: action.payload.message };
    case SnackbarActionType.SNACKBAR_WARNING:
      return { variant: "warning", message: action.payload.message };
    case SnackbarActionType.SNACKBAR_DEFAULT:
      return { variant: "default", message: action.payload.message };
    case SnackbarActionType.SNACKBAR_INFO:
      return { variant: "info", message: action.payload.message };
    default:
      return initialState;
  }
};
