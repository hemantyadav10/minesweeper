import type { Board, Cell } from "@/types/game";
import { shuffle } from "./utils";

const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
] as const;

function isInBounds(board: Board, r: number, c: number): boolean {
  return r >= 0 && r < board.length && c >= 0 && c < board[0].length;
}

/**
 * Creates a new Minesweeper board.
 *
 * Mine placement is deferred until the player's first click. When an exclusion
 * cell is provided, that cell and its surrounding neighbors are guaranteed to
 * contain no mines. This ensures the first reveal always expands into a blank
 * area instead of immediately exposing a numbered cell.
 */
export function createBoard(
  rows: number,
  cols: number,
  mineCount: number,
  excludeRow?: number,
  excludeCol?: number,
): Board {
  const defaultCell: Cell = {
    isMine: false,
    isRevealed: false,
    isFlagged: false,
    isQuestioned: false,
    adjacentMines: 0,
  };

  const grid: Board = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      ...defaultCell,
      row: r,
      column: c,
    })),
  );

  // Exclude the first-click region from mine placement so the opening move
  // always reveals an empty area.
  const excluded = new Set<string>();

  if (excludeRow !== undefined && excludeCol !== undefined) {
    excluded.add(`${excludeRow},${excludeCol}`);

    DIRECTIONS.forEach(([dr, dc]) => {
      const nr = excludeRow + dr;
      const nc = excludeCol + dc;

      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        excluded.add(`${nr},${nc}`);
      }
    });
  }

  const candidates: [number, number][] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!excluded.has(`${r},${c}`)) {
        candidates.push([r, c]);
      }
    }
  }

  const mineCells = new Set(
    shuffle(candidates)
      .slice(0, mineCount)
      .map(([r, c]) => `${r},${c}`),
  );

  const withMines: Board = grid.map((row, r) =>
    row.map((cell, c) => ({
      ...cell,
      isMine: mineCells.has(`${r},${c}`),
    })),
  );

  // Compute the number displayed on each non-mine cell.
  return withMines.map((row, r) =>
    row.map((cell, c) => {
      if (cell.isMine) return cell;

      const adjacentMines = DIRECTIONS.reduce((count, [dr, dc]) => {
        const nr = r + dr;
        const nc = c + dc;

        return isInBounds(withMines, nr, nc) && withMines[nr][nc].isMine
          ? count + 1
          : count;
      }, 0);

      return { ...cell, adjacentMines };
    }),
  );
}

/**
 * Reveals all connected empty cells and their numbered border.
 *
 * This function mutates the provided board in place. Keeping mutation explicit
 * avoids repeatedly copying the board during recursive flood-fill operations.
 * Callers that require immutability should create a copy before invoking it.
 */
export function floodFill(r: number, c: number, grid: Board): void {
  if (!isInBounds(grid, r, c)) return;

  const cell = grid[r][c];

  // Flagged, questioned, and already revealed cells stop expansion.
  if (cell.isFlagged || cell.isQuestioned || cell.isRevealed) return;

  grid[r][c] = { ...cell, isRevealed: true };

  // Numbered cells form the boundary of the flood fill.
  if (cell.adjacentMines > 0) return;

  DIRECTIONS.forEach(([dr, dc]) => floodFill(r + dr, c + dc, grid));
}

/**
 * Creates a shallow copy of the board.
 *
 * Row arrays are copied, but cell objects are shared until replaced.
 */
export function copyBoard(b: Board): Board {
  return b.map((row) => [...row]);
}

/** Reveals every mine on the board. Used when the player loses. */
export function revealAllMines(b: Board): Board {
  return b.map((row) =>
    row.map((cell) => {
      if (!cell.isMine) return cell;

      return { ...cell, isRevealed: true };
    }),
  );
}

/** Flags every mine. Used to display the completed board after a win. */
export function flagAllMines(b: Board): Board {
  return b.map((row) =>
    row.map((cell) =>
      cell.isMine ? { ...cell, isFlagged: true, isQuestioned: false } : cell,
    ),
  );
}

/**
 * Performs a chord on a revealed numbered cell.
 *
 * A chord succeeds only when the number of flagged neighboring cells matches
 * the number displayed on the selected cell. When successful, every remaining
 * adjacent hidden cell is revealed.
 *
 * The supplied board is mutated via floodFill().
 */
export function attemptChord(
  board: Board,
  rowIndex: number,
  colIndex: number,
): "hit" | "chord" | "no-match" | "not-chordable" {
  const cell = board[rowIndex][colIndex];

  if (!cell.isRevealed || cell.adjacentMines === 0) {
    return "not-chordable";
  }

  const flaggedNeighbors = DIRECTIONS.reduce((count, [dr, dc]) => {
    const nr = rowIndex + dr;
    const nc = colIndex + dc;

    return isInBounds(board, nr, nc) && board[nr][nc].isFlagged
      ? count + 1
      : count;
  }, 0);

  if (flaggedNeighbors !== cell.adjacentMines) {
    return "no-match";
  }

  DIRECTIONS.forEach(([dr, dc]) => {
    const nr = rowIndex + dr;
    const nc = colIndex + dc;

    if (!isInBounds(board, nr, nc)) return;

    const neighbor = board[nr][nc];

    if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isQuestioned) {
      floodFill(nr, nc, board);
    }
  });

  const hitByChord = board
    .flat()
    .find((cell) => cell.isRevealed && cell.isMine);
  if (hitByChord) return "hit";

  return "chord";
}

/**
 * Returns the neighboring cells that should appear visually pressed while the
 * player is holding a chord action.
 *
 * The pressed state is shown only when the surrounding flag count already
 * satisfies the selected cell's number.
 */
export function getPressedNeighbors(
  board: Board,
  row: number,
  col: number,
): Set<string> {
  const pressed = new Set<string>();

  let flagCount = 0;

  DIRECTIONS.forEach(([dr, dc]) => {
    const nr = row + dr;
    const nc = col + dc;

    if (!isInBounds(board, nr, nc)) return;

    if (board[nr][nc].isFlagged) {
      flagCount++;
    }
  });

  if (flagCount !== board[row][col].adjacentMines) {
    return pressed;
  }

  DIRECTIONS.forEach(([dr, dc]) => {
    const nr = row + dr;
    const nc = col + dc;

    if (!isInBounds(board, nr, nc)) return;

    const neighbor = board[nr][nc];

    if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isQuestioned) {
      pressed.add(`${nr},${nc}`);
    }
  });

  return pressed;
}

/**
 * Returns the revealed mine that ended the game, or null if no mine has been
 * revealed.
 */
export function findRevealedMine(board: Board) {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length; c++) {
      if (board[r][c].isRevealed && board[r][c].isMine) {
        return { row: r, col: c };
      }
    }
  }

  return null;
}
