/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Store, Action } from "redux";
import rootReducer from "./reducers/RootReducer";
// import Sentry from 'sentry-expo';
import { ApplicationState } from "./state/ApplicationState";
import { configureStore } from "@reduxjs/toolkit";

const store: Store<ApplicationState> = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  enhancers: (getDefaultEnhancers) => {
    if (__DEV__) {
      const { default: Reactotron } = require("../util/reactotron");
      return getDefaultEnhancers().concat(Reactotron.createEnhancer());
    }
    return getDefaultEnhancers();
  },
});

export interface StoreAction<TType extends string, TPayload>
  extends Action<TType> {
  readonly type: TType;
  readonly data?: TPayload;
}

export default store;
