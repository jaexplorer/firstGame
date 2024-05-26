import React, { FC, useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ArmyShared } from "../../models/Army";
import { WallProps } from "../wall/Wall";
import { Grid } from "pathfinding";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";
import { LastTap, Paths } from "../../models/Level";
import { useStyles } from "./ArmyStyles";
import { screenWidth, screenHeight } from "../../constants/ScreenSize";
import {
  addAlpha,
  expandHull,
  concaveHull,
  initializePixelPositions,
} from "./ArmyUtils";
import Pixel from "../pixel/Pixel";
import { Canvas, Fill, Points, vec } from "@shopify/react-native-skia";
import Svg, { Polygon } from "react-native-svg";
import { MinMax } from "./ArmyConstants";

const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);

interface ArmyProps {
  backgroundWidth?: number;
  backgroundHeight?: number;
  walls?: WallProps[];
  index: number;
  armies: ArmyShared[];
  lastTap: LastTap | undefined;
  map: Grid;
  paths: Paths[];
  isDrawing: boolean;
  drawnPath: SharedValue<number[][]>;
  setPaths: (paths: Paths[]) => void;
  setHasSelected: (selected: boolean) => void;
}

const Army: FC<ArmyProps> = ({
  backgroundWidth = screenWidth,
  backgroundHeight = screenHeight,
  walls = [],
  index,
  armies,
  lastTap,
  map,
  paths,
  isDrawing,
  drawnPath,
  setPaths,
  setHasSelected,
}) => {
  const styles = useStyles();
  const army = armies[index];
  const pixels = initializePixelPositions(30);

  const hull = concaveHull(pixels, 12);

  const expandedBorder = expandHull(hull, 12);

  // TODO border animation
  // TODO change when pixels are created, not every rerender

  const minMax = useMemo<MinMax>(() => {
    return {
      minX: Math.min(...expandedBorder.map((point) => point.position.value.x)),
      minY: Math.min(...expandedBorder.map((point) => point.position.value.y)),
      maxX: Math.max(...expandedBorder.map((point) => point.position.value.x)),
      maxY: Math.max(...expandedBorder.map((point) => point.position.value.y)),
    };
  }, [expandedBorder]);

  const animatedPoints = useDerivedValue(() => {
    return expandedBorder
      .map(
        (pixel) =>
          `${pixel.position.value.x + Math.abs(minMax.minX)},${
            pixel.position.value.y + Math.abs(minMax.minY)
          }`
      )
      .join(" ");
  });

  const animatedProps = useAnimatedProps(() => {
    return {
      points: animatedPoints.value,
    };
  });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(army.position.value.x - Math.abs(minMax.minX)),
        },
        {
          translateY: withSpring(army.position.value.y - Math.abs(minMax.minY)),
        },
      ],
    };
  });

  const race = Gesture.Race();

  return (
    <GestureDetector gesture={race}>
      <Animated.View style={[styles.container, animatedStyles]}>
        <Svg
          style={[
            {
              width: minMax.maxX - minMax.minX,
              height: minMax.maxY - minMax.minY,
            },
          ]}
        >
          <AnimatedPolygon
            animatedProps={animatedProps}
            fill={addAlpha(army.color, 0.4)}
            stroke={army.color}
            strokeWidth="3"
          />
        </Svg>
        <View
          style={{
            position: "absolute",
            transform: [
              { translateX: +Math.abs(minMax.minX) },
              { translateY: +Math.abs(minMax.minY) },
            ],
          }}
        >
          {pixels.map((pixel, idx) => (
            <Pixel key={idx} pixel={pixel} color={army.color} />
          ))}
        </View>
      </Animated.View>
    </GestureDetector>
  );
};
export default Army;
