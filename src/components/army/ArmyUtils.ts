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

// Function to calculate the angle of a point relative to the origin
const calculateAngle = (origin: Point, point: Point): number => {
  return Math.atan2(point.y - origin.y, point.x - origin.x) * (180 / Math.PI);
};

// Function to calculate the distance from the origin to a point
const calculateDistance = (origin: Point, point: Point): number => {
  return Math.sqrt((point.x - origin.x) ** 2 + (point.y - origin.y) ** 2);
};

// Function to divide the points into sections and find the furthest point in each section
export const concaveHull = (
  points: Point[],
  sections: number = 12
): Point[] => {
  if (points.length < 3) return points;

  const origin: Point = { x: 0, y: 0 }; // Assuming the origin is (0, 0)
  const sectionAngle = 360 / sections;
  const hull: Point[] = new Array(sections).fill(null);

  points.forEach((point) => {
    const angle = (calculateAngle(origin, point) + 360) % 360; // Normalize angle to [0, 360)
    const sectionIndex = Math.floor(angle / sectionAngle);
    const distance = calculateDistance(origin, point);

    if (
      !hull[sectionIndex] ||
      distance > calculateDistance(origin, hull[sectionIndex])
    ) {
      hull[sectionIndex] = point;
    }
  });

  // Remove any nulls in case some sections didn't have any points
  return hull.filter((point) => point !== null);
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
