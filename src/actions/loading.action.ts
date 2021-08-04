import { LoadingActionType } from "../reducers/loading.reducer";

export const loadingStarted = () => ({
  type: LoadingActionType.LOADING_STARTED,
});

export const loadingFinished = () => ({
  type: LoadingActionType.LOADING_FINISHED,
});
