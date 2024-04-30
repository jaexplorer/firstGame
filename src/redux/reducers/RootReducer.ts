import { combineReducers, AnyAction } from "redux";
import { ApplicationState, initialState } from "../state/ApplicationState";
import { ErrorReducer } from "./ErrorReducer";
import { LoadingReducer } from "./LoadingReducer";
import { GameReducer } from "./GameReducer";

const rootReducer = combineReducers<ApplicationState>({
  gameState: GameReducer,
  loadingState: LoadingReducer,
  errorState: ErrorReducer,
});

export default (state: ApplicationState | undefined, action: AnyAction) => {
  // Example condition if you need to clear data eg. Logging out
  if (action.type === "LOGOUT") {
    return rootReducer(initialState, action);
  }
  return rootReducer(state, action);
};
