import type { RootState as ThreeState } from "@react-three/fiber";
import create from "zustand";
import type { Refs, ValidScene } from "./types";

export type KeyframeStore<Scene extends ValidScene> = {
  getThree?: () => ThreeState;
  container?: HTMLElement;

  objects: Refs<Scene>;

  constants: {
    canvasHeight: number;
    sectionHeight: number;
  };
};

export const createKeyframeStore = <Scene extends ValidScene>(
  canvasHeight: number,
  sectionHeight: number,
) =>
  create<KeyframeStore<Scene>>((_set, _get) => ({
    objects: {},
    constants: {
      canvasHeight,
      sectionHeight,
    },
  }));

export type KeyframeStoreApi<T extends ValidScene> = ReturnType<
  typeof createKeyframeStore<T>
>;

// NOTE: Ideally we would want to have the state with a provider but this api does currently not work
// with the react-three/fibers render loop (which makes sense)..
// export const {
//   Provider: KeyframesProvider,
//   useStore: useKeyframeStore,
//   useStoreApi: useKeyframeStoreApi
// } = createContext<KeyframeStore<ValidScene>>();
