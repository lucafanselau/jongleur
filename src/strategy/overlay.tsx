import type { RootState } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import type { DomEvent } from "@react-three/fiber/dist/declarations/src/core/events";
import type { FC, ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Fragment } from "react";
import ReactDOM from "react-dom/client";
import type { HandleProgress } from "../types";

const fullscreenStyle = {
  width: "100%",
  height: "100%",
  top: "0",
  left: "0"
};

const context = createContext<{
  fixed: HTMLDivElement;
  filled: HTMLDivElement;
}>(null!);

export type ScrollType = FC<{ children: ReactNode; pages: number; progress: HandleProgress }> & {
  Scrolled: FC<{ children: ReactNode; html?: boolean; at?: number }>;
};
/**
 * The ScrollOverlay is a scrollable container next to the canvas
 *
 * Also enables demand based frameloops, through a call to invalidate
 *
 * This implementation is inspired and layout wise copied from @react-three/drei's excellent `ScrollControls`
 */
export const Scroll: ScrollType = ({ children, pages, progress }) => {
  const {
    get,
    invalidate,
    setEvents,
    size,
    events,
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

    // those are things from drei, that seem to make sense

    const oldTarget = (events.connected || domElement) as HTMLElement;
    requestAnimationFrame(() => events.connect?.(div));
    const oldCompute = get().events.compute;
    setEvents({
      compute(event: DomEvent, state: RootState) {
        const offsetX = event.clientX - (target as HTMLElement).offsetLeft;
        const offsetY = event.clientY - (target as HTMLElement).offsetTop;
        state.pointer.set((offsetX / state.size.width) * 2 - 1, -(offsetY / state.size.height) * 2 + 1);
        state.raycaster.setFromCamera(state.pointer, state.camera);
      }
    });

    return () => {
      target?.removeChild(div);
      setEvents({ compute: oldCompute });
      events.connect?.(oldTarget);
    };
  }, [pages, domElement, div, filled, fixed]);

  useEffect(() => {
    if (events.connected === div) {
      const containerLength = size.height;
      const scrollLength = div.scrollHeight;
      const scrollThreshold = scrollLength - containerLength;

      let firstRun = true;

      const onScroll = () => {
        // Prevent first scroll because it is indirectly caused by the one pixel offset
        if (firstRun) return;
        invalidate();
        const current = div.scrollTop;
        const currentProgress = current / scrollThreshold;
        progress(currentProgress);
      };
      div.addEventListener("scroll", onScroll, { passive: true });
      requestAnimationFrame(() => (firstRun = false));

      return () => {
        div.removeEventListener("scroll", onScroll);
      };
    }
  }, [div, events, size, invalidate, progress]);

  return <context.Provider value={{ fixed, filled }}>{children}</context.Provider>;
};

Scroll.Scrolled = ({ children }) => {
  const state = useContext(context);

  const root = useMemo(() => ReactDOM.createRoot(state.filled), [state.filled]);

  root.render(<Fragment>{children}</Fragment>);
  return null;
};
