import { useCallback } from "react";
import { applyClip, findActiveClip } from "./utils";
import type { FieldsBase, HandleProgress, StateBase } from "@/orchestrate";
import type { ClipStore } from "@/store";
import { isSome } from "@/utils";

export const useProgress = <Fields extends FieldsBase, Base extends StateBase<Fields>>(
  store: ClipStore<Fields, Base>
): HandleProgress => {
  // TODO: damping
  return useCallback(
    p => {
      const { updateProgress, length, objects, slots, keyframes, last, fields } = store.getState();
      const progress = p(last / length) * length;
      // apply the updates, applicable to range
      const range: [number, number] = [Math.min(last, progress), Math.max(last, progress)];

      // also handle invalidation
      // let _hasApplied = false;

      objects.forEach(o =>
        keyframes[o].fields.forEach(field => {
          const clips = keyframes[o].clips[field];

          const considered = findActiveClip(range, clips);
          // console.log(considered, field, o);
          if (isSome(considered)) {
            // -> means, we find a clip that should be applied, for the current progress, so lets apply that to all registered
            Object.values(slots[o] ?? {}).forEach(target => {
              if (isSome(target)) applyClip(fields[field as keyof Fields], target, considered, progress);
              // _hasApplied = true;
            });
          }
        })
      );

      // if (hasApplied) invalidate();

      updateProgress(progress);
    },
    [store]
  );
};
