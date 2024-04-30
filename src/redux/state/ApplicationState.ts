import { ErrorState, initialErrorState } from "../state/ErrorState";
import { LoadingState, initialLoadingState } from "../state/LoadingState";
import { GameState, initialGameState } from "./GameState";

export interface ApplicationState {
  gameState: GameState;
  loadingState: LoadingState;
  errorState: ErrorState;
}

export const initialState: ApplicationState = {
  gameState: initialGameState,
  loadingState: initialLoadingState,
  errorState: initialErrorState,
};
