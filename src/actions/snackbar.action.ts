import { SnackbarActionType } from "../reducers/snackbar.reducer";

export const snackbarSuccess = (message: string) => ({
  type: SnackbarActionType.SNACKBAR_SUCCESS,
  payload: { message },
});

export const snackbarError = (message: string) => ({
  type: SnackbarActionType.SNACKBAR_ERROR,
  payload: { message },
});

export const snackbarWarning = (message: string) => ({
  type: SnackbarActionType.SNACKBAR_WARNING,
  payload: { message },
});

export const snackbarDefault = (message: string) => ({
  type: SnackbarActionType.SNACKBAR_DEFAULT,
  payload: { message },
});

export const snackbarInfo = (message: string) => ({
  type: SnackbarActionType.SNACKBAR_INFO,
  payload: { message },
});
