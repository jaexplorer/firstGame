import React, { FC, useEffect, useState, useMemo } from "react";
import { View, Text } from "react-native";
import { WallProps } from "../wall/Wall";
import { Grid } from "pathfinding";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { LastTap, Paths } from "../../models/Level";
import { useStyles } from "./PixelStyles";
import { screenWidth, screenHeight } from "../../constants/ScreenSize";
import { PixelsShared } from "../../models/Army";
import { randomInterval } from "./PixelUtils";

interface PixelProps {
  pixel: { x: number; y: number };
  color: string;
}

const Pixel: FC<PixelProps> = ({ pixel, color }) => {
  const styles = useStyles();

  const jiggleX = useSharedValue(pixel.x);
  const jiggleY = useSharedValue(pixel.y);

  useEffect(() => {
    const intervalId = setInterval(() => {
      jiggleX.value = withTiming(pixel.x + Math.random() * 2);
      jiggleY.value = withTiming(pixel.y + Math.random() * 2);
    }, randomInterval(100, 400));

    return () => clearInterval(intervalId);
  }, []);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: jiggleX.value }, { translateY: jiggleY.value }],
      backgroundColor: color,
      shadowColor: color,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyles]}></Animated.View>
  );
};

export default Pixel;
