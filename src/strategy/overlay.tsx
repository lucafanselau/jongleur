import { MathUtils } from "three";
import { RootState, useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import type { DomEvent } from "@react-three/fiber/dist/declarations/src/core/events";
import { FC, MutableRefObject, ReactNode, useRef } from "react";
import { Fragment, createContext, useContext, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import type { HandleProgress } from "../types";
import { isNone, isSome } from "../utils";
import { createPortal } from "react-dom";

const fullscreenStyle = {
  width: "100%",
  height: "100%",
  top: "0",
  left: "0"
};

const context = createContext<{
  div: HTMLDivElement;
  root: ReactDOM.Root;
  ref: MutableRefObject<HTMLDivElement>;
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
    gl: { domElement }
  } = useThree();

  const target = domElement.parentNode;

  const [div, setDiv] = useState<HTMLDivElement>();
  const [root, setRoot] = useState<ReactDOM.Root>();
  const ref = useRef<HTMLDivElement>(null!);

  const scroll = useRef(0);

  useMemo(() => {
    // the setup of divs is based on ScrollControls

    const style = {
      position: "absolute",
      overflowY: "auto",
      ...fullscreenStyle
    };

    const div = document.createElement("div");

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
    /* const filledStyle = {
     *   height: `${100 * pages}%`,
     *   width: "100%",
     *   pointerEvents: "none"
     * };
     * (Object.keys(filledStyle) as (keyof typeof filledStyle)[]).forEach(
     *   key => void (filled.style[key as keyof typeof filledStyle] = filledStyle[key])
     * ); */

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

    const root = ReactDOM.createRoot(div);
    root?.render(<div ref={ref}>Hello world</div>);
    setDiv(div);
    setRoot(root);

    return () => {
      target?.removeChild(div);
      setEvents({ compute: oldCompute });
      events.connect?.(oldTarget);
      root.unmount();
    };
  }, [pages, domElement]);

  useEffect(() => {
    if (div && events.connected === div) {
      const containerLength = size.height;
      const scrollLength = div.scrollHeight;
      const scrollThreshold = scrollLength - containerLength;

      const onScroll = () => {
        if (!div) return;
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

  return <context.Provider value={{ div, root, ref }}>{children}</context.Provider>;
};

Scroll.Scrolled = ({ children }) => {
  const state = useContext(context);

  // if (isSome(state) && isSome(state.root)) state.root.render(<Fragment>{children}</Fragment>);
  return null;
};

Scroll.Snaps = ({ points }) => {
  const state = useContext(context);

  if (isSome(state?.ref.current)) {
    createPortal(
      <Fragment>
        {points.map(v => (
          <div key={v} style={{ position: "absolute", top: `${v * 100}%`, left: 0, scrollSnapAlign: "center" }}>
            {v}
          </div>
        ))}
      </Fragment>,
      state.ref.current
    );
  }
  return null;
};
