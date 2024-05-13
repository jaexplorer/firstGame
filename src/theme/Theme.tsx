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
    red: "rgb(255,0,0)",
    orange: "rgb(255,153,53)",
    yellow: "rgb(255,255,0)",
    green: "rgb(0,255,0)",
    sky: "rgb(95,174,254)",
    blue: "rgb(0,0,255)",
    purple: "rgb(211,0,255)",
    pink: "rgb(255,136,172)",
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

export const coreColors = [
  THEME_SCHEME.colors.red,
  THEME_SCHEME.colors.orange,
  THEME_SCHEME.colors.yellow,
  THEME_SCHEME.colors.green,
  THEME_SCHEME.colors.sky,
  THEME_SCHEME.colors.blue,
  THEME_SCHEME.colors.purple,
  THEME_SCHEME.colors.pink,
];

const themeCollection: SchemeType[] = [THEME_SCHEME];
export const defaultTheme = themeCollection[0];

export enum ThemeKey {
  MAIN = "MAIN",
}

export type SetTheme = (themeKey: ThemeKey) => void;

export const ThemeContext = createContext({
  coreColors,
  theme: defaultTheme,
  setThemeKey: (() => {}) as SetTheme,
});

export default THEME_SCHEME;
