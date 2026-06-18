import { LEVELS, type Level } from "@/constants/game";
import type { BestTimes } from "@/types/game";

const BEST_TIMES_KEY = "minesweeper-best-times";
const CURRENT_LEVEL_KEY = "minesweeper-level";

export function loadBestTimes(): BestTimes {
  try {
    const raw = localStorage.getItem(BEST_TIMES_KEY);
    if (raw) return JSON.parse(raw) as BestTimes;
  } catch (error) {
    console.error("Error loading best times from localStorage:", error);
  }
  return { beginner: null, intermediate: null, expert: null };
}

export function updateBestTime(
  level: Level,
  time: number,
  current: BestTimes,
): BestTimes {
  const existing = current[level];
  if (existing === null || time < existing) {
    const updated = { ...current, [level]: time };
    try {
      localStorage.setItem(BEST_TIMES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Error saving best times to localStorage:", error);
    }
    return updated;
  }
  return current;
}

export function getInitialLevel(): Level {
  try {
    const saved = localStorage.getItem(CURRENT_LEVEL_KEY);
    if (saved && LEVELS.includes(saved as Level)) return saved as Level;
  } catch (error) {
    console.error("Error loading current level from localStorage:", error);
  }
  return "beginner";
}

export function saveCurrentLevel(level: Level): void {
  try {
    localStorage.setItem(CURRENT_LEVEL_KEY, level);
  } catch (error) {
    console.error("Error saving current level to localStorage:", error);
  }
}
