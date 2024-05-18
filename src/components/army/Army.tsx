import React, { FC, useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ArmyShared } from "../../models/Army";
import { WallProps } from "../wall/Wall";
import { Grid } from "pathfinding";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { LastTap, Paths } from "../../models/Level";
import { useStyles } from "./ArmyStyles";
import { screenWidth, screenHeight } from "../../constants/ScreenSize";
import {
  addAlpha,
  expandHull,
  giftWrapping,
  initializePixelPositions,
} from "./ArmyUtils";
import Pixel from "../pixel/Pixel";
import { Canvas, Fill, Points, vec } from "@shopify/react-native-skia";
import Svg, { Polygon } from "react-native-svg";

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
  const hull = giftWrapping(pixels);
  const expandedBorder = expandHull(hull, 12);
  // TODO Do Concave Hull + limit to 6-12 points
  // TODO border animation

  const minX = Math.min(...expandedBorder.map((point) => point.x));
  const minY = Math.min(...expandedBorder.map((point) => point.y));

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withSpring(army.position.value.x) },
        { translateY: withSpring(army.position.value.y) },
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
              width: "100%",
              height: "100%",
              transform: [
                { translateX: -Math.abs(minX) },
                { translateY: -Math.abs(minY) },
              ],
            },
          ]}
        >
          <Polygon
            points={expandedBorder
              .map(
                (point) =>
                  `${point.x + Math.abs(minX)},${point.y + Math.abs(minY)}`
              )
              .join(" ")}
            fill={addAlpha(army.color, 0.4)}
            stroke={army.color}
            strokeWidth="3"
          />
        </Svg>
        {pixels.map((pixel, idx) => (
          <Pixel key={idx} pixel={pixel} color={army.color} />
        ))}
        {/* {hull.map((pixel, idx) => (
            <Pixel key={idx} pixel={pixel} color="#FFF" />
          ))} */}
      </Animated.View>
    </GestureDetector>
  );
};
export default Army;
