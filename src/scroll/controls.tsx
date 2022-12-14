import { useContext, useEffect, useMemo } from "react";
import type { FC, ReactNode } from "react";
import { useStore } from "zustand";
import type { RootState } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import type { DomEvent } from "@react-three/fiber/dist/declarations/src/core/events";
import { isNone } from "../utils";
import type { FieldsBase, StateBase } from "../orchestrate";
import type { ClipStore } from "../store";
import { useProgress } from "../progress";
import type { ScrollStoreContext } from "./context";
import { createScrollStore, scrollContext } from "./context";
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

  const clips = useStore(store, s => s.clips);
  const damping = useStore(store, s => s.settings?.damping);
  const progress = useProgress(clips, damping);

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
      progress(currentProgress);
    };

    layout.container.addEventListener("scroll", onScroll);
    // dispatch initial scroll
    requestAnimationFrame(() => onScroll());

    return () => {
      layout.container.removeEventListener("scroll", onScroll);
    };
  }, [layout, size, get, invalidate, progress, connected]);

  return null;
};

const ScrollPane: FC = () => {
  const store = useContext(scrollContext);
  const clips = useStore(store, s => s.clips);
  const scale = useStore(store, s => s.settings?.scale);
  const length = useStore(clips, c => c.length);

  const {
    gl: { domElement }
  } = useThree();

  const target = domElement.parentNode;

  useEffect(() => {
    if (isNone(scale) || isNone(length)) return;
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
        height: `${100 * length}%`
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
  }, [length, target, store, scale]);

  return null;
};

export const Controls = <Fields extends FieldsBase, Base extends StateBase<Fields>>({
  children,
  clips,
  damping = 2,
  scale = 1
}: {
  children: ReactNode;
  clips: ClipStore<Fields, Base>;
  damping?: number;
  scale?: number;
}): ReturnType<FC> => {
  const store = useMemo(() => createScrollStore({ clips, settings: {} }), [clips]);

  useEffect(() => {
    store.setState({ settings: { damping, scale } });
  }, [damping, scale, store]);

  return (
    <scrollContext.Provider value={store as ScrollStoreContext}>
      <ScrollPane />
      <ScrollEvents />
      {children}
    </scrollContext.Provider>
  );
};
