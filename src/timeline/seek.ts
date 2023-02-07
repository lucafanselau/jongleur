import { invalidate } from "@react-three/fiber";
import type { ClipStore } from "./store";
import type { FieldsBase, Seek, StateBase } from "./types";
import { applyProgressToObject, findConsideredClips } from "./utils";

export const createSeek = <Fields extends FieldsBase, Base extends StateBase<Fields>>(
  store: ClipStore<Fields, Base>
): Seek => {
  const handleSeek = (p: number) => {
    const { length, objects, keyframes, last } = store.getState();
    const progress = p * length;
    // apply the updates, applicable to range
    const range: [number, number] = [Math.min(last, progress), Math.max(last, progress)];

    // we also keep track if we applied any of the clips
    const appliedClip = objects
      .flatMap(o =>
        keyframes[o].fields.map(f => {
          const field = f as keyof Fields;
          const clips = keyframes[o].clips[field];
          const considered = findConsideredClips(range, clips);
          return applyProgressToObject(store, progress, o, field, considered);
        })
      )
      .reduce((acc, curr) => acc || curr);

    if (appliedClip) invalidate();

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