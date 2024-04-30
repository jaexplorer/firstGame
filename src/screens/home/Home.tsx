import React, { FC, useEffect, useState, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useStyles } from "./HomeStyles";
import { navigate } from "../../navigation/NavigationUtils";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { ApplicationState } from "../../redux/state/ApplicationState";
import { GameActions } from "../../redux/actions/GameActions";
import { GameState } from "../../redux/state/GameState";
import { Level } from "../../models/Level";
import { level_0 } from "../../data/GameData";

interface HomeProps {
  setupLevels: (gameState: Level[]) => void;
  selectLevel: (level: number | undefined) => void;
}

const Home: FC<HomeProps> = ({ setupLevels, selectLevel }) => {
  const styles = useStyles();

  useEffect(() => {
    setupLevels([level_0]);
    selectLevel(undefined);
  }, []);

  const navigateToLevel = () => {
    selectLevel(0);
    navigate("Level");
  };

  return (
    <View style={styles.rootContainer}>
      <TouchableOpacity style={styles.button} onPress={() => navigateToLevel()}>
        <Text style={styles.text}>Home screen</Text>
      </TouchableOpacity>
    </View>
  );
};

const mapStateToProps = (state: ApplicationState) => ({});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setupLevels: (gameState: Level[]) =>
    dispatch(GameActions.setLevels(gameState)),
  selectLevel: (level: number | undefined) =>
    dispatch(GameActions.selectLevel(level)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
