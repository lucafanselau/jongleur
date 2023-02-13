import { createContext } from "react";
import { createStore } from "zustand";
import type { Seeker } from "../types";

export type ScrollSettings = {
  damping: number | undefined;
  eps: number;
  pages: number;
  maxSpeed: number;
};

export const defaultScrollSettings: ScrollSettings = {
  damping: 1,
  eps: 1e-4,
  pages: 1,
  maxSpeed: Infinity
};

export type ScrollStore = {
  seeker: Seeker[];
  layout?: {
    container: HTMLDivElement;
    scrollPane: HTMLDivElement;
    stickyPane: HTMLDivElement;
  };
  settings: ScrollSettings;
  context: "r3f" | "scroll" | "fixed";
};

export type ScrollActions = {
  onProgress: (progress: number) => void;
};

// actually this file just exists because of an issue in HMR with vite.js
// for future reference: https://github.com/vitejs/vite/issues/3301
// that requires the context object to be in a different file when using reactRefresh
//
// The context just enables exposing the zustand store of the orchestrate function to a r3f sub tree

export const createScrollStore = (
  initial: Pick<ScrollStore, "layout" | "seeker">,
  context: ScrollStore["context"] = "r3f"
) =>
  createStore<ScrollStore & ScrollActions>((_set, get) => ({
    ...initial,
    context,
    settings: defaultScrollSettings,
    onProgress: p => {
      const { seeker } = get();
      seeker.forEach(seek => {
        if (typeof seek === "function") seek(p);
        else seek.current = p;
      });
    }
  }));

export type ScrollStoreContext = ReturnType<typeof createScrollStore>;

export const scrollContext = createContext<ScrollStoreContext>(null!);
