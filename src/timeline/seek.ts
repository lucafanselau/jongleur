import { isSome } from "../utils";
import type { ClipStore } from "./store";
import type { FieldsBase, Seek, StateBase } from "./types";
import { applyProgressToObject, findActiveClip, findConsideredClips } from "./utils";

export const createSeek = <Fields extends FieldsBase, Base extends StateBase<Fields>>(
  store: ClipStore<Fields, Base>
): Seek => {
  const handleSeek = (p: number) => {
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

  const seek = {
    _current: 0,
    set current(v: number) {
      this._current = v;
      handleSeek(v);
    },
    get current() {
      return this._current;
    }
  };
  return seek as Seek;
};
