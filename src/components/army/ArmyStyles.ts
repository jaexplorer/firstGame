import { StyleSheet } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../../theme/Theme";
import { BASE_SIZE } from "../../constants/GameConstants";

export const useStyles = () => {
  const { theme } = useContext(ThemeContext);

  return StyleSheet.create({
    container: {
      position: "absolute",
      width: BASE_SIZE,
      height: BASE_SIZE,
      borderRadius: theme.units.borderRadius / 3,
      borderColor: theme.colors.light,
      borderWidth: 0,
    },
  });
};
