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
import { LastTap } from "../../models/Level";
import { convertToCellCoordinatesWorklet } from "../../screens/level/LevelUtils";
import Svg, { Polyline } from "react-native-svg";
import { CELL_SIZE } from "../../constants/GameConstants";

interface BackgroundProps {
  backgroundWidth?: number;
  backgroundHeight?: number;
  children: ReactNode;
  path: SharedValue<number[][]>;
  isDrawing: SharedValue<number>;
  setLastTap: (position: LastTap) => void;
}

const Background: FC<BackgroundProps> = ({
  backgroundWidth = screenWidth,
  backgroundHeight = screenHeight,
  children,
  path,
  isDrawing,
  setLastTap,
}) => {
  const styles = useStyles();
  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });
  const lastTimestamp = useSharedValue(Date.now());

  const interval = 800; // Interval in milliseconds

  const panGesture = Gesture.Pan()
    .onStart(() => {
      path.value = [];
      isDrawing.value = 1;
    })
    .onUpdate((e) => {
      if (Date.now() - lastTimestamp.value > interval) {
        const cell = convertToCellCoordinatesWorklet(e.x, e.y);
        const lastCell = path.value[path.value.length - 1];

        if (
          !lastCell ||
          cell.cellX !== lastCell[0] ||
          cell.cellY !== lastCell[1]
        ) {
          path.value = [...path.value, [cell.cellX, cell.cellY]];
        }
      }
    })
    .onEnd(() => {
      console.log("Path drawn");
      isDrawing.value = 0;
    });

  // const panGesture = Gesture.Pan()
  //   .onUpdate((e) => {
  //     // This confines the camera to the background
  //     offset.value = {
  //       x: clamp(
  //         start.value.x + e.translationX,
  //         -backgroundWidth + screenWidth,
  //         0
  //       ),
  //       y: clamp(
  //         start.value.y + e.translationY,
  //         -backgroundHeight + screenHeight,
  //         0
  //       ),
  //     };
  //   })
  //   .onEnd((e) => {
  //     start.value = {
  //       x: offset.value.x,
  //       y: offset.value.y,
  //     };
  //   });

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

  const race = Gesture.Race(touchGesture, panGesture);

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
