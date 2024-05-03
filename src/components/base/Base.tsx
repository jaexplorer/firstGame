import React, { FC, useEffect, useState, useMemo } from "react";
import { View, Text, Image } from "react-native";
import { useStyles } from "./BaseStyles";
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
import { isCollidingWithWalls } from "./BaseUtils";
import { BASE_SIZE, BaseShared } from "../../models/Base";

interface BaseProps {
  backgroundWidth?: number;
  backgroundHeight?: number;
  walls?: WallProps[];
  index: number;
  bases: BaseShared[];
}

const Base: FC<BaseProps> = ({
  backgroundWidth = screenWidth,
  backgroundHeight = screenHeight,
  walls = [],
  index,
  bases,
}) => {
  const styles = useStyles();
  const base = bases[index];

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      base.offset.value = {
        x: base.position.value.x,
        y: base.position.value.y,
      };
    })
    .onUpdate((e) => {
      const clampedX = clamp(
        base.offset.value.x + e.translationX,
        0,
        backgroundWidth - BASE_SIZE
      );
      const clampedY = clamp(
        base.offset.value.y + e.translationY,
        0,
        backgroundHeight - BASE_SIZE
      );
      // Check if proposed movement collides with any walls
      if (
        !isCollidingWithWalls(
          walls,
          { x: clampedX, y: clampedY },
          BASE_SIZE,
          BASE_SIZE
        )
      ) {
        base.position.value = {
          x: clampedX,
          y: clampedY,
        };
      }
    })
    .onEnd((e) => {});

  // const touchGesture = Gesture.Tap().onStart(() => {
  //   armySelected.value = !armySelected.value;
  // });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withSpring(base.position.value.x) },
        { translateY: withSpring(base.position.value.y) },
      ],
      backgroundColor: base.color,
      borderWidth: 0,
    };
  });

  const race = Gesture.Race(panGesture);

  return (
    <GestureDetector gesture={race}>
      <Animated.View style={[styles.container, animatedStyles]} />
    </GestureDetector>
  );
};
export default Base;
