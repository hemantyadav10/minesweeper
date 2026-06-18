import { MAX_TIMER } from "@/constants/game";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  return String(Math.min(seconds, MAX_TIMER)).padStart(3, "0");
}

/**
 * Formats the remaining mine counter.
 * Classic minesweeper shows negatives down to -99 (3 chars: sign + 2 digits).
 * Positive values are zero-padded to 3 digits.
 */
export function formatMineCount(n: number): string {
  if (n < 0) {
    const abs = Math.min(99, Math.abs(n));
    if (abs < 10) return "0-" + String(abs); // -1 to -9 → "0-1" to "0-9"

    return "-" + String(abs); // -10 to -99 → "-10" to "-99"
  }
  return String(Math.min(999, n)).padStart(3, "0");
}

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function formatWinTime(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
}
