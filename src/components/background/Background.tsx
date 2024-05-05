import React, { FC, useEffect, useState, useMemo, ReactNode } from "react";
import { View } from "react-native";
import { useStyles } from "./BackgroundStyles";
import Wall from "../wall/Wall";
import { screenHeight, screenWidth } from "../../constants/ScreenSize";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  clamp,
  SharedValue,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { LastTap } from "../../models/Level";

interface BackgroundProps {
  backgroundWidth?: number;
  backgroundHeight?: number;
  children: ReactNode;
  lastTap: SharedValue<LastTap | undefined>;
}

const Background: FC<BackgroundProps> = ({
  backgroundWidth = screenWidth,
  backgroundHeight = screenHeight,
  children,
  lastTap,
}) => {
  const styles = useStyles();
  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });

  const panGesture = Gesture.Pan()
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
    lastTap.value = {
      x: e.x,
      y: e.y,
    };
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
