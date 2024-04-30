import { StyleSheet } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../../theme/Theme";

export const useStyles = () => {
  const { theme } = useContext(ThemeContext);

  return StyleSheet.create({
    rootContainer: {
      flex: 1,
      backgroundColor: theme.colors.dark,
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      color: theme.colors.light,
    },
  });
};
