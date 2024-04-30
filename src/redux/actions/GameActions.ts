import { Level } from "../../models/Level";
import { GameState } from "../state/GameState";
import { StoreAction } from "../store";

export enum GameActionTypes {
  SET_LEVELS = "SET_LEVELS",
  SELECT_LEVEL = "SELECT_LEVEL",
}

export type GameActionPayload = Level[] | number | undefined | string | Error;

export type GameAction = StoreAction<GameActionTypes, GameActionPayload>;

export class GameActions {
  public static setLevels(data: Level[]): GameAction {
    return { type: GameActionTypes.SET_LEVELS, data };
  }

  public static selectLevel(data: number | undefined): GameAction {
    return { type: GameActionTypes.SELECT_LEVEL, data };
  }
}
