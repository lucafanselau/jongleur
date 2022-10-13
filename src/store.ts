import create from "zustand";
import produce from "immer";
import type { FieldsBase, StateBase, TargetFromBase } from "./types";

export type Store<Fields extends FieldsBase, Base extends StateBase<Fields>> = {
  slots: { [Obj in keyof Base]?: TargetFromBase<Fields, Base, Obj> };
};

export type Actions<
  Fields extends FieldsBase,
  Base extends StateBase<Fields>
> = {
  setSlot: <Obj extends keyof Base>(
    obj: Obj,
    target: TargetFromBase<Fields, Base, Obj>
  ) => void;
};

export const createStore = <
  Fields extends FieldsBase,
  Base extends StateBase<Fields>
>() =>
  create<Store<Fields, Base> & Actions<Fields, Base>>((set, _get) => ({
    // Initial store content
    slots: {},

    // Action implementations
    setSlot: (obj, target) => {
      set(
        produce((s) => {
          s.slots[obj] = target;
        })
      );
    },
  }));
