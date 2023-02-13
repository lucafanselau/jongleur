import type { FC, ReactNode } from "react";
import { useContext, useLayoutEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { useStore } from "zustand";
import { isNone } from "../utils";
import { createScrollStore, scrollContext } from "./context";
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
export const Html: FC<{ children: ReactNode; fixed?: boolean }> = ({ children, fixed = false }) => {
  const store = useContext(scrollContext);
  const derived = useStore(store, s => createScrollStore(s, fixed ? "fixed" : "scroll"));
  const layout = useStore(store, s => s.layout);

  const [el] = useState(() => createEl());

  const root = useMemo(() => createRoot(el), [el]);

  useLayoutEffect(() => {
    if (isNone(layout)) return;
    const parent = fixed ? layout.stickyPane : layout.scrollPane;
    parent.appendChild(el);
    return () => void parent.removeChild(el);
  }, [el, layout, fixed]);

  // forward the scrollContext
  root.render(<scrollContext.Provider value={derived}>{children}</scrollContext.Provider>);
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

  container?: JSX.IntrinsicElements["div"];
};

export const At: FC<AtProps> = ({
  at,
  children,
  align = "center",
  placement = ["center", "center"],
  container = {}
}) => {
  const store = useContext(scrollContext);

  const context = useStore(store, s => s.context);

  if (context === "r3f") {
    throw new Error(
      "[jongleur] Cannot use `Scroll.At` Utility inside of a r3f context. Please wrap component inside of a Scroll.Html pane"
    );
  }

  const length = useStore(store, s => s.settings.pages);
  // This calculation is based on the layout from ./controls.tsx
  const top = context === "fixed" ? at : (at - 1) / length;

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
      {...container}
      style={{
        ...container.style,
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
