import { Draft } from "immer";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import type { FieldsBase, StateBase, TargetFromBase } from "./types";
import { isNone, isSome } from "./utilities";

export type Store<Fields extends FieldsBase, Base extends StateBase<Fields>> = {
  slots: { [Obj in keyof Base]?: { [id: string]: TargetFromBase<Fields, Base, Obj> } };
};

export type Actions<Fields extends FieldsBase, Base extends StateBase<Fields>> = {
  setSlot: <Obj extends keyof Base>(obj: Obj, target: TargetFromBase<Fields, Base, Obj> | null, id: string) => void;
};

export const createStore = <Fields extends FieldsBase, Base extends StateBase<Fields>>() =>
  create<Store<Fields, Base> & Actions<Fields, Base>>()(
    immer((set, _get) => ({
      // Initial store content
      slots: {},

      // Action implementations
      setSlot: <Obj extends keyof Base>(obj: Obj, target: TargetFromBase<Fields, Base, Obj> | null, id: string) => {
        set(s => {
          type Slots = Draft<Store<Fields, Base>["slots"]>;
          // The weird casting here is not my fault, this is a problem with 'Draft<T>[keyof T]' indexing in "immer".
          // They dont seem to give a friendly f*** about the error though (https://github.com/immerjs/immer/issues/918). I must admit though
          // that this is a pretty niece use case
          if (isNone(s.slots[<keyof Slots>obj])) s.slots[<keyof Slots>obj] = {} as Slots[keyof Slots];
          const objSlot = s.slots[<keyof Slots>obj] as { [id: string]: TargetFromBase<Fields, Base, Obj> };
          if (isSome(target)) objSlot[id] = target;
          else delete objSlot[id];
        });
      }
    }))
  );
