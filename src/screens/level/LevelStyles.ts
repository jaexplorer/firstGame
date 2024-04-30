import { StyleSheet } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../../theme/Theme";

export const useStyles = () => {
  const { theme } = useContext(ThemeContext);

  return StyleSheet.create({
    rootContainer: {
      flex: 1,
      backgroundColor: theme.colors.dark,
    },
    cell: {
      position: "absolute",
      backgroundColor: theme.colors.dark,
      borderWidth: 0.5,
      borderColor: theme.colors.light,
    },
    poly: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "center",
      alignItems: "center",
    },
  });
};
