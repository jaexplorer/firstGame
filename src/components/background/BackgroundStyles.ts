import { StyleSheet } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../../theme/Theme";

export const useStyles = () => {
  const { theme } = useContext(ThemeContext);

  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.dark,
      position: "relative",
      borderWidth: 1,
      borderColor: theme.colors.light,
      borderRadius: theme.units.borderRadius * 1.6,
      marginTop: 5,
      overflow: "hidden",
    },
    poly: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "center",
      alignItems: "center",
    },
  });
};
