import { MathUtils } from "three";
import { RootState, useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import type { DomEvent } from "@react-three/fiber/dist/declarations/src/core/events";
import { FC, ReactNode, useRef } from "react";
import { Fragment, createContext, useContext, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import type { HandleProgress } from "../types";
import { isNone, isSome } from "../utils";

const fullscreenStyle = {
  width: "100%",
  height: "100%",
  top: "0",
  left: "0"
};

const context = createContext<{
  fixed: HTMLDivElement;
  filled: HTMLDivElement;
  root: ReactDOM.Root;
}>(null!);

export type ScrollType = FC<{
  children: ReactNode;
  pages: number;
  progress: HandleProgress;
  /**
   * Controls the damping applied to the scroll progress
   * no damping := undefined and as a rule-of-thumb: very-smooth: <1; kinda-smooth: 1-2; 2-∞: above that
      f
   */
  damping?: number;
}> & {
  Scrolled: FC<{ children: ReactNode; html?: boolean; at?: number }>;
  Snaps: FC<{ points: number[] }>;
};
/**
 * The ScrollOverlay is a scrollable container next to the canvas
 *
 * Also enables demand based frameloops, since orchestrate handles calling invalidate()
 *
 * This implementation is inspired and also _shamelessly_ part wise copied from @react-three/drei's excellent `ScrollControls`
 */
export const Scroll: ScrollType = ({ children, pages, progress, damping = 2 }) => {
  const {
    get,
    invalidate,
    setEvents,
    size,
    events,
    performance,
    gl: { domElement }
  } = useThree();

  const target = domElement.parentNode;
  const a = 0;

  const [fixed] = useState(() => document.createElement("div"));
  const [div] = useState(() => document.createElement("div"));
  const [filled] = useState(() => document.createElement("div"));

  const scroll = useRef(0);

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

      const onScroll = () => {
        const current = div.scrollTop;
        const currentProgress = current / scrollThreshold;

        // if damping, don't handle progress immediately
        if (isSome(damping)) {
          // here we have to invalidate at least once, to trigger the useFrame function
          invalidate();
          scroll.current = currentProgress;
        } else {
          progress(() => currentProgress);
        }
      };

      div.addEventListener("scroll", onScroll);
      // dispatch initial scroll
      requestAnimationFrame(() => onScroll());

      return () => {
        div.removeEventListener("scroll", onScroll);
      };
    }
  }, [div, events, size, invalidate, progress]);

  const root = useMemo(() => ReactDOM.createRoot(filled), [filled]);

  useFrame((_, delta) => {
    if (isSome(damping)) {
      // damp the scrolls if that is required
      progress(last => {
        const progress = MathUtils.damp(last, scroll.current, damping, Math.min(delta, 1 / 20));
        if (Math.abs(progress - scroll.current) > 5e-4) invalidate();
        return progress;
      });
    }
  });

  return <context.Provider value={{ root, fixed, filled }}>{children}</context.Provider>;
};

Scroll.Scrolled = ({ children }) => {
  const state = useContext(context);

  if (isSome(state) && isSome(state.root)) state.root.render(<Fragment>{children}</Fragment>);
  return null;
};
