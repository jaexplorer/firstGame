import React, { FC, useEffect, useState, useMemo } from "react";
import { View, Text, Image } from "react-native";
import { useStyles } from "./WallStyles";
import { WallBackground } from "../../../assets/images";

export interface WallProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

const Wall: FC<WallProps> = ({ x = 0, y = 0, width = 50, height = 50 }) => {
  const styles = useStyles();

  return (
    <View style={[styles.wall, { left: x, top: y, width, height }]}>
      <Image source={WallBackground} style={styles.background} />
    </View>
  );
};
export default Wall;
