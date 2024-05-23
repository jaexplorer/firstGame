import React, { FC, useContext, useEffect, useMemo, useState } from "react";
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
  withSpring,
} from "react-native-reanimated";
import Svg, { Polyline } from "react-native-svg";
import { CELL_SIZE } from "../../constants/GameConstants";
import { createGrid, findPathPoints, floorToInterval } from "./LevelUtils";
import Base from "../../components/base/Base";
import { Canvas, Points, vec } from "@shopify/react-native-skia";
import { CurveInterpolator } from "curve-interpolator";
import { ThemeContext } from "../../theme/Theme";
import { PixelsShared } from "../../models/Army";
import Army from "../../components/army/Army";

interface LevelProps {
  levels: LevelType[] | undefined;
  selectedLevel: number | undefined;
}

export interface Tile {
  x: number;
  y: number;
  isWall?: boolean;
}

const Level: FC<LevelProps> = ({ levels, selectedLevel }) => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const { coreColors } = useContext(ThemeContext);
  const heightDifference = insets.bottom + insets.top + 10 + STB.currentHeight!;
  const [lastTap, setLastTap] = useState<LastTap | undefined>(undefined);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);
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

  const armies = level.armies.map((army) => ({
    offset: useSharedValue({ x: 0, y: 0 }),
    position: useSharedValue({ x: army.x, y: army.y }),
    isPlayer: army.isPlayer,
    color: army.color,
    isSelected: useSharedValue(0),
    pixels: [],
    border: useSharedValue<number[][]>([]),
  }));

  // TODO work with armies
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
    () => drawnPath.value.map((point) => vec(point[0], point[1])),
    [isDrawing, hasSelected]
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
          hasSelected={hasSelected}
          setIsDrawing={setIsDrawing}
          setLastTap={setLastTap}
        >
          <>
            {!!grid &&
              grid.map((col, colIdx) =>
                col.map((row, rowIdx) => (
                  <View
                    key={`${colIdx}-${rowIdx}`}
                    style={[
                      styles.cell,
                      colIdx === 0 &&
                        rowIdx === col.length - 1 && { backgroundColor: "red" },
                      {
                        left: colIdx * CELL_SIZE,
                        top: rowIdx * CELL_SIZE,
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
                color="white"
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
                  color={coreColors[idx]}
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
                drawnPath={drawnPath}
                setPaths={setPaths}
                setHasSelected={setHasSelected}
              />
            ))}
            {armies.map((_, idx) => (
              <Army
                key={idx}
                index={idx}
                armies={armies}
                backgroundWidth={level.width}
                backgroundHeight={level.height}
                walls={level.walls}
                lastTap={lastTap}
                map={map}
                paths={paths}
                isDrawing={isDrawing}
                drawnPath={drawnPath}
                setPaths={setPaths}
                setHasSelected={setHasSelected}
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
