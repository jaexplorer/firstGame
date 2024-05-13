import { StyleSheet } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../../theme/Theme";

export const useStyles = () => {
  const { theme } = useContext(ThemeContext);

  return StyleSheet.create({
    wall: {
      position: "absolute",
      backgroundColor: "red",
      borderWidth: 1,
      borderColor: theme.colors.light,
      zIndex: 2,
      borderRadius: theme.units.borderRadius / 1.2,
      overflow: "hidden",
    },
    background: {
      width: "100%",
      height: "100%",
      resizeMode: "repeat",
      borderRadius: theme.units.borderRadius / 1.2,
    },
  });
};
