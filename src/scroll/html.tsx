import { createRoot } from "react-dom/client";
import type { FC, ReactNode } from "react";
import { useContext, useLayoutEffect, useMemo, useState } from "react";
import { useStore } from "zustand";
import { isNone } from "../utils";
import { scrollContext } from "./context";
import { applyStyle, fullscreenStyle } from "./styles";

const createEl = () => {
  const el = document.createElement("div");
  applyStyle({ ...fullscreenStyle, position: "absolute" }, el);
  return el;
};

/**
 * Mounts the children under a new React root (via the root api)
 *
 * Can either be on a fixed screen (todo) or on the whole pane
 **/
export const Html: FC<{ children: ReactNode }> = ({ children }) => {
  const store = useContext(scrollContext);
  const layout = useStore(store, s => s.layout);

  const [el] = useState(() => createEl());

  const root = useMemo(() => createRoot(el), [el]);

  useLayoutEffect(() => {
    if (isNone(layout)) return;
    const parent = layout.scrollPane;
    parent.appendChild(el);
    return () => void parent.removeChild(el);
  }, [el, layout]);

  // forward the scrollContext
  root.render(<scrollContext.Provider value={store}>{children}</scrollContext.Provider>);
  return null;
};

type Align = "center" | "start" | "end";
const alignToPercent = (a: Align) => {
  if (a === "start") return "0%";
  else if (a === "center") return "50%";
  else if (a === "end") return "100%";
  else return undefined;
};

type AtProps = {
  at: number;
  children: ReactNode;
  /**
   * The position orthogonal to the scrolling direction used to determine the absolute position on the scroll plane
   * "start", "center", "end" are aliases for 0%, 50% and 100% respectively
   * Other string values are supplied to the CSS `left`/`top` directly, depending on the scroll direction
   */
  align?: Align | string;
  /**
   * Controls the positioning of the actual element, trough transform translate on the created `div` element
   * The first alignment is in the scroll direction (for normal scrolling, this is the y-axis alignment)
   * Second alignment controls the alignment orthogonal to the scroll axis
   */
  placement?: [Align, Align];
};

export const At: FC<AtProps> = ({ at, children, align = "center", placement = ["center", "center"] }) => {
  const store = useContext(scrollContext);

  const clips = useStore(store, s => s.orchestrate);
  const length = useStore(clips, s => s.length);
  const top = at / (length + 1);

  const left = useMemo(() => alignToPercent(align as Align) ?? align, [align]);

  const transform = useMemo(() => {
    const transforms = [];
    // on the axis
    const [first, second] = placement;
    transforms.push(`translateY(-${alignToPercent(first)})`);
    transforms.push(`translateX(-${alignToPercent(second)})`);
    return transforms.join(" ");
  }, [placement]);

  return (
    <div
      style={{
        pointerEvents: "auto",
        position: "absolute",
        left,
        top: `${top * 100}%`,
        transform
      }}
    >
      {children}
    </div>
  );
};
