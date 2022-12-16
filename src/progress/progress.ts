import { useCallback, useRef } from "react";
import { invalidate, useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import type { Clip, FieldsBase, HandleProgress, StateBase } from "../orchestrate";
import type { ClipStore } from "../store";
import { isSome } from "../utils";
import { applyClip, findActiveClip } from "./utils";

export const useProgress = <Fields extends FieldsBase, Base extends StateBase<Fields>>(
  store: ClipStore<Fields, Base>,
  damping?: number,
  eps = 1e-2
): HandleProgress => {
  // a list of clips that were determined to have to be applied until during the next update
  const shouldUpdate = useRef<{ considered: Clip; o: keyof Base; field: keyof Fields }[]>([]);
  const target = useRef<number>(0);
  // const last = useRef<number>(target.current);

  useFrame(
    useCallback(
      (_, delta) => {
        if (isSome(damping) && shouldUpdate.current.length > 0) {
          const { slots, fields, setLastProgress, last } = store.getState();

          // applies `progress` to all objects in  shouldUpdate
          const applyProgress = (progress: number) => {
            // apply all the clips
            shouldUpdate.current.forEach(({ considered, o, field }) => {
              Object.values(slots[o] ?? {}).forEach(target => {
                if (isSome(target)) applyClip(fields[field], target, considered, progress);
              });
            });
          };

          // damp the scrolls if that is required
          const progress = MathUtils.damp(last, target.current, damping, Math.min(delta, 1 / 20));
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
      const { length, objects, slots, keyframes, last, fields } = store.getState();
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
          const considered = findActiveClip(range, clips);
          // console.log(considered, field, o);
          if (isSome(considered)) {
            if (isSome(damping) && considered.config.damping) {
              // store that, so that the damping is applied in the useFrame callback
              shouldUpdate.current.push({ considered, o, field });
            } else {
              // apply directissimy
              Object.values(slots[o] ?? {}).forEach(target => {
                if (isSome(target)) applyClip(fields[field], target, considered, progress);
              });
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
): HandleProgress => {
  return useCallback(
    p => {
      const { length, objects, slots, keyframes, last, fields } = store.getState();
      const progress = p * length;
      // apply the updates, applicable to range
      const range: [number, number] = [Math.min(last, progress), Math.max(last, progress)];

      objects.forEach(o =>
        keyframes[o].fields.forEach(f => {
          const field = f as keyof Fields;
          const clips = keyframes[o].clips[field];
          const considered = findActiveClip(range, clips);
          // console.log(considered, field, o);
          if (isSome(considered)) {
            // apply directissimy
            Object.values(slots[o] ?? {}).forEach(target => {
              if (isSome(target)) applyClip(fields[field], target, considered, progress);
            });
          }
        })
      );
      const { setLastProgress } = store.getState();
      setLastProgress(progress);
    },
    [store]
  );
};
