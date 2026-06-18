import { useEffect, useRef, useState } from "react";
import BoardCell from "./components/BoardCell";
import DigitDisplay from "./components/DigitDisplay";
import GameDropdownMenu from "./components/GameDropdownMenu";
import HelpSheet from "./components/HelpSheet";
import { useTheme } from "./components/theme-provider";
import { LEVEL_CONFIG, MAX_TIMER, type Level } from "./constants/game";
import {
  attemptChord,
  copyBoard,
  createBoard,
  findRevealedMine,
  flagAllMines,
  floodFill,
  getPressedNeighbors,
  revealAllMines,
} from "./lib/board";
import {
  getInitialLevel,
  loadBestTimes,
  saveCurrentLevel,
  updateBestTime,
} from "./lib/storage";
import { cn, formatMineCount, formatTime } from "./lib/utils";
import { themes } from "./themes/themes";
import type { BestTimes, Board, Cell, GameStatus } from "./types/game";
import minesweeperLogo from "/minesweeper-logo.png";

function App() {
  // ─── State ─────────────────────────────────────────────
  const { theme } = useTheme();
  const [level, setLevel] = useState<Level>(() => getInitialLevel());
  const [board, setBoard] = useState<Board>(() => {
    const { rows, columns } = LEVEL_CONFIG[level];
    return createBoard(rows, columns, 0);
  });
  const [status, setStatus] = useState<GameStatus>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [, setBestTimes] = useState<BestTimes>(loadBestTimes);
  const [isFacePressed, setIsFacePressed] = useState<boolean>(false);
  const [pressedCell, setPressedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [pressedNeighbors, setPressedNeighbors] = useState<Set<string>>(
    new Set(),
  );
  const [lostCell, setLostCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [showQuestionMarks, setShowQuestionMarks] = useState<boolean>(true);

  // ─── Derived values ────────────────────────────────────────────

  const { columns, rows, mines } = LEVEL_CONFIG[level];
  // Only flagged cells count toward the mine counter (not question marks).
  const remainingMines =
    mines - board.flat().filter((cell) => cell.isFlagged).length;
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const themeAssets = themes[isDark ? "dark" : "classic"];

  // ─── Refs ─────────────────────────────────────────────

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isFirstRender = useRef(true);
  const elapsedRef = useRef(0);

  // ─── Helper functions ─────────────────────────────────────────────

  function loseGame(currentBoard: Board) {
    const mine = findRevealedMine(currentBoard);

    if (mine) {
      setLostCell(mine);
    }

    setBoard(revealAllMines(currentBoard));
    setStatus("lost");
  }

  function checkWin(b: Board) {
    const totalCells = rows * columns;
    let revealedCount = 0;

    for (const row of b) {
      for (const cell of row) {
        if (cell.isRevealed) revealedCount++;
      }
    }

    if (revealedCount === totalCells - mines) {
      setBoard(flagAllMines(b));
      setStatus("won");
      setBestTimes((prev) => updateBestTime(level, elapsedRef.current, prev));
    }
  }

  function handleNewGame() {
    setBoard(createBoard(rows, columns, 0));
    setStatus("idle");
    setElapsed(0);
    elapsedRef.current = 0;
    setLostCell(null);
  }

  const handleClearPressedState = () => {
    setPressedCell(null);
    setPressedNeighbors(new Set());
  };

  // ─── Event handlers ─────────────────────────────────────────────

  const handleLeftClick = (rowIndex: number, colIndex: number, cell: Cell) => {
    if (status === "won" || status === "lost") return;

    // Flagged cells are protected from left-click.
    // Questioned cells CAN be left-clicked (they're uncertain, not committed).
    if (cell.isFlagged) return;

    let workingBoard: Board;

    // Safe first click: place mines now, excluding clicked cell + neighbors
    if (status === "idle") {
      workingBoard = createBoard(rows, columns, mines, rowIndex, colIndex);
      setStatus("playing");
    } else {
      workingBoard = copyBoard(board);
    }

    // Chording via left-click on a revealed number
    if (cell.isRevealed && cell.adjacentMines > 0) {
      const result = attemptChord(workingBoard, rowIndex, colIndex);
      if (result === "hit") {
        loseGame(workingBoard);
        return;
      }
      if (result === "chord") {
        setBoard(workingBoard);
        checkWin(workingBoard);
      }

      return;
    }

    // Regular click on an unrevealed cell
    if (cell.isRevealed) return;

    // Clear any question mark before revealing.
    if (workingBoard[rowIndex][colIndex].isQuestioned) {
      workingBoard[rowIndex][colIndex] = {
        ...workingBoard[rowIndex][colIndex],
        isQuestioned: false,
      };
    }

    if (workingBoard[rowIndex][colIndex].isMine) {
      setLostCell({ row: rowIndex, col: colIndex });

      workingBoard[rowIndex][colIndex] = {
        ...workingBoard[rowIndex][colIndex],
        isRevealed: true,
      };

      setBoard(revealAllMines(workingBoard));
      setStatus("lost");

      return;
    }

    floodFill(rowIndex, colIndex, workingBoard);
    setBoard(workingBoard);
    checkWin(workingBoard);
  };

  const handleMiddleClick = (
    e: React.MouseEvent,
    rowIndex: number,
    colIndex: number,
  ) => {
    if (e.button !== 1) return; // Middle mouse button

    e.preventDefault(); // Prevent browser auto-scroll.

    if (status !== "playing") return;

    const workingBoard = copyBoard(board);
    const result = attemptChord(workingBoard, rowIndex, colIndex);

    if (result === "hit") {
      loseGame(workingBoard);
      return;
    }

    if (result === "chord") {
      setBoard(workingBoard);
      checkWin(workingBoard);
    }
  };

  /**
   * Handles right-click interactions on unrevealed cells.
   *
   * Depending on the current settings, right-click either toggles between
   * hidden ↔ flagged or cycles through hidden → flagged → questioned → hidden.
   * Input is ignored once the game has ended.
   */
  const handleRightClick = (
    e: React.MouseEvent,
    rowIndex: number,
    colIndex: number,
    cell: Cell,
  ) => {
    e.preventDefault();

    if (status === "won" || status === "lost" || status === "idle") return;

    if (cell.isRevealed) return;

    setBoard((prev) => {
      if (!prev) return prev;

      return prev.map((row, r) =>
        row.map((c, col) => {
          if (r !== rowIndex || col !== colIndex) return c;

          // Classic Windows behavior when question marks are disabled:
          // right-click toggles directly between hidden and flagged.
          if (!showQuestionMarks) {
            if (!c.isFlagged) {
              return { ...c, isFlagged: true, isQuestioned: false };
            }
            return { ...c, isFlagged: false, isQuestioned: false };
          }

          // Standard Minesweeper cycle:
          // hidden → flagged → questioned → hidden.
          if (!c.isFlagged && !c.isQuestioned) {
            return { ...c, isFlagged: true, isQuestioned: false };
          }

          if (c.isFlagged) {
            return { ...c, isFlagged: false, isQuestioned: true };
          }

          return { ...c, isFlagged: false, isQuestioned: false };
        }),
      );
    });
  };

  const handleMouseDown = (
    e: React.MouseEvent,
    rowIndex: number,
    colIndex: number,
    cell: Cell,
  ) => {
    if (status === "lost" || status === "won") return;
    if (e.button === 0) {
      if (!cell.isRevealed && !cell.isFlagged) {
        setPressedCell({
          row: rowIndex,
          col: colIndex,
        });
      } else if (
        cell.isRevealed &&
        cell.adjacentMines > 0 &&
        status === "playing"
      ) {
        setPressedNeighbors(getPressedNeighbors(board, rowIndex, colIndex));
      }
    }

    handleMiddleClick(e, rowIndex, colIndex);
  };

  // ─── Effects ─────────────────────────────────────────────

  /**
   * Starts the game timer while the game is in the "playing" state and stops it
   * when the game ends. Cleanup prevents orphaned intervals during unmounts
   * and state transitions.
   */
  useEffect(() => {
    if (status === "playing") {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          // Match the original game behavior by capping the timer instead of
          // allowing it to overflow indefinitely.
          if (prev >= MAX_TIMER) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            return MAX_TIMER;
          }
          const next = prev + 1;
          elapsedRef.current = next;
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status]);

  /**
   * Persist the selected difficulty so the next session restores it.
   */
  useEffect(() => {
    saveCurrentLevel(level);
  }, [level]);

  /**
   * Changing the difficulty starts a fresh game. The initial render is skipped
   * because the board was already initialized from the saved level.
   */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    handleNewGame();
  }, [level, handleNewGame]);

  /**
   * Register the classic Minesweeper F2 shortcut for starting a new game.
   */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "F2") {
        e.preventDefault();
        handleNewGame();
      }
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNewGame]);

  return (
    <div className="flex min-h-screen flex-col p-6 bg-[#FAF3DD] dark:bg-card text-foreground">
      <div className="space-y-4 flex flex-col items-center">
        <section
          className={cn(
            "drop-shadow-xl rounded-t-md overflow-hidden",
            status === "lost" && "board-shake",
          )}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div
            className="text-white h-8 flex items-center px-1"
            style={{
              background: `linear-gradient(to bottom, #6aaeff 0%, #3f8fff 10%, #1d78fa 32%, #0a67f3 55%, #005be8 78%, #0051d8 100%)`,
              boxShadow: "inset 0 1px 2px rgba(255, 255, 255, 0.12)",
            }}
          >
            <div
              className=" text-sm font-[Tahoma,Verdana,sans-serif] flex items-center gap-1"
              style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.45)" }}
            >
              <img
                src={minesweeperLogo}
                alt="Minesweeper Logo"
                className="size-5 pointer-events-none select-none"
                draggable={false}
              />
              <p className="font-bold">Minesweeper</p>
            </div>
          </div>

          <section className="flex flex-col border-4 border-t-0 border-[#0051d8]">
            {/* Game Menu */}
            <div className="text-sm flex items-center gap-3 p-1.5 bg-muted">
              <GameDropdownMenu
                handleNewGame={handleNewGame}
                level={level}
                setLevel={setLevel}
                setShowQuestionMarks={setShowQuestionMarks}
                showQuestionMarks={showQuestionMarks}
              />
              <HelpSheet />
            </div>

            <section className="bg-window-frame p-2.5 window-outset">
              {/* Game Header */}
              <section className="flex flex-1 justify-between bg-[#c0c0c0] dark:bg-[#444c54] items-center py-1.5 window-inset">
                {/* Mine count */}
                <DigitDisplay value={formatMineCount(remainingMines)} />

                {/* Smiley button */}
                <button
                  className="size-10"
                  onMouseDown={() => {
                    setIsFacePressed(true);
                  }}
                  onMouseUp={() => setIsFacePressed(false)}
                  onMouseLeave={() => setIsFacePressed(false)}
                  onClick={handleNewGame}
                  aria-label="New game"
                >
                  <img
                    src={
                      isFacePressed
                        ? themeAssets.facePressed
                        : status === "lost"
                          ? themeAssets.faceLose
                          : status === "won"
                            ? themeAssets.faceWin
                            : themeAssets.faceUnpressed
                    }
                    alt=""
                    className="w-full h-full select-none pointer-events-none"
                    draggable={false}
                  />
                </button>
                {/* Timer*/}
                <DigitDisplay value={formatTime(elapsed)} />
              </section>

              {/* Main Board */}
              <section>
                <div className="h-2.5" />
                <div className={`flex flex-col shadow-md w-max window-inset`}>
                  {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex">
                      {row.map((cell, colIndex) => (
                        <BoardCell
                          key={colIndex}
                          row={rowIndex}
                          col={colIndex}
                          cell={cell}
                          isPressed={
                            (pressedCell?.row === rowIndex &&
                              pressedCell?.col === colIndex) ||
                            pressedNeighbors.has(`${rowIndex},${colIndex}`)
                          }
                          isClickedMine={
                            cell.isMine &&
                            lostCell?.row === rowIndex &&
                            lostCell?.col === colIndex
                          }
                          isWrongFlag={
                            status === "lost" && cell.isFlagged && !cell.isMine
                          }
                          currentTheme={themeAssets}
                          handleLeftClick={handleLeftClick}
                          handleRightClick={handleRightClick}
                          handleMouseDown={handleMouseDown}
                          clearPressedState={handleClearPressedState}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </section>
            </section>
          </section>
        </section>
      </div>
    </div>
  );
}

export default App;
