import React, {
  FC,
  useEffect,
  useState,
  useContext,
  createContext,
} from "react";

export const THEME_SCHEME = {
  key: "MAIN",
  colors: {
    light: "#FFFFFF",
    dark: "#000",
  },
  font: {
    xxs: 10,
    xs: 12,
    s: 14,
    m: 16,
    l: 18,
    xl: 20,
    xxl: 28,
    xxxl: 38,
  },
  units: {
    spacing: 4,
    borderRadius: 16,
    iconHeight: 24,
    iconWidth: 24,
  },
};
export type SchemeType = typeof THEME_SCHEME;

const themeCollection: SchemeType[] = [THEME_SCHEME];
export const defaultTheme = themeCollection[0];

export enum ThemeKey {
  MAIN = "MAIN",
}

export type SetTheme = (themeKey: ThemeKey) => void;

export const ThemeContext = createContext({
  theme: defaultTheme,
  setThemeKey: (() => {}) as SetTheme,
});
