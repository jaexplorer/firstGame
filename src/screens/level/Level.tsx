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
import {
  runOnJS,
  runOnUI,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import Svg, { Polyline } from "react-native-svg";
import { CELL_SIZE } from "../../constants/GameConstants";
import { createGrid, findPathPoints, floorToInterval } from "./LevelUtils";
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
  const [lastTap, setLastTap] = useState<LastTap | undefined>(undefined);
  const [paths, setPaths] = useState<Paths[]>([{ name: "", path: [] }]);

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

  const grid = useMemo<number[][]>(() => {
    return createGrid(level);
  }, [level]);

  const map = useMemo<Grid>(() => {
    const gridF = new PF.Grid(grid);
    return gridF;
  }, [grid]);

  return (
    <View style={styles.rootContainer}>
      {/* <TouchableOpacity onPress={() => navigateBack()}>
        <Text>BACK</Text>
      </TouchableOpacity> */}
      {level && (
        <Background
          backgroundWidth={level.width}
          backgroundHeight={level.height}
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
            {paths.map((p, idx) => (
              <View style={styles.poly} key={idx}>
                <Svg style={StyleSheet.absoluteFill}>
                  <Polyline
                    points={p.path
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
            ))}
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
                setPaths={setPaths}
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
