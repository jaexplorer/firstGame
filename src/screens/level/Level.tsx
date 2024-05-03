import React, { FC, useMemo, useState } from "react";
import { StatusBar as STB, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import Background from "../../components/background/Background";
import Wall from "../../components/wall/Wall";
import { Level as LevelType } from "../../models/Level";
import { ApplicationState } from "../../redux/state/ApplicationState";
import { useStyles } from "./LevelStyles";
import { CurveInterpolator } from "curve-interpolator";
import PF from "pathfinding";
import {
  runOnJS,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import Svg, { Polyline } from "react-native-svg";
import { CELL_SIZE } from "../../constants/GameConstants";
import { convertToCellCoordinates, floorToInterval } from "./LevelUtils";
import Base from "../../components/base/Base";

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
  const heightDifference = insets.bottom + insets.top + 10 + STB.currentHeight!;
  const lastTap = useSharedValue<{ x: number; y: number } | undefined>(
    undefined
  );

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
  }));

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
    const { cellX, cellY } = convertToCellCoordinates(x, y);

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

    // setProposedArmyPath(interp.getPoints(80));
  };

  // useDerivedValue(() => {
  //   if (armySelected.value === true && lastTap.value !== undefined) {
  //     const result = runOnJS(findPathPoints)(lastTap.value.x, lastTap.value.y);
  //     return result;
  //   }
  // }, [armySelected, lastTap]);

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
            {/* {proposedArmyPath && (
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
            )} */}
            {bases.map((_, idx) => (
              <Base
                key={idx}
                index={idx}
                bases={bases}
                backgroundWidth={level.width}
                backgroundHeight={level.height}
                walls={level.walls}
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
