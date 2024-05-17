import { StyleSheet } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../../theme/Theme";
import { BASE_SIZE } from "../../constants/GameConstants";

export const useStyles = () => {
  const { theme } = useContext(ThemeContext);

  return StyleSheet.create({
    container: {
      position: "absolute",
      backgroundColor: "green",
      width: 4,
      height: 4,
    },
  });
};
