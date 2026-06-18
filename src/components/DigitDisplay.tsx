import { themes } from "@/themes/themes";
import { useTheme } from "./theme-provider";

export default function DigitDisplay({ value }: { value: string }) {
  const DISPLAY_WIDTH = 78;
  const DISPLAY_HEIGHT = 40;

  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const currentTheme = themes[isDark ? "dark" : "classic"];

  return (
    <div
      className="relative flex"
      style={{ width: `${DISPLAY_WIDTH}px`, height: `${DISPLAY_HEIGHT}px` }}
    >
      <img
        src={currentTheme.numsBackground}
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        draggable={false}
      />

      <div className="relative flex w-full h-full items-center py-[3.5px] px-2">
        {value.split("").map((ch, i) => (
          <img
            key={i}
            src={currentTheme.digits[ch]}
            alt={ch}
            style={{ width: "100%", height: "100%" }}
            className="pointer-events-none select-none"
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
}
