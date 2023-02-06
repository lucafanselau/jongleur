import { applyProgressToObject } from "src/progress";
import { findActiveClip, findConsideredClips } from "src/progress/utils";
import type { ClipStore } from "src/store";
import { isSome } from "src/utils";
import type { FieldsBase, Seek, StateBase } from "./types";

export const createSeek = <Fields extends FieldsBase, Base extends StateBase<Fields>>(
  store: ClipStore<Fields, Base>
): Seek => {
  return p => {
    const { length, objects, keyframes, last } = store.getState();
    const progress = p * length;
    // apply the updates, applicable to range
    const range: [number, number] = [Math.min(last, progress), Math.max(last, progress)];

    objects.forEach(o =>
      keyframes[o].fields.forEach(f => {
        const field = f as keyof Fields;
        const clips = keyframes[o].clips[field];
        const considered = findConsideredClips(range, clips);
        const clip = findActiveClip(range[1], considered);
        if (isSome(clip)) {
          // apply directissimy
          applyProgressToObject(store, progress, o, field, considered);
        }
      })
    );
    const { setLastProgress } = store.getState();
    setLastProgress(progress);
  };
};
