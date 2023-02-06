import { invalidate, useFrame } from "@react-three/fiber";
import { useCallback, useRef } from "react";
import { MathUtils } from "three";
import type { Clip, FieldsBase, Seek, StateBase, StoreFromFields } from "../timeline";
import type { ClipStore } from "../store";
import { isNone, isSome } from "../utils";
import { alphaForClip, findActiveClip, findConsideredClips } from "./utils";

/**
 * Utility function to apply a specific field
 *
 * This should generally be prefered to interacting with the fields directly
 */
export const applyProgressToObject = <
  Fields extends FieldsBase,
  Base extends StateBase<Fields>,
  Obj extends keyof Base,
  Field extends keyof Base[Obj] & keyof Fields
>(
  store: ClipStore<Fields, Base>,
  progress: number,
  obj: Obj,
  key: Field,
  considered: Clip<StoreFromFields<Fields, Field>>[],
  alwaysApply = false
) => {
  // get the objects that we need in order
  const { state, slots, fields, setLastState } = store.getState();
  const last = state[obj][key];
  const field = fields[key];

  const clip = findActiveClip(progress, considered);
  if (isNone(clip)) return false;
  // interpolation targets
  const {
    start: [_s, start],
    end: [_e, end]
  } = clip;

  // now compute the interpolation, eg what happens via the store (orchestrate/fields/store)
  const alpha = alphaForClip(clip, progress);
  const value = field.store.interp(start, end, alpha);

  // check if progress actually occured
  if (!alwaysApply && clip.config.checkEq && isSome(last.store) && field.store.eq(value, last.store)) return true;

  // If so apply to the target, call callbacks and store the stuff back
  const slot = slots[obj] ?? {};
  Object.values(slot).forEach(target => {
    field.assign(target, value, last.store);
  });

  // in the end update the state
  setLastState(obj, key, draft => field.store.set(draft, value));
  return true;
};

export const useProgress = <Fields extends FieldsBase, Base extends StateBase<Fields>>(
  store: ClipStore<Fields, Base>,
  damping?: number,
  eps = 1.5e-3
): Seek => {
  // a list of clips that were determined to have to be applied until during the next update
  const shouldUpdate = useRef<{ considered: Clip[]; o: keyof Base; field: keyof Fields }[]>([]);
  const target = useRef<number>(0);
  // const last = useRef<number>(target.current);

  useFrame(
    useCallback(
      (_, delta) => {
        if (isSome(damping) && shouldUpdate.current.length > 0) {
          const { setLastProgress, last } = store.getState();

          // applies `progress` to all objects in  shouldUpdate
          const applyProgress = (progress: number) => {
            // apply all the clips
            shouldUpdate.current.forEach(({ considered, o, field }) => {
              applyProgressToObject(store, progress, o, field, considered);
            });
          };

          // damp the scrolls if that is required
          const progress = MathUtils.damp(last, target.current, damping, Math.min(delta, 1 / 60));
          setLastProgress(progress);

          applyProgress(progress);

          // this is our stop condition, to enable demand based invalidating loops
          if (Math.abs(progress - target.current) < eps) {
            // means we reached our target (to a sufficient degree) and can stop the frames (if we are in frameloop: "demand" mode)
            // setLastProgress(target.current);
            applyProgress(target.current);
            setLastProgress(target.current);
            shouldUpdate.current = [];
          } else {
            // otherwise,  dispatch at least another frame
            invalidate();
          }
        }
      },
      [store, damping, eps]
    )
  );

  return useCallback(
    p => {
      const { length, objects, keyframes, last } = store.getState();
      const progress = p * length;
      // apply the updates, applicable to range
      const range: [number, number] = [Math.min(last, progress), Math.max(last, progress)];

      // also invalidate, to kick of at least one frame
      invalidate();

      // This works, since last is only overridden, once the frame was applied
      shouldUpdate.current = [];
      target.current = progress;

      objects.forEach(o =>
        keyframes[o].fields.forEach(f => {
          const field = f as keyof Fields;
          const clips = keyframes[o].clips[field];
          const config = keyframes[o].config;
          const considered = findConsideredClips(range, clips);
          // console.log(considered, field, o);
          if (considered.length !== 0) {
            if (isSome(damping) && config.damping) {
              // store that, so that the damping is applied in the useFrame callback
              shouldUpdate.current.push({ considered, o, field });
            } else {
              // apply directissimy
              applyProgressToObject(store, progress, o, field, considered);
            }
          }
        })
      );
      // handle the case that no damped object is added
      if (shouldUpdate.current.length === 0) {
        const { setLastProgress } = store.getState();
        setLastProgress(progress);
      }
    },
    [store, damping]
  );
};

/**
 * A progress hook that can be used outside of an R3F Canvas component
 *
 * Due to a missing frameloop, this progress ignores the ~damping~ setting and
 * applies progress directly
 **/
export const useUndampedProgress = <Fields extends FieldsBase, Base extends StateBase<Fields>>(
  store: ClipStore<Fields, Base>
): Seek => {
  return useCallback(
    p => {
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
          // console.log(considered, field, o);
          if (isSome(clip)) {
            // apply directissimy
            applyProgressToObject(store, progress, o, field, considered);
          }
        })
      );
      const { setLastProgress } = store.getState();
      setLastProgress(progress);
    },
    [store]
  );
};
