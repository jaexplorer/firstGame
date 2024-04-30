import { StyleSheet } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../../theme/Theme";

export const useStyles = () => {
  const { theme } = useContext(ThemeContext);

  return StyleSheet.create({
    container: {
      position: "absolute",
      backgroundColor: "green",
      width: 50,
      height: 50,
      borderRadius: theme.units.borderRadius / 1.2,
      borderColor: theme.colors.light,
      borderWidth: 0,
    },
  });
};
