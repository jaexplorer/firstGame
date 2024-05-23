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
  pixel: PixelsShared;
  color: string;
}

const Pixel: FC<PixelProps> = ({ pixel, color }) => {
  const styles = useStyles();

  useEffect(() => {
    const intervalId = setInterval(() => {
      pixel.position.value.x = withTiming(
        pixel.position.value.x + Math.random() * 2
      );
      pixel.position.value.y = withTiming(
        pixel.position.value.y + Math.random() * 2
      );
    }, randomInterval(100, 400));

    return () => clearInterval(intervalId);
  }, []);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: pixel.position.value.x },
        { translateY: pixel.position.value.y },
      ],
      backgroundColor: color,
      shadowColor: color,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyles]}></Animated.View>
  );
};

export default Pixel;
