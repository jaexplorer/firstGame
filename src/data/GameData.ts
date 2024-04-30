import { screenHeight, screenWidth } from "../constants/ScreenSize";
import { Level } from "../models/Level";

export const level_0: Level = {
  level: 0,
  width: screenWidth * 2,
  height: screenHeight,
  walls: [
    {
      x: 100,
      y: 100,
      width: 100,
      height: 100,
    },
    {
      x: 100,
      y: 400,
      width: 100,
      height: 100,
    },
    {
      x: 400,
      y: 100,
      width: 100,
      height: 100,
    },
    {
      x: 400,
      y: 400,
      width: 100,
      height: 100,
    },
  ],
  players: [
    {
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      isPlayer: true,
      color: "green",
    },
  ],
};
