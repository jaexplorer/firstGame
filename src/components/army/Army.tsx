import React, { FC, useEffect, useState, useMemo } from "react";
import { View, Text, Image } from "react-native";
import { useStyles } from "./ArmyStyles";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withClamp,
  clamp,
  withDecay,
  SharedValue,
  withSpring,
  useDerivedValue,
} from "react-native-reanimated";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import { screenHeight, screenWidth } from "../../constants/ScreenSize";
import { WallProps } from "../wall/Wall";
import { isCollidingWithWalls } from "./ArmyUtils";

interface ArmyProps {
  primary?: boolean;
  color?: string;
  backgroundWidth?: number;
  backgroundHeight?: number;
  walls?: WallProps[];
  armySelected: SharedValue<Boolean>;
}

const Army: FC<ArmyProps> = ({
  primary = false,
  color,
  backgroundWidth = screenWidth,
  backgroundHeight = screenHeight,
  walls = [],
  armySelected,
}) => {
  const styles = useStyles();
  const offset = useSharedValue({ x: 0, y: 0 });
  const position = useSharedValue({ x: 0, y: 0 });

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      offset.value = { x: position.value.x, y: position.value.y };
    })
    .onUpdate((e) => {
      const clampedX = clamp(
        offset.value.x + e.translationX,
        0,
        backgroundWidth - 50
      );
      const clampedY = clamp(
        offset.value.y + e.translationY,
        0,
        backgroundHeight - 50
      );
      // Check if proposed movement collides with any walls
      if (!isCollidingWithWalls(walls, { x: clampedX, y: clampedY }, 50, 50)) {
        position.value = {
          x: clampedX,
          y: clampedY,
        };
      }
    })
    .onEnd((e) => {});

  const touchGesture = Gesture.Tap().onStart(() => {
    armySelected.value = !armySelected.value;
  });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withSpring(position.value.x) },
        { translateY: withSpring(position.value.y) },
      ],
      borderWidth: armySelected.value ? 1 : 0,
    };
  });

  const race = Gesture.Race(touchGesture, panGesture);

  return (
    <GestureDetector gesture={race}>
      <Animated.View
        style={[styles.container, { backgroundColor: color }, animatedStyles]}
      />
    </GestureDetector>
  );
};
export default Army;
