import { useMediaQuery } from "react-responsive";
import defaultTheme from "tailwindcss/defaultTheme";
// import config from "../../../tailwind.config.cjs"; // Your tailwind config
// import resolveConfig from "tailwindcss/resolveConfig";

const breakpoints = defaultTheme.screens;

type BreakpointKey = keyof typeof breakpoints;

export function useBreakpoint<K extends BreakpointKey>(breakpointKey: K) {
  const bool = useMediaQuery({
    query: `(min-width: ${breakpoints[breakpointKey]})`,
  });
  return bool;
}
