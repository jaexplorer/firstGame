import { Base } from "./Base";
import { Wall } from "./Wall";

export interface Level {
  level: number;
  width: number;
  height: number;
  walls: Wall[];
  players: Base[];
}

export interface LastTap {
  x: number;
  y: number;
}

export interface Paths {
  name: string;
  path: number[][];
}
