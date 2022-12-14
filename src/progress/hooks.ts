import type { Camera } from "@react-three/fiber";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { useStore } from "zustand";
import type { FieldsBase, ObjectsForTarget, StateBase, TargetFromBase } from "../orchestrate";
import type { ClipStore } from "../store";
import { useProgress } from "./progress";
import { useRegister } from "./register";

// Mostly utility hooks, that aim to make some of the library features easier to use
export const useThreeCamera = <
  Fields extends FieldsBase,
  Base extends StateBase<Fields>,
  Obj extends ObjectsForTarget<Camera, Fields, Base>
>(
  store: ClipStore<Fields, Base>,
  obj: Obj,
  id?: string
) => {
  const register = useRegister(store);
  const camera = useThree(s => s.camera);
  useEffect(() => {
    // register the camera as the object
    register(obj, id)(<TargetFromBase<Fields, Base, Obj>>camera);
    // Also unregister on "unmount" to replicate the ref callback behavior of react
    return () => register(obj, id)(null);
  }, [camera, register, obj, id]);
};

export const useTimeProgress = <Fields extends FieldsBase, Base extends StateBase<Fields>>(
  store: ClipStore<Fields, Base>,
  length?: number,
  loop = false
) => {
  const progress = useProgress(store);
  const len = useStore(store, s => length ?? s.length);

  // get the start once, to prevent jumping at initial load around
  const get = useThree(s => s.get);
  const start = useMemo(() => get().clock.elapsedTime, [get]);

  useFrame(({ clock: { elapsedTime } }) => {
    const total = elapsedTime - start;
    let norm = total / len;

    if (loop) norm = norm % 1;
    if (norm > 1) return;
    progress(norm);
  });
};
