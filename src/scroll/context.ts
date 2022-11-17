import { createContext } from "react";
import { createStore } from "zustand";
import type { ClipStore } from "../store";
import type { FieldsBase, StateBase } from "../orchestrate";

export type ScrollStore<Fields extends FieldsBase, Base extends StateBase<Fields>> = {
  orchestrate: ClipStore<Fields, Base>;
  layout?: {
    container: HTMLDivElement;
    scrollPane: HTMLDivElement;
    stickyPane: HTMLDivElement;
  };
  context: "r3f" | "scroll" | "fixed";
  damping?: number;
};

// actually this file just exists because of an issue in HMR with vite.js
// for future reference: https://github.com/vitejs/vite/issues/3301
// that requires the context object to be in a different file when using reactRefresh
//
// The context just enables exposing the zustand store of the orchestrate function to a r3f sub tree

export const createScrollStore = <Fields extends FieldsBase, Base extends StateBase<Fields>>(
  initial: Pick<ScrollStore<Fields, Base>, "orchestrate" | "damping" | "layout">,
  context: ScrollStore<Fields, Base>["context"] = "r3f"
) =>
  createStore<ScrollStore<Fields, Base>>((_set, _get) => ({
    ...initial,
    context
  }));

export type ScrollStoreContext = ReturnType<typeof createScrollStore<any, { [K: string]: any }>>;

export const scrollContext = createContext<ScrollStoreContext>(null!);
