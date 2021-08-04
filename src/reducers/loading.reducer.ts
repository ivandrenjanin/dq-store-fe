import { AnyAction } from "redux";

interface LoadingState {
  value: boolean;
}

const initialState: LoadingState = {
  value: false,
};

export enum LoadingActionType {
  LOADING_STARTED = "LOADING_STARTED",
  LOADING_FINISHED = "LOADING_FINISHED",
}

export const loadingReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case LoadingActionType.LOADING_STARTED:
      return { value: true };
    case LoadingActionType.LOADING_FINISHED:
      return { value: false };
    default:
      return state;
  }
};
