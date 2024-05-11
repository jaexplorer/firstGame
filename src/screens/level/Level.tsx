import React, { FC, useEffect, useMemo, useState } from "react";
import { StatusBar as STB, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import Background from "../../components/background/Background";
import Wall from "../../components/wall/Wall";
import { LastTap, Level as LevelType, Paths } from "../../models/Level";
import { ApplicationState } from "../../redux/state/ApplicationState";
import { useStyles } from "./LevelStyles";
import PF, { Grid } from "pathfinding";
import Animated, {
  runOnJS,
  runOnUI,
  useAnimatedProps,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import Svg, { Polyline } from "react-native-svg";
import { CELL_SIZE } from "../../constants/GameConstants";
import { createGrid, findPathPoints, floorToInterval } from "./LevelUtils";
import Base from "../../components/base/Base";
import { Canvas, Points, vec } from "@shopify/react-native-skia";
import { CurveInterpolator } from "curve-interpolator";

interface LevelProps {
  levels: LevelType[] | undefined;
  selectedLevel: number | undefined;
}

export interface Tile {
  x: number;
  y: number;
  isWall?: boolean;
}

const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);

const Level: FC<LevelProps> = ({ levels, selectedLevel }) => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const heightDifference = insets.bottom + insets.top + 10 + STB.currentHeight!;
  const [lastTap, setLastTap] = useState<LastTap | undefined>(undefined);
  const [isDrawing, setIsDrawing] = useState(false);
  const drawnPath = useSharedValue<number[][]>([]);

  const level = useMemo<LevelType | undefined>(() => {
    if (!!levels && !!levels.length && selectedLevel !== undefined) {
      let result = levels[selectedLevel];
      return {
        ...result,
        height: floorToInterval(result.height - heightDifference, CELL_SIZE),
        width: floorToInterval(result.width, CELL_SIZE),
      };
    }
    return undefined;
  }, [levels, selectedLevel]);

  if (level === undefined) return null;

  const bases = level.players.map((player) => ({
    offset: useSharedValue({ x: 0, y: 0 }),
    position: useSharedValue({ x: player.x, y: player.y }),
    isPlayer: player.isPlayer,
    color: player.color,
    isSelected: useSharedValue(0),
  }));

  const [paths, setPaths] = useState<Paths[]>(
    level.players.map((player) => ({ name: player.color, path: [] }))
  );

  const grid = useMemo<number[][]>(() => {
    return createGrid(level);
  }, [level]);

  const map = useMemo<Grid>(() => {
    const gridF = new PF.Grid(grid);
    return gridF;
  }, [grid]);

  const points = useDerivedValue(
    // () =>
    //   drawnPath.value.map((point) =>
    //     vec(
    //       point[0] * CELL_SIZE + CELL_SIZE / 2,
    //       point[1] * CELL_SIZE + CELL_SIZE / 2
    //     )
    //   ),
    () => drawnPath.value.map((point) => vec(point[0], point[1])),
    [isDrawing]
  );

  return (
    <View style={styles.rootContainer}>
      {/* <TouchableOpacity onPress={() => navigateBack()}>
        <Text>BACK</Text>
      </TouchableOpacity> */}
      {level && (
        <Background
          backgroundWidth={level.width}
          backgroundHeight={level.height}
          drawnPath={drawnPath}
          setIsDrawing={setIsDrawing}
          setLastTap={setLastTap}
        >
          <>
            {!!grid &&
              grid.map((row, rIdx) =>
                row.map((col, cIdx) => (
                  <View
                    key={`${rIdx}-${cIdx}`}
                    style={[
                      styles.cell,
                      {
                        left: rIdx * CELL_SIZE,
                        top: cIdx * CELL_SIZE,
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                      },
                    ]}
                  />
                ))
              )}

            {level.walls.map((wall, idx) => (
              <Wall
                key={idx}
                x={wall.x}
                y={wall.y}
                width={wall.width}
                height={wall.height}
              />
            ))}

            <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
              <Points
                points={points}
                mode="polygon"
                color="lightblue"
                style="stroke"
                strokeWidth={4}
              />
              {paths.map((p, idx) => (
                <Points
                  key={idx}
                  points={p.path.map((point) =>
                    vec(
                      point[0] * CELL_SIZE + CELL_SIZE / 2,
                      point[1] * CELL_SIZE + CELL_SIZE / 2
                    )
                  )}
                  mode="polygon"
                  color="red"
                  style="stroke"
                  strokeWidth={4}
                />
              ))}
            </Canvas>

            {bases.map((_, idx) => (
              <Base
                key={idx}
                index={idx}
                bases={bases}
                backgroundWidth={level.width}
                backgroundHeight={level.height}
                walls={level.walls}
                lastTap={lastTap}
                map={map}
                paths={paths}
                isDrawing={isDrawing}
                setPaths={setPaths}
                drawnPath={drawnPath}
              />
            ))}
          </>
        </Background>
      )}
    </View>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  levels: state.gameState.levels,
  selectedLevel: state.gameState.selectedLevel,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Level);
