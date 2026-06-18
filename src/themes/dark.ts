// ─── Digits ───────────────────────────────────────────────────────────────────

import digit0Dark from "@/assets/dark/digits/digit-0.svg";
import digit1Dark from "@/assets/dark/digits/digit-1.svg";
import digit2Dark from "@/assets/dark/digits/digit-2.svg";
import digit3Dark from "@/assets/dark/digits/digit-3.svg";
import digit4Dark from "@/assets/dark/digits/digit-4.svg";
import digit5Dark from "@/assets/dark/digits/digit-5.svg";
import digit6Dark from "@/assets/dark/digits/digit-6.svg";
import digit7Dark from "@/assets/dark/digits/digit-7.svg";
import digit8Dark from "@/assets/dark/digits/digit-8.svg";
import digit9Dark from "@/assets/dark/digits/digit-9.svg";
import digitMinusDark from "@/assets/dark/digits/digit-minus.svg";
import numsBackgroundDark from "@/assets/dark/digits/nums-background.svg";

// ─── Faces ────────────────────────────────────────────────────────────────────

import faceLoseDark from "@/assets/dark/faces/face-lose.svg";
import facePressedDark from "@/assets/dark/faces/face-pressed.svg";
import faceUnpressedDark from "@/assets/dark/faces/face-unpressed.svg";
import faceWinDark from "@/assets/dark/faces/face-win.svg";

// ─── Tiles ────────────────────────────────────────────────────────────────────

import closedCellDark from "@/assets/dark/tiles/closed.svg";
import emptyCellDark from "@/assets/dark/tiles/empty.svg";
import flagIconDark from "@/assets/dark/tiles/flag.svg";
import explodedMineTileDark from "@/assets/dark/tiles/mine-red.svg";
import mineTileDark from "@/assets/dark/tiles/mine.svg";
import tile1Dark from "@/assets/dark/tiles/tile-1.svg";
import tile2Dark from "@/assets/dark/tiles/tile-2.svg";
import tile3Dark from "@/assets/dark/tiles/tile-3.svg";
import tile4Dark from "@/assets/dark/tiles/tile-4.svg";
import tile5Dark from "@/assets/dark/tiles/tile-5.svg";
import tile6Dark from "@/assets/dark/tiles/tile-6.svg";
import tile7Dark from "@/assets/dark/tiles/tile-7.svg";
import tile8Dark from "@/assets/dark/tiles/tile-8.svg";
import wrongFlagTileDark from "@/assets/dark/tiles/wrong-flag.svg";
import type { ThemeConfig } from "./types";

export const darkTheme: ThemeConfig = {
  // Digits
  numsBackground: numsBackgroundDark,
  digits: {
    "0": digit0Dark,
    "1": digit1Dark,
    "2": digit2Dark,
    "3": digit3Dark,
    "4": digit4Dark,
    "5": digit5Dark,
    "6": digit6Dark,
    "7": digit7Dark,
    "8": digit8Dark,
    "9": digit9Dark,
    "-": digitMinusDark,
  },

  // Faces
  faceUnpressed: faceUnpressedDark,
  facePressed: facePressedDark,
  faceWin: faceWinDark,
  faceLose: faceLoseDark,

  // Tiles
  closedCell: closedCellDark,
  emptyCell: emptyCellDark,
  flagIcon: flagIconDark,
  mineTile: mineTileDark,
  explodedMineTile: explodedMineTileDark,
  wrongFlagTile: wrongFlagTileDark,
  revealedTiles: {
    1: tile1Dark,
    2: tile2Dark,
    3: tile3Dark,
    4: tile4Dark,
    5: tile5Dark,
    6: tile6Dark,
    7: tile7Dark,
    8: tile8Dark,
  },
};
