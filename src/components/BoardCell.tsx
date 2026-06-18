import type { ThemeConfig } from "@/themes/types";
import type { Cell } from "@/types/game";
import React from "react";

interface BoardCellProps {
  row: number;
  col: number;
  cell: Cell;
  isPressed: boolean;
  isClickedMine: boolean;
  isWrongFlag: boolean;
  currentTheme: ThemeConfig;
  handleLeftClick: (row: number, col: number, cell: Cell) => void;
  handleRightClick: (
    e: React.MouseEvent,
    row: number,
    col: number,
    cell: Cell,
  ) => void;
  handleMouseDown: (
    e: React.MouseEvent,
    row: number,
    col: number,
    cell: Cell,
  ) => void;
  clearPressedState: () => void;
}

function BoardCell({
  cell,
  isPressed,
  isClickedMine,
  isWrongFlag,
  currentTheme,
  handleLeftClick,
  handleRightClick,
  handleMouseDown,
  clearPressedState,
  row,
  col,
}: BoardCellProps) {
  function getTileImage() {
    if (isPressed && !cell.isRevealed && !cell.isFlagged)
      return currentTheme.emptyCell;
    if (!cell.isRevealed) return currentTheme.closedCell;
    if (cell.isMine)
      return isClickedMine
        ? currentTheme.explodedMineTile
        : currentTheme.mineTile;
    if (cell.adjacentMines === 0) return currentTheme.emptyCell;
    return currentTheme.revealedTiles[cell.adjacentMines];
  }

  const tileImage = getTileImage();

  return (
    <div
      className="font-minesweeper"
      onClick={() => handleLeftClick(row, col, cell)}
      onContextMenu={(e) => handleRightClick(e, row, col, cell)}
      onMouseDown={(e) => handleMouseDown(e, row, col, cell)}
      onMouseUp={clearPressedState}
      onMouseLeave={clearPressedState}
    >
      <div className="relative size-7 overflow-hidden">
        <img
          src={tileImage}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full pointer-events-none select-none"
        />

        {cell.isFlagged && (
          <img
            src={currentTheme.flagIcon}
            alt=""
            draggable={false}
            className="absolute inset-0 h-full w-full pointer-events-none select-none"
          />
        )}

        {isWrongFlag && (
          <img
            src={currentTheme.wrongFlagTile}
            alt=""
            draggable={false}
            className="absolute inset-0 z-20 h-full w-full pointer-events-none select-none"
          />
        )}

        {!cell.isRevealed && !cell.isFlagged && cell.isQuestioned && (
          <span className="absolute inset-0 z-10 grid place-items-center text-xl font-bold text-foreground pointer-events-none select-none">
            ?
          </span>
        )}
      </div>
    </div>
  );
}

export default BoardCell;
