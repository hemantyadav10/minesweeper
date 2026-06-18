export const LEVELS = ["beginner", "intermediate", "expert"] as const;

export type Level = (typeof LEVELS)[number];

export type LevelConfig = {
  [key in Level]: { rows: number; columns: number; mines: number };
};

export const MAX_TIMER = 999;

export const LEVEL_CONFIG: LevelConfig = {
  beginner: { columns: 9, rows: 9, mines: 10 },
  intermediate: { rows: 16, columns: 16, mines: 40 },
  expert: { rows: 16, columns: 30, mines: 99 },
};
