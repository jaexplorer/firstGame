import { useSharedValue } from "react-native-reanimated";
import {
  ARMY_MAX_SPREAD,
  ARMY_MIN_SPREAD,
  BASE_SIZE,
} from "../../constants/GameConstants";
import { PixelsShared } from "../../models/Army";

export const addAlpha = (rgb: string, alpha: number): string => {
  let [r, g, b] = rgb.match(/\d+/g)!.map(Number);
  return `rgba(${r},${g},${b},${alpha})`;
};

export const initializePixelPositions = (
  pixelCount: number
): { x: number; y: number }[] => {
  const angleBetweenPixels = 360 / pixelCount;

  const pixels = [...Array(pixelCount)].map((_, i) => {
    const angleInDegrees = i * angleBetweenPixels;
    const angleInRadians = (angleInDegrees * Math.PI) / 180;
    const spread =
      Math.random() * (ARMY_MAX_SPREAD - ARMY_MIN_SPREAD) + ARMY_MIN_SPREAD;
    const x = spread * Math.cos(angleInRadians);
    const y = spread * Math.sin(angleInRadians);
    return { x: Number(x.toFixed()), y: Number(y.toFixed(2)) };
    // return {
    //   offset: useSharedValue({ x: x + BASE_SIZE / 2, y: y + BASE_SIZE / 2 }),
    //   position: useSharedValue({ x: x + BASE_SIZE / 2, y: y + BASE_SIZE / 2 }),
    // };
  });

  return pixels;
};

interface Point {
  x: number;
  y: number;
}

export const leftmostPoint = (points: Point[]): Point => {
  return points.reduce((leftmost, point) =>
    point.x < leftmost.x || (point.x === leftmost.x && point.y < leftmost.y)
      ? point
      : leftmost
  );
};

export const orientation = (p: Point, q: Point, r: Point): number => {
  return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
};

export const giftWrapping = (points: Point[]): Point[] => {
  if (points.length < 3) return points;

  const hull: Point[] = [];
  let pointOnHull = leftmostPoint(points);

  do {
    hull.push(pointOnHull);
    let endPoint = points[0];

    for (let j = 1; j < points.length; j++) {
      if (
        endPoint === pointOnHull ||
        orientation(pointOnHull, endPoint, points[j]) > 0
      ) {
        endPoint = points[j];
      }
    }
    pointOnHull = endPoint;
  } while (pointOnHull !== hull[0]);

  return hull.concat(hull[0]);
};

export const computeCentroid = (points: Point[]): Point => {
  const centroid = points.reduce(
    (acc, point) => {
      acc.x += point.x;
      acc.y += point.y;
      return acc;
    },
    { x: 0, y: 0 }
  );

  centroid.x /= points.length;
  centroid.y /= points.length;

  return centroid;
};

export const expandHull = (hull: Point[], gap: number): Point[] => {
  const centroid = computeCentroid(hull);

  return hull.map((point) => {
    const dx = point.x - centroid.x;
    const dy = point.y - centroid.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const scale = (length + gap) / length;

    return {
      x: centroid.x + dx * scale,
      y: centroid.y + dy * scale,
    };
  });
};
