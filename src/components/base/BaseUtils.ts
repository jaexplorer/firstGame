import { WallProps } from "../wall/Wall";

export const isColliding = (rect1: WallProps, rect2: WallProps) => {
  "worklet";

  return (
    rect1.x! < rect2.x! + rect2.width! &&
    rect1.x! + rect1.width! > rect2.x! &&
    rect1.y! < rect2.y! + rect2.height! &&
    rect1.y! + rect1.height! > rect2.y!
  );
};

// Check if the proposed movement collides with any walls
export const isCollidingWithWalls = (
  walls: WallProps[],
  offset: { x: number; y: number },
  width: number,
  height: number
) => {
  "worklet";
  return walls.some((wall) =>
    isColliding({ x: offset.x, y: offset.y, width, height }, wall)
  );
};

export const getDistance = ([x1, y1]: number[], [x2, y2]: number[]) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};
