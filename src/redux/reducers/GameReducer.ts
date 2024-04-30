import { Reducer } from "redux";
import { GameAction, GameActionTypes } from "../actions/GameActions";
import { GameState, initialGameState } from "../state/GameState";
import { Level } from "../../models/Level";

export const GameReducer: Reducer<GameState, GameAction> = (
  state = initialGameState,
  { type, data }
) => {
  switch (type) {
    case GameActionTypes.SET_LEVELS:
      return {
        ...state,
        levels: data as Level[],
      };
    case GameActionTypes.SELECT_LEVEL:
      return {
        ...state,
        selectedLevel: data as number | undefined,
      };
    default:
      return { ...state };
  }
};
