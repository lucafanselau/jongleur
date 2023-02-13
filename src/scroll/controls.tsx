import type { RootState } from "@react-three/fiber";
import { useFrame, useThree } from "@react-three/fiber";
import type { DomEvent } from "@react-three/fiber/dist/declarations/src/core/events";
import { easing } from "maath";
import type { FC, ReactNode } from "react";
import { useContext, useEffect, useMemo, useRef } from "react";
import { useStore } from "zustand";
import type { Seeker } from "../types";
import { isNone } from "../utils";
import type { ScrollSettings, ScrollStoreContext } from "./context";
import { createScrollStore, defaultScrollSettings, scrollContext } from "./context";
import { applyStyle, containerStyle, scrollStyle, stickyStyle } from "./styles";

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

  const scroll = useRef(0);
  const state = useMemo(
    () => ({
      offset: 0,
      delta: 0
    }),
    []
  );

  const onProgress = useStore(store, s => s.onProgress);
  const settings = useStore(store, s => s.settings);

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
      // kick of at least one frame
      invalidate();
      if (settings.damping === undefined) onProgress(currentProgress);
      else scroll.current = currentProgress;
    };

    layout.container.addEventListener("scroll", onScroll);
    // dispatch initial scroll
    requestAnimationFrame(() => onScroll());

    return () => {
      layout.container.removeEventListener("scroll", onScroll);
    };
  }, [connected, settings.damping, invalidate, layout, onProgress, size.height]);

  let last = 0;
  useFrame((_, delta) => {
    const { damping, eps, maxSpeed } = settings;
    if (damping === undefined) return;
    last = state.offset;
    easing.damp(state, "offset", scroll.current, damping, delta, maxSpeed, undefined, eps);
    easing.damp(state, "delta", Math.abs(last - state.offset), damping, delta, maxSpeed, undefined, eps);
    if (state.delta > eps) onProgress(state.offset);
  });

  return null;
};

const ScrollPane: FC = () => {
  const store = useContext(scrollContext);
  const pages = useStore(store, s => s.settings.pages);

  const {
    gl: { domElement }
  } = useThree();

  const target = domElement.parentNode;

  useEffect(() => {
    if (isNone(pages)) return;
    // create the new element
    const container = document.createElement("div");
    applyStyle(containerStyle, container);

    const stickyPane = document.createElement("div");
    applyStyle(stickyStyle, stickyPane);

    // this is the container that will enable the scrolling
    const scrollPane = document.createElement("div");

    applyStyle(
      {
        ...scrollStyle,
        height: `${100 * pages}%`
      },
      scrollPane
    );

    container.appendChild(stickyPane);
    container.appendChild(scrollPane);
    target?.appendChild(container);

    // update the scroll store
    store.setState({ layout: { container, scrollPane, stickyPane } });

    return () => {
      scrollPane.remove();
      container.remove();
    };
  }, [pages, target, store]);

  return null;
};

export const Controls = ({
  children,
  seeker,
  ...settings
}: {
  children: ReactNode;
  seeker: Seeker | Seeker[];
} & Partial<ScrollSettings>): ReturnType<FC> => {
  const store = useMemo(() => createScrollStore({ seeker: Array.isArray(seeker) ? seeker : [seeker] }), [seeker]);

  useEffect(() => {
    store.setState({ settings: { ...settings, ...defaultScrollSettings } });
  }, [settings, store]);

  return (
    <scrollContext.Provider value={store as ScrollStoreContext}>
      <ScrollPane />
      <ScrollEvents />
      {children}
    </scrollContext.Provider>
  );
};
