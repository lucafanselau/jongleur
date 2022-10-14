import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import type { FieldsBase, Object3DTargets, Register, StateBase, TargetFromBase } from "./types";

// Mostly utility hooks, that aim to make some of the library features easier to use

export const useThreeCamera = <Fields extends FieldsBase, Base extends StateBase<Fields>, Obj extends Object3DTargets<Fields, Base>>(
  register: Register<Fields, Base>,
  obj: Obj,
  id?: string
) => {
  const camera = useThree(s => s.camera);
  useEffect(() => {
    // register the camera as the object
    register(obj, id)(<TargetFromBase<Fields, Base, Obj>>camera);
    // Also unregister on "unmount" to replicate the ref callback behavior of react
    return () => register(obj, id)(null);
  }, [camera, register, obj]);
};
