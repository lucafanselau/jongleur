import { invalidate } from "@react-three/fiber";
import type { Draft } from "immer";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { applyClip, findActiveClip, findLastClip } from "./progress";
import type { FieldsBase, HandleProgress, Keyframes, Register, StateBase, TargetFromBase } from "./types";
import { isNone, isSome } from "./utils";

export type Store<Fields extends FieldsBase, Base extends StateBase<Fields>> = {
  slots: { [Obj in keyof Base]?: { [id: string]: TargetFromBase<Fields, Base, Obj> } };

  // The active implementation of fields
  fields: Fields;

  // the user supplied stuff, most notably the clips
  objects: (keyof Base)[];
  keyframes: Keyframes<Fields, Base>;
  base: Base;
  length: number;

  last: number;
};

export type Actions<Fields extends FieldsBase, Base extends StateBase<Fields>> = {
  setSlot: <Obj extends keyof Base>(obj: Obj, target: TargetFromBase<Fields, Base, Obj> | null, id: string) => void;

  updateProgress: (progress: number) => void;
  progress: HandleProgress;
  register: Register<Fields, Base>;
};

export const createStore = <Fields extends FieldsBase, Base extends StateBase<Fields>>(
  initial: Omit<Store<Fields, Base>, "slots" | "last">
) =>
  create<Store<Fields, Base> & Actions<Fields, Base>>()(
    immer((set, get) => ({
      // Initial store content
      ...initial,
      slots: {},
      last: 0,

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
      updateProgress: progress => set(s => void (s.last = progress)),

      // wauw, such easy
      register:
        (obj, id = "default") =>
        target => {
          // Update the slot in the store
          const { setSlot, keyframes, base, last, fields } = get();
          setSlot(obj, target, id);

          // handle if target is null
          if (isNone(target)) return;
          const progress = last;
          // and apply the state at lastProgress
          keyframes[obj].fields.forEach(field => {
            // do all of the fields
            const clips = keyframes[obj].clips[field];
            const clip = findLastClip(progress, clips);
            if (isSome(clip)) {
              applyClip(fields[field as keyof Fields], target, clip, progress);
            } else {
              // If we can't find the last clip, fallback to applying the base state
              const baseValue = base[obj][field];
              fields[field as keyof Fields].apply(target, baseValue, baseValue, 0);
            }
          });
        },

      // Some notes about why the stuff in here is sane:
      // Since we applied the `progress.last` state to
      progress: p => {
        const { updateProgress, length, objects, slots, keyframes, last, fields } = get();

        const progress = p(last / length) * length;
        // apply the updates, applicable to range
        const range: [number, number] = [Math.min(last, progress), Math.max(last, progress)];

        // also handle invalidation
        let hasApplied = false;

        objects.forEach(o =>
          keyframes[o].fields.forEach(field => {
            const clips = keyframes[o].clips[field];

            const considered = findActiveClip(range, clips);
            // console.log(considered, field, o);
            if (isSome(considered)) {
              // -> means, we find a clip that should be applied, for the current progress, so lets apply that to all registered
              Object.values(slots[o] ?? {}).forEach(target => {
                if (isSome(target)) {
                  applyClip(fields[field as keyof Fields], target, considered, progress);
                  hasApplied = true;
                }
              });
            }
          })
        );

        // if (hasApplied) invalidate();

        updateProgress(progress);
      }
    }))
  );
