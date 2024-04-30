import { Level } from "../../models/Level";

export class GameState {
  public levels: Level[] | undefined;
  public selectedLevel: number | undefined;
}

export const initialGameState: GameState = {
  levels: undefined,
  selectedLevel: undefined,
};
