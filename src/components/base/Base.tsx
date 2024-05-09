import React, { FC, useEffect, useState, useMemo } from "react";
import { View, Text, Image } from "react-native";
import { useStyles } from "./BaseStyles";
import Animated, {
  useAnimatedStyle,
  clamp,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import { screenHeight, screenWidth } from "../../constants/ScreenSize";
import { WallProps } from "../wall/Wall";
import { getDistance, isCollidingWithWalls } from "./BaseUtils";
import { BaseShared } from "../../models/Base";
import { LastTap, Paths } from "../../models/Level";
import { Grid } from "pathfinding";
import { findPathPoints } from "../../screens/level/LevelUtils";
import {
  BASE_SIZE,
  BASE_SPEED,
  CELL_SIZE,
} from "../../constants/GameConstants";

interface BaseProps {
  backgroundWidth?: number;
  backgroundHeight?: number;
  walls?: WallProps[];
  index: number;
  bases: BaseShared[];
  lastTap: LastTap | undefined;
  map: Grid;
  paths: Paths[];
  setPaths: (paths: Paths[]) => void;
}

const Base: FC<BaseProps> = ({
  backgroundWidth = screenWidth,
  backgroundHeight = screenHeight,
  walls = [],
  index,
  bases,
  lastTap,
  map,
  paths,
  setPaths,
}) => {
  const styles = useStyles();
  const base = bases[index];
  const path = paths[index];

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
    });

  const touchGesture = Gesture.Tap().onStart(() => {
    bases.forEach((base, i) => {
      base.isSelected.value = i === index ? 1 : 0;
    });
  });

  useEffect(() => {
    if (base.isSelected.value === 1 && lastTap !== undefined) {
      const result = findPathPoints(
        base.position.value.x,
        base.position.value.y,
        lastTap.x,
        lastTap.y,
        map
      );

      const existingIndex = paths.findIndex((path) => path.name === base.color);

      if (existingIndex !== -1) {
        const updatedPaths = [...paths];
        updatedPaths[existingIndex].path = result;
        setPaths(updatedPaths);
      } else {
        setPaths([...paths, { name: base.color, path: result }]);
      }
      base.isSelected.value = 0;
    }
  }, [lastTap]);

  const moveAlongPath = (path: number[][]) => {
    let previousPoint = path[0];
    const animations = path.map(([x, y]) => {
      const dist = getDistance([previousPoint[0], previousPoint[1]], [x, y]);
      const duration = ((dist * CELL_SIZE) / BASE_SPEED) * 1000;
      previousPoint = [x, y];
      return withSpring(
        {
          x: x * CELL_SIZE - (BASE_SIZE - CELL_SIZE) / 2,
          y: y * CELL_SIZE - (BASE_SIZE - CELL_SIZE) / 2,
        },
        { duration: duration }
      );
    });

    return withSequence(...animations);
  };

  useEffect(() => {
    if (path !== undefined && path.path.length > 0) {
      base.position.value = moveAlongPath(path.path);
    }
  }, [path?.path]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withSpring(base.position.value.x) },
        { translateY: withSpring(base.position.value.y) },
      ],
      backgroundColor: base.color,
      borderWidth: base.isSelected.value,
    };
  });

  const race = Gesture.Race(touchGesture, panGesture);

  return (
    <GestureDetector gesture={race}>
      <Animated.View style={[styles.container, animatedStyles]} />
    </GestureDetector>
  );
};
export default Base;
