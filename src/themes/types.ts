export type Themes = "classic" | "dark";

export interface ThemeConfig {
  // Digits
  numsBackground: string;
  digits: Record<string, string>;

  // Faces
  faceUnpressed: string;
  facePressed: string;
  faceWin: string;
  faceLose: string;

  // Tiles
  closedCell: string;
  emptyCell: string;
  flagIcon: string;
  mineTile: string;
  explodedMineTile: string;
  wrongFlagTile: string;
  revealedTiles: Record<number, string>;
}
