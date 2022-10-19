import { useThree } from "@react-three/fiber";
import React, { FC, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { Fragment } from "react";
import ReactDOM from "react-dom/client";
import type { HandleProgress } from "../types";

const fullscreenStyle = {
  width: "100%",
  height: "100%",
  top: "0",
  left: "0"
};

const context = React.createContext<{
  fixed: HTMLDivElement;
  filled: HTMLDivElement;
}>(null!);

/**
 * The ScrollOverlay is a scrollable container next to the canvas
 *
 * This implementation is inspired and layout wise copied from @react-three/drei's excellent `ScrollControls`
 */
export const ScrollOverlay: FC<{ children: ReactNode; pages: number; progress: HandleProgress }> = ({
  children,
  pages,
  progress
}) => {
  const {
    setEvents,
    gl: { domElement }
  } = useThree();

  const target = domElement.parentNode;

  const [fixed] = useState(() => document.createElement("div"));
  const [div] = useState(() => document.createElement("div"));
  const [filled] = useState(() => document.createElement("div"));

  useEffect(() => {
    // the setup of divs is based on ScrollControls

    const style = {
      position: "absolute",
      overflow: "auto",
      ...fullscreenStyle
    };

    (Object.keys(style) as (keyof typeof style)[]).forEach(
      key => void (div.style[key as keyof typeof style] = style[key])
    );

    /* const fixedStyle = {
       *   position: "sticky",
       *   overflow: "hidden",
       *   ...fullscreenStyle
       * };

       * (Object.keys(fixedStyle) as (keyof typeof fixedStyle)[]).forEach(
       *   key => void (fixed.style[key as keyof typeof fixedStyle] = fixedStyle[key])
       * ); */

    // this makes the container scroll
    const filledStyle = {
      height: `${100 * pages}%`,
      width: "100%",
      pointerEvents: "none"
    };
    (Object.keys(filledStyle) as (keyof typeof filledStyle)[]).forEach(
      key => void (filled.style[key as keyof typeof filledStyle] = filledStyle[key])
    );

    div.appendChild(filled);
    // div.appendChild(fixed);
    target?.appendChild(div);

    return () => {
      target?.removeChild(div);
    };
  }, [domElement]);

  return <context.Provider value={{ fixed, filled }}>{children}</context.Provider>;
};

export const Scrollable: FC<{ children: ReactNode }> = ({ children }) => {
  const state = useContext(context);

  const root = useMemo(() => ReactDOM.createRoot(state.filled), [state.filled]);

  root.render(<Fragment>{children}</Fragment>);
  return null;
};
