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
      shadowColor: "red", // Change to desired glow color
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 10, // Adjust to make the glow more or less intense
      elevation: 10, // For Android
    },
  });
};
