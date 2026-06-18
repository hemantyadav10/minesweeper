import type { Level } from "@/constants/game";

export type BestTimes = Record<Level, number | null>;

export type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  isQuestioned: boolean;
  adjacentMines: number;
};

export type Board = Cell[][];

export type GameStatus = "idle" | "playing" | "won" | "lost";
