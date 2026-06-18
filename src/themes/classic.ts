// ─── Digits ───────────────────────────────────────────────────────────────────

import digit0 from "@/assets/classic/digits/digit-0.svg";
import digit1 from "@/assets/classic/digits/digit-1.svg";
import digit2 from "@/assets/classic/digits/digit-2.svg";
import digit3 from "@/assets/classic/digits/digit-3.svg";
import digit4 from "@/assets/classic/digits/digit-4.svg";
import digit5 from "@/assets/classic/digits/digit-5.svg";
import digit6 from "@/assets/classic/digits/digit-6.svg";
import digit7 from "@/assets/classic/digits/digit-7.svg";
import digit8 from "@/assets/classic/digits/digit-8.svg";
import digit9 from "@/assets/classic/digits/digit-9.svg";
import digitMinus from "@/assets/classic/digits/digit-minus.svg";
import numsBackground from "@/assets/classic/digits/nums-background.svg";

// ─── Faces ────────────────────────────────────────────────────────────────────

import faceLose from "@/assets/classic/faces/face-lose.svg";
import facePressed from "@/assets/classic/faces/face-pressed.svg";
import faceUnpressed from "@/assets/classic/faces/face-unpressed.svg";
import faceWin from "@/assets/classic/faces/face-win.svg";

// ─── Tiles ────────────────────────────────────────────────────────────────────

import closedCell from "@/assets/classic/tiles/closed.svg";
import emptyCell from "@/assets/classic/tiles/empty.svg";
import flagIcon from "@/assets/classic/tiles/flag.svg";
import explodedMineTile from "@/assets/classic/tiles/mine-red.svg";
import mineTile from "@/assets/classic/tiles/mine.svg";
import tile1 from "@/assets/classic/tiles/tile-1.svg";
import tile2 from "@/assets/classic/tiles/tile-2.svg";
import tile3 from "@/assets/classic/tiles/tile-3.svg";
import tile4 from "@/assets/classic/tiles/tile-4.svg";
import tile5 from "@/assets/classic/tiles/tile-5.svg";
import tile6 from "@/assets/classic/tiles/tile-6.svg";
import tile7 from "@/assets/classic/tiles/tile-7.svg";
import tile8 from "@/assets/classic/tiles/tile-8.svg";
import wrongFlagTile from "@/assets/classic/tiles/wrong-flag.svg";
import type { ThemeConfig } from "./types";

export const classicTheme: ThemeConfig = {
  // Digits
  numsBackground,
  digits: {
    "0": digit0,
    "1": digit1,
    "2": digit2,
    "3": digit3,
    "4": digit4,
    "5": digit5,
    "6": digit6,
    "7": digit7,
    "8": digit8,
    "9": digit9,
    "-": digitMinus,
  },

  // Faces
  faceUnpressed,
  facePressed,
  faceWin,
  faceLose,

  // Tiles
  closedCell,
  emptyCell,
  flagIcon,
  mineTile,
  explodedMineTile,
  wrongFlagTile,
  revealedTiles: {
    1: tile1,
    2: tile2,
    3: tile3,
    4: tile4,
    5: tile5,
    6: tile6,
    7: tile7,
    8: tile8,
  },
};
