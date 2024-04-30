import React, { FC, useEffect, useState, useMemo } from "react";
import { View, Text } from "react-native";
import { useStyles } from "./SplashStyles";

interface SplashProps {}

const Splash: FC<SplashProps> = ({}) => {
  const styles = useStyles();
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.text}>Splash screen</Text>
    </View>
  );
};
export default Splash;
