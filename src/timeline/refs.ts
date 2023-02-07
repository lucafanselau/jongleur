import { isNone } from "../utils";
import type { ClipStore } from "./store";
import type { FieldsBase, Refs, StateBase } from "./types";
import { applyProgressToObject } from "./utils";

export const createRefs = <Fields extends FieldsBase, Base extends StateBase<Fields>>(
  store: ClipStore<Fields, Base>
): Refs<Fields, Base> => {
  const { objects } = store.getState();

  return objects.reduce<Refs<Fields, Base>>((acc, obj) => {
    return {
      ...acc,
      [obj]:
        (id = "default") =>
        (target: any) => {
          // Update the slot in the store
          const { setSlot, keyframes, base, last, fields } = store.getState();
          setSlot(obj, target, id);

          // handle if target is null
          if (isNone(target)) return;
          const progress = last;
          // and apply the state at lastProgress
          keyframes[obj].fields.forEach(f => {
            const field = <keyof Fields>f;
            // do all of the fields
            const clips = keyframes[obj].clips[field];
            const wasApplied = applyProgressToObject(store, progress, obj, field, clips, true);

            if (!wasApplied) {
              // If we can't find the last clip, fallback to applying the base state
              const baseValue = base[obj][field];
              fields[field as keyof Fields].assign(target, baseValue);
            }
          });
        }
    };
  }, {} as Refs<Fields, Base>);
};
