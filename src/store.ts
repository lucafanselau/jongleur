import type { Draft } from "immer";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import type { FieldsBase, Keyframes, StateBase, TargetFromBase } from "./types";
import { isNone, isSome } from "./utils";

export type Store<Fields extends FieldsBase, Base extends StateBase<Fields>> = {
  slots: { [Obj in keyof Base]?: { [id: string]: TargetFromBase<Fields, Base, Obj> } };

  // The active implementation of fields
  fields: Fields;
  objects: (keyof Base)[];
  keyframes: Keyframes<Fields, Base>;
  length: number;

  progress: {
    lastProgress?: number;
  };
};

export type Actions<Fields extends FieldsBase, Base extends StateBase<Fields>> = {
  setSlot: <Obj extends keyof Base>(obj: Obj, target: TargetFromBase<Fields, Base, Obj> | null, id: string) => void;

  handleProgress: (progress: number) => void;
};

export const createStore = <Fields extends FieldsBase, Base extends StateBase<Fields>>(
  initial: Omit<Store<Fields, Base>, "slots" | "progress">
) =>
  create<Store<Fields, Base> & Actions<Fields, Base>>()(
    immer((set, get) => ({
      // Initial store content
      slots: {},
      progress: {},
      ...initial,

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
      },
      handleProgress: progress => {
        // get the previous progress
        const {
          progress: { lastProgress }
        } = get();

        // and apply the active clips

        // at the end prepare the state for the next update
        set(s => (s.progress.lastProgress = progress));
      }
    }))
  );
