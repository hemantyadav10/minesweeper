import { classicTheme } from "./classic";
import { darkTheme } from "./dark";
import type { ThemeConfig, Themes } from "./types";

export const themes: Record<Themes, ThemeConfig> = {
  classic: classicTheme,
  dark: darkTheme,
};
