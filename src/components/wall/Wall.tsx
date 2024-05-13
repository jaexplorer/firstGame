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
  const diagonalLength = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
  const numberOfStrips = Math.ceil((width + height) / 10);

  return (
    <View style={[styles.wall, { left: x, top: y, width, height }]}>
      <View
        style={{
          position: "absolute",
          left: -diagonalLength / 2,
          top: -diagonalLength / 2,
          transform: [{ rotate: "45deg" }],
        }}
      >
        {Array.from({ length: numberOfStrips }).map((_, i) => (
          <View
            key={i}
            style={{
              width: diagonalLength * 2,
              height: 10,
              backgroundColor: i % 2 === 0 ? "black" : "#131313",
            }}
          />
        ))}
      </View>
    </View>
  );
};
export default Wall;
