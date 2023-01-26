import type { Draft } from "immer";
import { produce } from "immer";
import type { StoreApi, UseBoundStore } from "zustand";
import { create } from "zustand";
import { isNone, isSome } from "./utils";
import type { FieldsBase, Keyframes, StateBase, TargetFromBase } from "./orchestrate";

export type Store<Fields extends FieldsBase, Base extends StateBase<Fields>> = {
  slots: { [Obj in keyof Base]?: { [id: string]: TargetFromBase<Fields, Base, Obj> } };

  // The active implementation of fields
  fields: Fields;

  // the user supplied stuff, most notably the clips
  objects: (keyof Base)[];
  keyframes: Keyframes<Fields, Base>;
  base: Base;
  state: { [Obj in keyof Base]: { [Field in keyof Base[Obj]]: { store?: Field } } };
  length: number;

  last: number;
};

export type Actions<Fields extends FieldsBase, Base extends StateBase<Fields>> = {
  setSlot: <Obj extends keyof Base>(obj: Obj, target: TargetFromBase<Fields, Base, Obj> | null, id: string) => void;
  setLastState: <Obj extends keyof Base, Field extends keyof Base[Obj]>(
    obj: Obj,
    field: Field,
    cb: (store: Draft<{ store: Base[Obj][Field] }>) => void
  ) => void;
  setLastProgress: (progress: number) => void;
};

export type ClipStore<Fields extends FieldsBase, Base extends StateBase<Fields>> = UseBoundStore<
  StoreApi<Store<Fields, Base> & Actions<Fields, Base>>
>;

export const createClipStore = <Fields extends FieldsBase, Base extends StateBase<Fields>>(
  initial: Omit<Store<Fields, Base>, "slots" | "last">
): ClipStore<Fields, Base> =>
  create<Store<Fields, Base> & Actions<Fields, Base>>()((set, _get) => ({
    // Initial store content
    ...initial,
    slots: {},
    last: 0,

    // Action implementations
    setSlot: <Obj extends keyof Base>(obj: Obj, target: TargetFromBase<Fields, Base, Obj> | null, id: string) => {
      set(state => {
        return produce(state, s => {
          type Slots = (typeof s)["slots"];
          // The weird casting here is not my fault, this is a problem with 'Draft<T>[keyof T]' indexing in "immer".
          // They dont seem to give a friendly f*** about the error though (https://github.com/immerjs/immer/issues/918). I must admit though
          // that this is a pretty niece use case
          if (isNone(s.slots[<keyof Slots>obj])) s.slots[<keyof Slots>obj] = {} as Slots[keyof Slots];
          const objSlot = s.slots[<keyof Slots>obj] as { [id: string]: TargetFromBase<Fields, Base, Obj> };
          if (isSome(target)) objSlot[id] = target;
          else delete objSlot[id];
        });
      });
    },
    setLastState: (obj, field, cb) => {
      set(state =>
        produce(state, s => {
          // @ts-ignore It's the same thing as above with indexing immer's Draft but now two levels deep
          cb(s.state[obj][field]);
        })
      );
    },
    setLastProgress: progress => set({ last: progress })
  }));

export type GetStateBase<Store> = Store extends ClipStore<any, infer Base> ? Base : unknown;
export type GetFields<Store> = Store extends ClipStore<infer Fields, any> ? Fields : unknown;
