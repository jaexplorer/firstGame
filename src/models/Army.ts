import { SharedValue } from "react-native-reanimated";

export interface Army {
  x: number;
  y: number;
  isPlayer?: boolean;
  color: string;
}

export interface ArmyShared {
  offset: SharedValue<{
    x: number;
    y: number;
  }>;
  position: SharedValue<{
    x: number;
    y: number;
  }>;
  isPlayer?: boolean;
  color: string;
  isSelected: SharedValue<number>;
  pixels: { x: number; y: number }[];
  border: SharedValue<number[][]>;
}

export interface PixelsShared {
  offset: SharedValue<{
    x: number;
    y: number;
  }>;
  position: SharedValue<{
    x: number;
    y: number;
  }>;
}
