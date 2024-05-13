import { BASE_SIZE, CELL_SIZE } from "../../constants/GameConstants";
import { Wall } from "../../models/Wall";
import { Tile } from "./Level";
import PF, { Grid } from "pathfinding";
import { CurveInterpolator } from "curve-interpolator";
import { Cell, Level as LevelType } from "../../models/Level";

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

export const convertToCellCoordinatesWorklet = (x: number, y: number) => {
  "worklet";
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

/**
 * Create a simplified grid based on the level width and height.
 * Convert from real coordinates to simplified coordinates
 **/
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

/**
 * Get the neighbors of a cell (simplifed coordinates)
 **/
export const getNeighbors = (cell: Cell, map: Grid): Cell[] => {
  const { cellX, cellY } = cell;
  const neighbors: { x: number; y: number }[] = [];

  // Check the four adjacent cells (up, down, left, right)
  // ←
  if (map.isInside(cellX - 1, cellY)) {
    neighbors.push(map.getNodeAt(cellX - 1, cellY));
  }
  // →
  if (map.isInside(cellX + 1, cellY)) {
    neighbors.push(map.getNodeAt(cellX + 1, cellY));
  }
  // ↑
  if (map.isInside(cellX, cellY - 1)) {
    neighbors.push(map.getNodeAt(cellX, cellY - 1));
  }
  // ↓
  if (map.isInside(cellX, cellY + 1)) {
    neighbors.push(map.getNodeAt(cellX, cellY + 1));
  }

  return neighbors.map((neighbor) => ({
    cellX: neighbor.x,
    cellY: neighbor.y,
  }));
};

/**
 * Starting at the endCell (simplified coordinates - which will be inside a wall).
 * Find the nearest walkable cell towards the startCell (simplified coordinates)
 **/
export const findNearestWalkableCell = (
  startCell: Cell,
  endCell: Cell,
  map: Grid,
  nearst?: boolean
): Cell | null => {
  let queue: Cell[] = [endCell];
  const visited = new Set<string>();

  visited.add(`${endCell.cellX},${endCell.cellY}`);

  while (queue.length > 0) {
    const current = queue.shift() as Cell;

    if (map.isWalkableAt(current.cellX, current.cellY)) {
      return current;
    }

    const neighbors = getNeighbors(current, map);

    for (const neighbor of neighbors) {
      const key = `${neighbor.cellX},${neighbor.cellY}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ cellX: neighbor.cellX, cellY: neighbor.cellY });
      }
    }

    if (nearst) {
      queue = queue.sort((a, b) => {
        const distA = Math.hypot(
          a.cellX - startCell.cellX,
          a.cellY - startCell.cellY
        );
        const distB = Math.hypot(
          b.cellX - startCell.cellX,
          b.cellY - startCell.cellY
        );
        return distA - distB;
      });
    }
  }

  return null;
};

export const smoothenPath = (
  path: number[][],
  map: Grid,
  tension?: number,
  alpha?: number
): number[][] => {
  const interp = new CurveInterpolator(path, {
    tension: tension || 0.5,
    alpha: alpha || 0.5,
  });

  return interp.getPoints(80) as number[][];
};

/**
 * Accepts real coordinates and finds a path with simplifed coordinates via map
 **/
export const findPathPoints = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  map: Grid,
  skipSmooth?: boolean
): number[][] => {
  const startCell = convertToCellCoordinates(startX, startY);
  let endCell = convertToCellCoordinates(endX, endY);

  // If the end cell is not walkable, find the nearest walkable cell
  if (map.isWalkableAt(endCell.cellX, endCell.cellY) === false) {
    const nearestWalkableCell = findNearestWalkableCell(
      startCell,
      endCell,
      map
    );
    if (nearestWalkableCell === null) {
      console.log("Error finding nearest walkable cell");
      return [];
    } else {
      endCell = nearestWalkableCell;
    }
  }

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

  let newPath: number[][] = PF.Util.smoothenPath(map.clone(), proposedPath);

  if (skipSmooth) return newPath;

  const smoothPath = smoothenPath(newPath, map);

  // To adjust the start point of the path not being at the center of the base
  smoothPath[0] = [
    (startX + BASE_SIZE / 2 - CELL_SIZE / 2) / CELL_SIZE,
    (startY + BASE_SIZE / 2 - CELL_SIZE / 2) / CELL_SIZE,
  ];

  return smoothPath;
};

/**
 * Accepts real coordinates and splits the path into multiple paths based on walls
 **/
export const splitPathByWalls = (path: number[][], map: Grid): number[][][] => {
  const result: number[][][] = [];
  let currentPath: number[][] = [];

  for (const point of path) {
    const cell = convertToCellCoordinates(point[0], point[1]);
    if (map.isWalkableAt(cell.cellX, cell.cellY)) {
      currentPath.push(point);
    } else {
      if (currentPath.length > 0) {
        result.push(currentPath);
        currentPath = [];
      }
    }
  }

  // Add the last path if it's not empty
  if (currentPath.length > 0) {
    result.push(currentPath);
  }

  return result;
};

/**
 * Accepts a list of paths (real coordinates) and connects them into a single path (simplified coordinates)
 **/
export const connectPaths = (paths: number[][][], map: Grid): number[][] => {
  let links: number[][][] = [];

  // Find the links between the paths and add them to a list
  paths.forEach((path, idx) => {
    // If the last one in the list, skip
    if (idx === paths.length - 1) return;
    const startCell = path[path.length - 1];
    const endCell = paths[idx + 1][0];

    const link = findPathPoints(
      startCell[0],
      startCell[1],
      endCell[0],
      endCell[1],
      map,
      true
    );

    // Remove the start and end points
    links.push(link.slice(1, link.length - 1));
  });

  let finalPath: number[][] = [];

  paths.forEach((path, idx) => {
    // If the last one in the list, theres no links remaining
    const simplifedPath: number[][] = path.map((point) => {
      const cell = convertToCellCoordinates(point[0], point[1]);
      return [cell.cellX, cell.cellY];
    });

    if (idx === paths.length - 1) {
      finalPath = [...finalPath, ...simplifedPath];
    } else {
      finalPath = [...finalPath, ...simplifedPath, ...links[idx]];
    }
  });

  return smoothenPath(finalPath, map, 0);
};
