import { useSharedValue } from "react-native-reanimated";
import {
  ARMY_MAX_SPREAD,
  ARMY_MIN_SPREAD,
  BASE_SIZE,
} from "../../constants/GameConstants";
import { PixelsShared } from "../../models/Army";

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
