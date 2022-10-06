import { useFrame } from "@react-three/fiber";
import produce from "immer";
import { useCallback, useEffect, useRef } from "react";
import { interpolate } from "./interpolation";
import type { AllFieldTypes, AnyField, AnyFieldType } from "./states";
import { applyFields, applySelf, interpolateFields } from "./states";
import type { KeyframeStoreApi } from "./store";
import type {
  KeyframeRefs,
  Keyframes,
  KeyframesObject,
  State,
  ValidScene,
} from "./types";
import { deepCopy, getOffsetTop, overlayRange } from "./utils";

// const getSlot = <Scene extends ValidScene, K extends keyof Scene>(
//   store: RefStore<Scene>,
//   key: K,
//   index?: number
// ): RefSlot<Scene[K]> => {
//   if (index !== undefined) {
//     // -> Array mode
//     if (store[key] === undefined) store[key] = { type: "array", store: {} };
//     const slot = store[key];
//     // NOTE: Maybe it is a use-case to have a hybrid single & array store, then we might want to lift this restriction
//     if (slot.type === "single")
//       throw new Error(
//         `[useKeyframes] tried to use an index (${index}) for slot: ${key}, but slot was already used without index`
//       );
//     if (slot.store[index] === undefined)
//       slot.store[index] = { element: null, mixer: null };
//     return slot.store[index];
//   } else {
//     // -> Single mode
//     if (store[key] === undefined)
//       store[key] = { type: "single", store: { element: null, mixer: null } };
//     const slot = store[key];
//     if (slot.type === "array")
//       throw new Error(`[useKeyframes] tried to use slot ${key} without index`);
//     return slot.store;
//   }
// };
const applyToState = <Scene extends ValidScene>(
  state: State<Scene>,
  object: keyof Scene,
  field: AnyField,
  value: AnyFieldType,
) => {
  applySelf[field](state[object] as any, value as any);
};

export const useKeyframes = <Scene extends ValidScene>(
  keyframes: Keyframes<Scene>,
  useStore: KeyframeStoreApi<Scene>,
): KeyframeRefs<Scene> => {
  const { setState, getState } = useStore;

  const lastProgress = useRef<number | undefined>(undefined);
  const state = useRef<State<Scene>>(
    keyframes.allObjects.reduce<State<Scene>>((prev, curr) => {
      return {
        ...prev,
        [curr]: deepCopy(keyframes.objects[curr].base),
      };
    }, {} as State<Scene>),
  );

  const refs = useCallback<KeyframeRefs<Scene>>(
    <K extends keyof Scene>(key: K) => {
      return (el) => {
        setState(
          produce((objectState) => {
            if (el) {
              objectState.objects[key] = el;
              // Apply initial condition
              const fields = Object.keys(
                state.current[key],
              ) as Scene[keyof Scene][];
              fields.forEach((f) => {
                applyFields[f](
                  objectState.objects[key] as any,
                  state.current[key][f] as AllFieldTypes,
                );
              });
            }
          }),
        );
      };
    },
    [setState],
  );

  // Used to inform three.js that a new frame should be build, this prevents three
  // from pumping out 60 fps during no scene change
  const invalidateOnScroll = useCallback(() => {
    const { getThree } = getState();
    if (getThree) getThree().invalidate();
  }, [getState]);

  useEffect(() => {
    if (window === undefined) return;
    window.addEventListener("scroll", invalidateOnScroll);
    return () => window.removeEventListener("scroll", invalidateOnScroll);
  }, [invalidateOnScroll]);

  // We now have a store of every element in the scene (the actual *realized* element)
  // Now we can look at the scroll state, compute the matching state (with the help
  // of the keyframes) and apply it directly to the refs
  useFrame(
    useCallback(() => {
      const { getThree, container, constants, objects } = getState();
      if (!getThree || !container || !constants) return;
      const { canvasHeight, sectionHeight } = constants;

      const { gl } = getThree();

      // ## Figure out the offset

      // NOTE: in the old progress we figured this out onScroll, but actually the operation
      // should not be that expensive to do here, and this is way easier to adapt to diffrent
      // keyframes, although that might be a point where profiling could start
      const absoluteProgress =
        getOffsetTop(gl.domElement) - getOffsetTop(container);

      // This is still a pixel value, but now tracks the offset from the middle of the canvas to the middle of the sections
      const absoluteAdapted =
        absoluteProgress + canvasHeight * 0.5 - sectionHeight * 0.5;

      // This is now the progress relative to a section height, and therefore correlates
      // exactly with the keyframe offsets
      const progress = absoluteAdapted / sectionHeight;
      // console.log(progress);

      // Early opt out if the progress did not change
      if (lastProgress.current === progress) return;

      // ## Check for objects and applyState
      keyframes.allObjects.forEach((name) => {
        type Obj = KeyframesObject<Scene[keyof Scene]>;

        // Check if the object is registered with the system
        if (!objects[name]) return;

        const object: Obj = keyframes.objects[name];

        // Check if the active ranges and the current range overlaps
        const currentRange: [from: number, to: number] = [
          Math.min(lastProgress.current ?? 0, progress),
          Math.max(lastProgress.current ?? 0, progress),
        ];

        // Waaauw what an optimization
        if (!object.active.some(a => overlayRange(a, currentRange))) return;
        // Since we are in an active range, there should be a keyframe so that
        let nextFrameIndex = object.frames.findIndex(
          frame => frame >= progress,
        );
        if (nextFrameIndex === -1) nextFrameIndex = object.frames.length - 1;

        const nextFrame = object.frames[nextFrameIndex];
        const next = object.timeline[nextFrame];
        const prevFrame = object.frames[nextFrameIndex - 1];
        const prev = object.timeline[prevFrame];

        const alpha = Math.min(
          Math.max((progress - prevFrame) / (nextFrame - prevFrame), 0),
          1,
        );

        // console.log(alpha);

        // Otherwise calculate and apply state
        const fields = Object.keys(next.state) as Scene[keyof Scene][];
        fields.forEach((f) => {
          const interp = next.interpolations[f];
          // No interpolation just use next value (technically next and prev value for this field *must* be equal)
          if (interp === undefined) {
            applyToState(state.current, name, f, next.state[f]);
          }
 else {
            interpolateFields[f](
              state.current[name] as any,
              prev.state[f] as AllFieldTypes,
              next.state[f] as AllFieldTypes,
              interpolate(interp!, alpha),
            );
          }

          applyFields[f](
            objects[name] as any,
            state.current[name][f] as AllFieldTypes,
          );
        });
      });

      lastProgress.current = progress;
    }, [getState]),
  );

  return refs;
};
