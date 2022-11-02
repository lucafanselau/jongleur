import { useContext, useEffect, useMemo, useRef } from "react";
import type { FC, ReactNode } from "react";
import { useStore } from "zustand";
import type { RootState } from "@react-three/fiber";
import { useFrame, useThree } from "@react-three/fiber";
import type { DomEvent } from "@react-three/fiber/dist/declarations/src/core/events";
import { MathUtils } from "three";
import { isNone, isSome } from "../utils";
import type { ScrollStoreContext } from "./context";
import { createScrollStore, scrollContext } from "./context";
import { applyStyle, containerStyle } from "./styles";
import type { FieldsBase, StateBase } from "@/orchestrate";
import type { ClipStore } from "@/store";
import { useProgress } from "@/progress";

const ScrollEvents: FC = () => {
  // mount r3f specific events stuff based on the layout create by scroll pane
  const store = useContext(scrollContext);
  const layout = useStore(store, s => s.layout);

  const {
    get,
    invalidate,
    setEvents,
    size,
    gl: { domElement }
  } = useThree();
  const target = domElement.parentNode;

  useEffect(() => {
    if (isNone(layout)) return;

    const { container } = layout;

    // this part is copied from @react-three/drei ScollControls
    const events = get().events;
    const oldTarget = (events.connected || domElement) as HTMLElement;
    requestAnimationFrame(() => events.connect?.(container));
    const oldCompute = events.compute;
    setEvents({
      compute(event: DomEvent, state: RootState) {
        const offsetX = event.clientX - (target as HTMLElement).offsetLeft;
        const offsetY = event.clientY - (target as HTMLElement).offsetTop;
        state.pointer.set((offsetX / state.size.width) * 2 - 1, -(offsetY / state.size.height) * 2 + 1);
        state.raycaster.setFromCamera(state.pointer, state.camera);
      }
    });
    return () => {
      setEvents({ compute: oldCompute });
      events.connect?.(oldTarget);
    };
  }, [layout, domElement, get, setEvents, target]);

  const clips = useStore(store, s => s.orchestrate);
  const damping = useStore(store, s => s.damping);
  const progress = useProgress(clips);
  const scroll = useRef<number>(0);

  const connected = useThree(s => s.events.connected);

  // the progress
  useEffect(() => {
    if (isNone(layout) || connected !== layout.container) return;
    const containerLength = size.height;
    const scrollLength = layout.container.scrollHeight;
    const scrollThreshold = scrollLength - containerLength;

    const onScroll = () => {
      if (!layout.container) return;
      const current = layout.container.scrollTop;
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

    layout.container.addEventListener("scroll", onScroll);
    // dispatch initial scroll
    requestAnimationFrame(() => onScroll());

    return () => {
      layout.container.removeEventListener("scroll", onScroll);
    };
  }, [layout, size, get, invalidate, progress, damping, connected]);

  useFrame((_, delta) => {
    if (isSome(damping)) {
      // damp the scrolls if that is required
      progress(last => {
        const progress = MathUtils.damp(last, scroll.current, damping, Math.min(delta, 1 / 20));
        if (Math.abs(progress - scroll.current) > 1e-3) invalidate();
        return progress;
      });
    }
  });

  return null;
};

const ScrollPane: FC = () => {
  const store = useContext(scrollContext);
  const length = useStore(store, s => s.orchestrate.getState().length);

  const {
    gl: { domElement }
  } = useThree();

  const target = domElement.parentNode;

  useEffect(() => {
    // create the new element
    const container = document.createElement("div");
    applyStyle({ ...containerStyle }, container);

    // this is the container that will enable the scrolling
    const scrollPane = document.createElement("div");
    applyStyle(
      {
        pointerEvents: "none",
        height: `${100 * (length + 1)}%`,
        width: "100%",
        position: "relative"
      },
      scrollPane
    );

    container.appendChild(scrollPane);
    target?.appendChild(container);

    // update the scroll store
    store.setState({ layout: { container, scrollPane } });

    return () => {
      scrollPane.remove();
      container.remove();
    };
  }, [length, target, store]);

  return null;
};

export const Controls = <Fields extends FieldsBase, Base extends StateBase<Fields>>({
  children,
  orchestrate,
  damping = 2
}: {
  children: ReactNode;
  orchestrate: ClipStore<Fields, Base>;
  damping?: number;
}): ReturnType<FC> => {
  const store = useMemo(() => createScrollStore({ orchestrate }), [orchestrate]);

  useEffect(() => {
    store.setState({ damping });
  }, [damping, store]);

  return (
    <scrollContext.Provider value={store as ScrollStoreContext}>
      <ScrollPane />
      <ScrollEvents />
      {children}
    </scrollContext.Provider>
  );
};
