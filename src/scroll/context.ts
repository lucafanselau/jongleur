import { createContext } from "react";
import { createStore } from "zustand";
import type { OrchestrateStore } from "../keyframes";
import type { FieldsBase, StateBase } from "../types";

export type ScrollStore<Fields extends FieldsBase, Base extends StateBase<Fields>> = {
  orchestrate: OrchestrateStore<Fields, Base>;
  layout?: {
    container: HTMLDivElement;
    scrollPane: HTMLDivElement;
  };
};

// actually this file just exists because of an issue in HMR with vite.js
// for future reference: https://github.com/vitejs/vite/issues/3301
// that requires the context object to be in a different file when using reactRefresh
//
// The context just enables exposing the zustand store of the orchestrate function to a r3f sub tree

export const createScrollStore = <Fields extends FieldsBase, Base extends StateBase<Fields>>(
  initial: Pick<ScrollStore<Fields, Base>, "orchestrate">
) =>
  createStore<ScrollStore<Fields, Base>>((_set, _get) => ({
    ...initial
  }));

export type ScrollStoreContext = ReturnType<typeof createScrollStore<FieldsBase, StateBase<FieldsBase>>>;

export const scrollContext = createContext<ScrollStoreContext>(null!);
