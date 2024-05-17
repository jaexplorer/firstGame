import React, { FC, useEffect, useState, useMemo } from "react";
import { View, Text } from "react-native";
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
import { initializePixelPositions } from "./ArmyUtils";
import Pixel from "../pixel/Pixel";

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
        {pixels.map((pixel, idx) => (
          <Pixel key={idx} pixel={pixel} color={army.color} />
        ))}
      </Animated.View>
    </GestureDetector>
  );
};
export default Army;
