import React, { FC, useEffect, useState, useMemo } from "react";
import { View, Text, StatusBar as STB, StyleSheet } from "react-native";
import { useStyles } from "./LevelStyles";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { ApplicationState } from "../../redux/state/ApplicationState";
import { Level as LevelType } from "../../models/Level";
import Background from "../../components/background/Background";
import { ARMY, WALLS } from "../../components/background/BackgroundConstants";
import Wall from "../../components/wall/Wall";
import Army from "../../components/army/Army";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { navigateBack } from "../../navigation/NavigationUtils";
// import { NavMesh, buildPolysFromGridMap, PolyPoints } from "navmesh";
import {
  convertToCellCoordinates,
  floorToInterval,
  isWalkable,
  roundToInterval,
} from "./LevelUtils";
import { CELL_SIZE } from "../../constants/GameConstants";
import Svg, { Polygon, Polyline } from "react-native-svg";
import { CurveInterpolator } from "curve-interpolator";
import {
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import PF from "pathfinding";

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
  const armySelected = useSharedValue(false);
  const lastTap = useSharedValue<{ x: number; y: number } | undefined>(
    undefined
  );
  const [proposedArmyPath, setProposedArmyPath] = useState<undefined | any[][]>(
    undefined
  );

  const heightDifference = insets.bottom + insets.top + 10 + STB.currentHeight!;
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

  const grid = useMemo<number[][]>(() => {
    return Array.from({ length: level.height / CELL_SIZE }, (_, y) =>
      Array.from({ length: level.width / CELL_SIZE }, (_, x) => {
        const WALL_BUFFER = CELL_SIZE;
        const isWall = level.walls.some(
          (wall) =>
            x * CELL_SIZE >= wall.x - WALL_BUFFER &&
            x * CELL_SIZE < wall.x + wall.width + WALL_BUFFER &&
            y * CELL_SIZE >= wall.y - WALL_BUFFER &&
            y * CELL_SIZE < wall.y + wall.height + WALL_BUFFER
        );

        return isWall ? 1 : 0;
      })
    );
  }, [level]);

  const map = useMemo(() => {
    const gridF = new PF.Grid(grid);
    return gridF;
  }, [grid]);

  const findPathPoints = (x: number, y: number) => {
    console.log("XY", `${x} - ${y}`);
    const { cellX, cellY } = convertToCellCoordinates(x, y);
    // TODO - if clicking a wall, it breaks, fix it
    console.log("cellX, cellY", `${cellX} - ${cellY}`);

    const finder = new PF.AStarFinder({
      allowDiagonal: true,
      dontCrossCorners: false,
    });
    const proposedPath: number[][] = finder.findPath(
      1,
      1,
      cellX,
      cellY,
      map.clone()
    );
    const newPath = PF.Util.smoothenPath(map.clone(), proposedPath);
    const interp = new CurveInterpolator(newPath, {
      tension: 0.5,
      alpha: 0.5,
    });

    setProposedArmyPath(interp.getPoints(80));
  };

  useDerivedValue(() => {
    if (armySelected.value === true && lastTap.value !== undefined) {
      const result = runOnJS(findPathPoints)(lastTap.value.x, lastTap.value.y);
      console.log("resuslt", result);
      return result;
    }
  }, [armySelected, lastTap]);

  console.log("proposedArmyPath", proposedArmyPath);

  return (
    <View style={styles.rootContainer}>
      {/* <TouchableOpacity onPress={() => navigateBack()}>
        <Text>BACK</Text>
      </TouchableOpacity> */}
      {level && (
        <Background
          backgroundWidth={level.width}
          backgroundHeight={level.height}
          lastTap={lastTap}
          armySelected={armySelected}
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
            {proposedArmyPath && (
              <View style={styles.poly}>
                <Svg style={StyleSheet.absoluteFill}>
                  <Polyline
                    points={proposedArmyPath
                      .map(
                        (point) =>
                          `${point[0] * CELL_SIZE + CELL_SIZE / 2},${
                            point[1] * CELL_SIZE + CELL_SIZE / 2
                          }`
                      )
                      .join(" ")}
                    fill="none"
                    stroke="red"
                    strokeWidth="3"
                  />
                </Svg>
              </View>
            )}
            <Army
              primary={level.players[0].isPlayer}
              color={level.players[0].color}
              backgroundWidth={level.width}
              backgroundHeight={level.height}
              walls={level.walls}
              armySelected={armySelected}
            />
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
