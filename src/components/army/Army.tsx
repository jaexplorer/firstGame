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
  concaveHull,
  initializePixelPositions,
} from "./ArmyUtils";
import Pixel from "../pixel/Pixel";
import { Canvas, Fill, Points, vec } from "@shopify/react-native-skia";
import Svg, { Polygon } from "react-native-svg";
import { MinMax } from "./ArmyConstants";

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

  // const hull = useMemo(() => {
  //   return concaveHull(pixels, 12);
  // }, [pixels]);

  // const expandedBorder = useMemo(() => {
  //   return expandHull(hull, 12);
  // }, [hull]);

  // TODO border animation
  // TODO change when pixels are created, not every rerender

  // const minMax = useMemo<MinMax>(() => {
  //   return {
  //     minX: Math.min(...expandedBorder.map((point) => point.x)),
  //     minY: Math.min(...expandedBorder.map((point) => point.y)),
  //     maxX: Math.max(...expandedBorder.map((point) => point.x)),
  //     maxY: Math.max(...expandedBorder.map((point) => point.y)),
  //   };
  // }, [expandedBorder]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      // transform: [
      //   {
      //     translateX: withSpring(army.position.value.x - Math.abs(minMax.minX)),
      //   },
      //   {
      //     translateY: withSpring(army.position.value.y - Math.abs(minMax.minY)),
      //   },
      // ],
      transform: [
        {
          translateX: withSpring(army.position.value.x),
        },
        {
          translateY: withSpring(army.position.value.y),
        },
      ],
    };
  });

  const race = Gesture.Race();

  return (
    <GestureDetector gesture={race}>
      <Animated.View style={[styles.container, animatedStyles]}>
        {/* <Svg
          style={[
            {
              width: minMax.maxX - minMax.minX,
              height: minMax.maxY - minMax.minY,
            },
          ]}
        >
          <Polygon
            points={expandedBorder
              .map(
                (point) =>
                  `${point.x + Math.abs(minMax.minX)},${
                    point.y + Math.abs(minMax.minY)
                  }`
              )
              .join(" ")}
            fill={addAlpha(army.color, 0.4)}
            stroke={army.color}
            strokeWidth="3"
          />
        </Svg> */}
        {/* <View
          style={{
            position: "absolute",
            transform: [
              { translateX: +Math.abs(minMax.minX) },
              { translateY: +Math.abs(minMax.minY) },
            ],
          }}
        > */}
        {pixels.map((pixel, idx) => (
          <Pixel key={idx} pixel={pixel} color={army.color} />
        ))}
        {/* {hull.map((pixel, idx) => (
            <Pixel key={idx} pixel={pixel} color="#FFF" />
          ))} */}
        {/* </View> */}
      </Animated.View>
    </GestureDetector>
  );
};
export default Army;
