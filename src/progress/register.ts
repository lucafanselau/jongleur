import { useCallback } from "react";
import type { FieldsBase, Register, StateBase } from "../timeline";
import type { ClipStore } from "../store";
import { isNone } from "../utils";
import { applyProgressToObject } from "./progress";

export const useRegister = <Fields extends FieldsBase, Base extends StateBase<Fields>>(
  store: ClipStore<Fields, Base>
): Register<Fields, Base> => {
  return useCallback(
    (obj, id = "default") =>
      target => {
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
      },
    [store]
  );
};
