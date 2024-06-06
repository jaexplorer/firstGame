import { useSharedValue, makeMutable } from "react-native-reanimated";
import {
  ARMY_MAX_SPREAD,
  ARMY_MIN_SPREAD,
  BASE_SIZE,
} from "../../constants/GameConstants";
import { Pixels, PixelsShared } from "../../models/Army";

export const addAlpha = (rgb: string, alpha: number): string => {
  let [r, g, b] = rgb.match(/\d+/g)!.map(Number);
  return `rgba(${r},${g},${b},${alpha})`;
};

export const initializePixelPositions = (
  pixelCount: number
): PixelsShared[] => {
  const angleBetweenPixels = 360 / pixelCount;

  const pixels = [...Array(pixelCount)].map((_, i) => {
    const angleInDegrees = i * angleBetweenPixels;
    const angleInRadians = (angleInDegrees * Math.PI) / 180;
    const spread =
      Math.random() * (ARMY_MAX_SPREAD - ARMY_MIN_SPREAD) + ARMY_MIN_SPREAD;
    const x = spread * Math.cos(angleInRadians);
    const y = spread * Math.sin(angleInRadians);
    return {
      offset: useSharedValue({ x: x + BASE_SIZE / 2, y: y + BASE_SIZE / 2 }),
      position: useSharedValue({ x: x + BASE_SIZE / 2, y: y + BASE_SIZE / 2 }),
    };
  });

  return pixels;
};

// Function to calculate the angle of a point relative to the origin
const calculateAngle = (point: PixelsShared): number => {
  "worklet";
  return (
    Math.atan2(point.position.value.y, point.position.value.x) * (180 / Math.PI)
  );
};

// Function to calculate the distance from the origin to a point
const calculateDistance = (point: PixelsShared): number => {
  "worklet";
  return Math.sqrt(point.position.value.x ** 2 + point.position.value.y ** 2);
};

// Function to divide the points into sections and find the furthest point in each section
export const concaveHull = (
  points: PixelsShared[],
  sections: number = 12
): PixelsShared[] => {
  "worklet";
  if (points.length < 3) return points;

  const sectionAngle = 360 / sections;
  const hull: PixelsShared[] = new Array(sections).fill(null);

  points.forEach((point) => {
    const angle = (calculateAngle(point) + 360) % 360; // Normalize angle to [0, 360)
    const sectionIndex = Math.floor(angle / sectionAngle);
    const distance = calculateDistance(point);

    if (
      !hull[sectionIndex] ||
      distance > calculateDistance(hull[sectionIndex])
    ) {
      hull[sectionIndex] = point;
    }
  });

  // Remove any nulls in case some sections didn't have any points
  return hull.filter((point) => point !== null);
};

export const computeCentroid = (
  points: PixelsShared[]
): { x: number; y: number } => {
  "worklet";

  const centroid = points.reduce(
    (acc, point) => {
      acc.x += point.position.value.x;
      acc.y += point.position.value.y;
      return acc;
    },
    { x: 0, y: 0 }
  );

  centroid.x /= points.length;
  centroid.y /= points.length;

  return centroid;
};

export const expandHull = (
  hull: PixelsShared[],
  gap: number
): PixelsShared[] => {
  "worklet";

  const centroid = computeCentroid(hull);

  return hull.map((point) => {
    const dx = point.position.value.x - centroid.x;
    const dy = point.position.value.y - centroid.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const scale = (length + gap) / length;

    point.offset.value = {
      x: centroid.x + dx * scale,
      y: centroid.y + dy * scale,
    };
    point.position.value = {
      x: centroid.x + dx * scale,
      y: centroid.y + dy * scale,
    };
    return point;
  });
};
