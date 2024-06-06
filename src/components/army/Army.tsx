import React, { FC, useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ArmyShared, PixelsShared } from "../../models/Army";
import { WallProps } from "../wall/Wall";
import { Grid } from "pathfinding";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
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
  computeCentroid,
} from "./ArmyUtils";
import Pixel from "../pixel/Pixel";
import { Canvas, Fill, Points, vec } from "@shopify/react-native-skia";
import Svg, { Polygon } from "react-native-svg";
import { MinMax } from "./ArmyConstants";
import Border from "../border/Border";

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
  let hull: PixelsShared[] = [];
  let centroid: { x: number; y: number };

  useDerivedValue(() => {
    const pixelValues = pixels.map((pixel) => ({
      offset: pixel.offset,
      position: pixel.position,
    }));

    const hullResult = concaveHull(pixelValues, 12);
    hull = hullResult;
    centroid = computeCentroid(hullResult);
  });

  const minMax = useMemo<MinMax>(() => {
    return {
      minX: Math.min(...hull.map((point) => point.position.value.x)),
      minY: Math.min(...hull.map((point) => point.position.value.y)),
      maxX: Math.max(...hull.map((point) => point.position.value.x)),
      maxY: Math.max(...hull.map((point) => point.position.value.y)),
    };
  }, [hull]);

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

  const animatedPoints = useDerivedValue(() => {
    return hull
      .map((pixel) => {
        const dx = pixel.position.value.x - centroid.x;
        const dy = pixel.position.value.y - centroid.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const scale = (length + 12) / length;
        const x = centroid.x + dx * scale;
        const y = centroid.y + dy * scale;
        return `${x + Math.abs(minMax.minX)},${y + Math.abs(minMax.minY)}`;
      })
      .join(" ");
  });

  const animatedProps = useAnimatedProps(() => {
    return {
      points: animatedPoints.value,
    };
  });

  return (
    <GestureDetector gesture={race}>
      <Animated.View style={[styles.container, animatedStyles]}>
        <Svg
          style={[
            {
              width: minMax.maxX + 20 - minMax.minX,
              height: minMax.maxY + 20 - minMax.minY,
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

        {/* {hull.map((pixel, idx) => (
          <Border
            key={idx}
            centroid={centroid}
            point={pixel}
            color={army.color}
          />
        ))} */}
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
