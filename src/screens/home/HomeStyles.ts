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
    button: {
      backgroundColor: "red",
      alignItems: "center",
      justifyContent: "center",
      height: 40,
      width: 200,
    },
    text: {
      color: theme.colors.light,
    },
  });
};
