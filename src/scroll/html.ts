import { createRoot } from "react-dom/client";
import type { FC, ReactNode } from "react";
import { useContext, useLayoutEffect, useMemo, useState } from "react";
import { useStore } from "zustand";
import { isNone } from "../utils";
import { scrollContext } from "./context";
import { applyStyle, fullscreenStyle } from "./styles";

const createEl = () => {
  const el = document.createElement("div");
  applyStyle(fullscreenStyle, el);
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
    layout.scrollPane.appendChild(el);
    return () => void layout.scrollPane.removeChild(el);
  }, [el, layout]);

  root.render(children);
  return null;
};
