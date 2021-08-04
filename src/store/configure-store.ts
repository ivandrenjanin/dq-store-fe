import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { loadingReducer } from "../reducers/loading.reducer";
import { snackbarReducer } from "../reducers/snackbar.reducer";

export const store = configureStore({
  reducer: combineReducers({
    loading: loadingReducer,
    snackbar: snackbarReducer,
  }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
