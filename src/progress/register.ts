import { useCallback } from "react";
import { applyClip, findLastClip } from "./utils";
import type { FieldsBase, Register, StateBase } from "@/orchestrate";
import type { ClipStore } from "@/store";
import { isNone, isSome } from "@/utils";

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
    [store]
  );
};
