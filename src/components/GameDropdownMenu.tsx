import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LEVELS, type Level } from "@/constants/game";
import { useTheme } from "./theme-provider";

type GameDropdownMenuProps = {
  level: Level;
  setLevel: (level: Level) => void;
  showQuestionMarks: boolean;
  setShowQuestionMarks: (checked: boolean) => void;
  handleNewGame: () => void;
};

function GameDropdownMenu({
  handleNewGame,
  level,
  setLevel,
  showQuestionMarks,
  setShowQuestionMarks,
}: GameDropdownMenuProps) {
  const { setTheme, theme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Game</DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={7}>
        <DropdownMenuItem onClick={handleNewGame}>
          New
          <DropdownMenuShortcut>F2</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={level} onValueChange={setLevel}>
          {LEVELS.map((lvl) => (
            <DropdownMenuRadioItem className={"capitalize"} value={lvl}>
              {lvl}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuCheckboxItem
            checked={showQuestionMarks}
            onCheckedChange={setShowQuestionMarks}
          >
            Marks (?)
          </DropdownMenuCheckboxItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem value="light">
                    Classic
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    Dark
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Best Times...</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default GameDropdownMenu;
