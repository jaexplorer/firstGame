import { CELL_SIZE } from "../../constants/GameConstants";
import { Wall } from "../../models/Wall";
import { Tile } from "./Level";

export const isWalkable = (location: Tile, walls: Wall[]) => {
  // Iterate through the walls array
  for (const wall of walls) {
    // Check if the location intersects with any wall
    if (
      location.x >= wall.x &&
      location.x < wall.x + wall.width &&
      location.y >= wall.y &&
      location.y < wall.y + wall.height
    ) {
      // If there's an intersection, location is not walkable
      return false;
    }
  }
  // If no intersection found, location is walkable
  return true;
};

export const roundToInterval = (
  bigNumber: number,
  interval: number
): number => {
  return Math.round(bigNumber / interval);
};

export const convertToCellCoordinates = (x: number, y: number) => {
  const cellX = Math.floor(x / CELL_SIZE);
  const cellY = Math.floor(y / CELL_SIZE);
  return { cellX, cellY };
};

export const floorToInterval = (
  bigNumber: number,
  interval: number
): number => {
  return Math.floor(bigNumber / interval) * interval;
};
