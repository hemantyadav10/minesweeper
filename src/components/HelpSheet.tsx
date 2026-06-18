import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function HelpSheet() {
  return (
    <Sheet >
      <SheetTrigger>Help</SheetTrigger>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>How to Play Minesweeper</SheetTitle>
        </SheetHeader>

        <div className="space-y-5 text-sm px-4">
          <section className="space-y-1">
            <h3 className="font-semibold">Objective</h3>
            <p className="text-muted-foreground">
              Reveal every safe cell on the board without clicking a mine. You
              win as soon as all safe cells are uncovered — flagging every mine
              is not required.
            </p>
          </section>

          <section className="space-y-1">
            <h3 className="font-semibold">Controls</h3>
            <ul className="text-muted-foreground space-y-1">
              <li>
                <span className="text-foreground font-medium">Left click</span>{" "}
                — reveal a cell
              </li>
              <li>
                <span className="text-foreground font-medium">Right click</span>{" "}
                — cycle: flag 🚩 → question mark ❓ → clear
              </li>
              <li>
                <span className="text-foreground font-medium">
                  Middle click
                </span>{" "}
                — chord (see below)
              </li>
              <li>
                <span className="text-foreground font-medium">F2</span> — new
                game
              </li>
              <li>
                <span className="text-foreground font-medium">
                  Smiley button
                </span>{" "}
                — new game
              </li>
            </ul>
          </section>

          <section className="space-y-1">
            <h3 className="font-semibold">Numbers</h3>
            <p className="text-muted-foreground">
              Each revealed number shows exactly how many mines are hidden among
              its up to 8 neighboring cells — horizontal, vertical, and
              diagonal. Use these clues to deduce which cells are safe.
            </p>
          </section>

          <section className="space-y-1">
            <h3 className="font-semibold">First Click</h3>
            <p className="text-muted-foreground">
              Your first click is always safe. Mines are placed after your first
              click, guaranteeing the clicked cell and all its neighbors are
              mine-free — so your first move always opens a blank area.
            </p>
          </section>

          <section className="space-y-1">
            <h3 className="font-semibold">Chording</h3>
            <p className="text-muted-foreground">
              If a revealed number already has the correct number of flags
              around it, left-clicking or middle-clicking that number
              automatically reveals all remaining unflagged neighbors. Be
              careful — if a flag is misplaced, chording will detonate a mine.
            </p>
          </section>

          <section className="space-y-1">
            <h3 className="font-semibold">Mine Counter & Timer</h3>
            <p className="text-muted-foreground">
              The left display shows remaining mines (total mines minus flags
              placed). It can go negative if you over-flag. The right display
              shows elapsed time in seconds, starting on your first click and
              capping at 999.
            </p>
          </section>

          <section className="space-y-1">
            <h3 className="font-semibold">Difficulty Levels</h3>
            <ul className="text-muted-foreground space-y-1">
              <li>
                <span className="text-foreground font-medium">Beginner</span> —
                9×9, 10 mines
              </li>
              <li>
                <span className="text-foreground font-medium">
                  Intermediate
                </span>{" "}
                — 16×16, 40 mines
              </li>
              <li>
                <span className="text-foreground font-medium">Expert</span> —
                30×16, 99 mines
              </li>
            </ul>
          </section>
        </div>
        <SheetFooter />
      </SheetContent>
    </Sheet>
  );
}
