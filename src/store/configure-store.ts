import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { BankInfo, CompanyClient, Inventory } from "../entities";
import { bankInfoReducer } from "../reducers/bank-info.reducer";
import { companyClientReducer } from "../reducers/company-client.reducer";
import { inventoryReducer } from "../reducers/inventory.reducer";
import { loadingReducer, LoadingState } from "../reducers/loading.reducer";
import { snackbarReducer, SnackbarState } from "../reducers/snackbar.reducer";

export const store = configureStore({
  reducer: combineReducers({
    loading: loadingReducer,
    snackbar: snackbarReducer,
    bankInfo: bankInfoReducer,
    companyClients: companyClientReducer,
    inventories: inventoryReducer,
  }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = {
  loading: LoadingState;
  snackbar: SnackbarState;
  bankInfo: BankInfo[];
  companyClients: CompanyClient[];
  inventories: Inventory[];
};

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
