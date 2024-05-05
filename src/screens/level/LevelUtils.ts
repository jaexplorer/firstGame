import { CELL_SIZE } from "../../constants/GameConstants";
import { Wall } from "../../models/Wall";
import { Tile } from "./Level";
import PF, { Grid } from "pathfinding";
import { CurveInterpolator } from "curve-interpolator";
import { Level as LevelType } from "../../models/Level";

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

export const createGrid = (level: LevelType) => {
  return Array.from({ length: level.height / CELL_SIZE }, (_, y) =>
    Array.from({ length: level.width / CELL_SIZE }, (_, x) => {
      const WALL_BUFFER = CELL_SIZE;
      const isWall = level.walls.some(
        (wall) =>
          x * CELL_SIZE >= wall.x - WALL_BUFFER &&
          x * CELL_SIZE < wall.x + wall.width + WALL_BUFFER &&
          y * CELL_SIZE >= wall.y - WALL_BUFFER &&
          y * CELL_SIZE < wall.y + wall.height + WALL_BUFFER
      );

      return isWall ? 1 : 0;
    })
  );
};

export const findPathPoints = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  map: Grid
): number[][] => {
  const startCell = convertToCellCoordinates(startX, startY);
  const endCell = convertToCellCoordinates(endX, endY);

  const finder = new PF.AStarFinder({
    allowDiagonal: true,
    dontCrossCorners: false,
  });
  const proposedPath: number[][] = finder.findPath(
    startCell.cellX,
    startCell.cellY,
    endCell.cellX,
    endCell.cellY,
    map.clone()
  );
  const newPath = PF.Util.smoothenPath(map.clone(), proposedPath);
  const interp = new CurveInterpolator(newPath, {
    tension: 0.5,
    alpha: 0.5,
  });

  return interp.getPoints(80) as number[][];
};
