import { SharedValue } from "react-native-reanimated";

export interface Base {
  x: number;
  y: number;
  isPlayer?: boolean;
  color: string;
}

export interface BaseShared {
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
}
