import React, { FC, useEffect, useState, useMemo } from "react";
import { View, Text, Image } from "react-native";
import { useStyles } from "./BaseStyles";
import Animated, {
  useAnimatedStyle,
  clamp,
  withSpring,
  withSequence,
  SharedValue,
  runOnJS,
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
import {
  connectPaths,
  convertToCellCoordinates,
  findPathPoints,
  splitPathByWalls,
} from "../../screens/level/LevelUtils";
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
  isDrawing: boolean;
  drawnPath: SharedValue<number[][]>;
  setPaths: (paths: Paths[]) => void;
  setHasSelected: (selected: boolean) => void;
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
  isDrawing,
  drawnPath,
  setPaths,
  setHasSelected,
}) => {
  const styles = useStyles();
  // TODO paths, need to work with armies
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
    runOnJS(setHasSelected)(true);
    // TODO Update this logic to work with armies
    bases.forEach((base, i) => {
      base.isSelected.value = i === index ? 1 : 0;
    });
  });

  const updatePath = (result: number[][]) => {
    const existingIndex = paths.findIndex((path) => path.name === base.color);

    if (existingIndex !== -1) {
      const updatedPaths = [...paths];
      updatedPaths[existingIndex].path = result;
      setPaths(updatedPaths);
    } else {
      setPaths([...paths, { name: base.color, path: result }]);
    }
    base.isSelected.value = 0;
    // TODO: This breaks the path drawing depending on how quick you select another and draw
    // drawnPath.value = [];
    setHasSelected(false);
  };

  useEffect(() => {
    if (base.isSelected.value === 1 && lastTap !== undefined) {
      const result = findPathPoints(
        base.position.value.x,
        base.position.value.y,
        lastTap.x,
        lastTap.y,
        map
      );

      updatePath(result);
    }
  }, [lastTap]);

  useEffect(() => {
    if (
      base.isSelected.value === 1 &&
      isDrawing === false &&
      drawnPath.value.length > 0
    ) {
      const split = splitPathByWalls(drawnPath.value, map);
      const chain = connectPaths(
        [[[base.position.value.x, base.position.value.y]], ...split],
        map
      );
      updatePath(chain);
    }
  }, [isDrawing]);

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
      borderWidth: base.isSelected.value === 1 ? 2 : 0,
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
