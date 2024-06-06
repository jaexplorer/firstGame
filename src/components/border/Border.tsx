import React, { FC, useEffect, useState, useMemo } from "react";
import { View, Text } from "react-native";
import { WallProps } from "../wall/Wall";
import { Grid } from "pathfinding";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { LastTap, Paths } from "../../models/Level";
import { useStyles } from "./BorderStyles";
import { PixelsShared } from "../../models/Army";

interface BorderProps {
  point: PixelsShared;
  centroid: { x: number; y: number };
  color: string;
}

const Border: FC<BorderProps> = ({ point, centroid, color }) => {
  const styles = useStyles();
  const dx = point.position.value.x - centroid.x;
  const dy = point.position.value.y - centroid.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const scale = (length + 12) / length;

  // const calculateDistance = (point1: PixelsShared, point2: PixelsShared) => {
  //   return Math.hypot(point2.x - point1.x, point2.y - point1.y);
  // };

  // const calculateAngle = (point1: PixelsShared, point2: PixelsShared) => {
  //   return Math.atan2(point2.y - point1.y, point2.x - point1.x) * 180 / Math.PI;
  // };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX:
            centroid.x + (point.position.value.x - centroid.x) * scale,
        },
        {
          translateY:
            centroid.y + (point.position.value.y - centroid.y) * scale,
        },
      ],
    };
  });

  return <Animated.View style={[styles.container, animatedStyles]} />;
};

export default Border;
