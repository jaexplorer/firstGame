import React, { FC, useEffect, useState, useMemo, ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { useStyles } from "./BackgroundStyles";
import Wall from "../wall/Wall";
import { screenHeight, screenWidth } from "../../constants/ScreenSize";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  clamp,
  SharedValue,
  runOnJS,
  useAnimatedProps,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { Cell, LastTap } from "../../models/Level";
import { convertToCellCoordinatesWorklet } from "../../screens/level/LevelUtils";
import Svg, { Polyline } from "react-native-svg";
import { CELL_SIZE } from "../../constants/GameConstants";

interface BackgroundProps {
  backgroundWidth?: number;
  backgroundHeight?: number;
  children: ReactNode;
  drawnPath: SharedValue<number[][]>;
  hasSelected: boolean;
  setIsDrawing: (drawing: boolean) => void;
  setLastTap: (position: LastTap) => void;
}

const Background: FC<BackgroundProps> = ({
  backgroundWidth = screenWidth,
  backgroundHeight = screenHeight,
  children,
  drawnPath,
  hasSelected,
  setIsDrawing,
  setLastTap,
}) => {
  const styles = useStyles();
  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });

  // DISTANCE BASED
  const drawPathGesture = Gesture.Pan()
    .onStart(() => {
      drawnPath.value = [];
      runOnJS(setIsDrawing)(true);
    })
    .onUpdate((e) => {
      const cell = { cellX: e.x, cellY: e.y };
      const lastCell = drawnPath.value[drawnPath.value.length - 1];

      if (
        !lastCell ||
        Math.sqrt(
          Math.pow(cell.cellX - lastCell[0], 2) +
            Math.pow(cell.cellY - lastCell[1], 2)
        ) > 10 // 10 units distance
      ) {
        drawnPath.value = [...drawnPath.value, [cell.cellX, cell.cellY]];
      }
    })
    .onEnd(() => {
      runOnJS(setIsDrawing)(false);
    });

  const panBackgroundGesture = Gesture.Pan()
    .onUpdate((e) => {
      // This confines the camera to the background
      offset.value = {
        x: clamp(
          start.value.x + e.translationX,
          -backgroundWidth + screenWidth,
          0
        ),
        y: clamp(
          start.value.y + e.translationY,
          -backgroundHeight + screenHeight,
          0
        ),
      };
    })
    .onEnd((e) => {
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
    });

  const touchGesture = Gesture.Tap().onStart((e) => {
    runOnJS(setLastTap)({
      x: e.x,
      y: e.y,
    });
  });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
      ],
    };
  });

  const race = Gesture.Race(
    touchGesture,
    hasSelected ? drawPathGesture : panBackgroundGesture
  );

  return (
    <GestureDetector gesture={race}>
      <Animated.View
        style={[
          styles.container,
          { width: backgroundWidth, height: backgroundHeight },
          animatedStyles,
        ]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
};
export default Background;
