import { useContext, useEffect, useMemo } from "react";
import type { FC, ReactNode } from "react";
import { useStore } from "zustand";
import { useThree } from "@react-three/fiber";
import type { OrchestrateStore } from "../keyframes";
import type { FieldsBase, StateBase } from "../types";
import type { ScrollStoreContext } from "./context";
import { createScrollStore, scrollContext } from "./context";
import { applyStyle, containerStyle } from "./styles";

const ScrollPane: FC = () => {
  const store = useContext(scrollContext);
  const length = useStore(store, s => s.orchestrate.getState().length);

  const {
    /* get,
     * invalidate,
     * setEvents,
     * size,
     * events, */
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
  orchestrate
}: {
  children: ReactNode;
  orchestrate: OrchestrateStore<Fields, Base>;
}): ReturnType<FC> => {
  const store = useMemo(() => createScrollStore({ orchestrate }), [orchestrate]);

  return (
    <scrollContext.Provider value={store as ScrollStoreContext}>
      <ScrollPane />
      {children}
    </scrollContext.Provider>
  );
};
