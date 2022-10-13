// The possible controlled states
import type { Euler, Vector3 } from "three";
import type { Vec } from "./types";
import { lerp, lerpVec } from "./utils";

// Utility types

// ************************************************
// Field Type Declaration
// (1): Start by adding a name for the field (this must match the target name (at least for now))
export type PositionField = "position";
export type RotationField = "rotation";
export type ScaleField = "scale";
export type IntensityField = "intensity";
export type CameraPositionField = "lookAt";
export type OpacityField = "opacity";

// (2): Add your new field here
export type AnyField =
  | PositionField
  | RotationField
  | ScaleField
  | IntensityField
  | CameraPositionField
  | OpacityField;
export type AllFieldTypes = StoreTypes[PositionField] &
  StoreTypes[RotationField] &
  StoreTypes[ScaleField] &
  StoreTypes[IntensityField] &
  StoreTypes[CameraPositionField] &
  StoreTypes[OpacityField];

// ***********************************************
// Store, eg. how should the type be stored inside of the system
// NOTE: Why not use a Vector3 here -> Vector3 is quite a heavyweight object, and not trivially
// clone-able (eg. with deepCopy). Therefore we just use a generic three field object here
// (3): Add your store type here (this will be the type in the keyframe definition)
export type StoreTypes = {
  position: Vec;
  rotation: Vec;
  scale: Vec;
  intensity: number;
  lookAt: { pos: Vec; target: Vec };
  opacity: number;
};

// **********************************************
// The actual type of the animated property in Three.js
// (4): Add the target type
type TargetTypes = {
  position: Vector3;
  rotation: Euler;
  scale: Vector3;
  intensity: number;
  lookAt: (x: number, y: number, z: number) => void;
  opacity: number;
};

// Helper types
export type ObjectStore<Fields extends AnyField> = {
  [K in Fields]: StoreTypes[K];
};
export type ExpectedType<Fields extends AnyField> = {
  [K in Fields]: TargetTypes[K];
};

export type AnyFieldType = StoreTypes[AnyField];

// ************************************************
// The apply methods, eg how should we apply the store type to an object that contains the target type
export const applyFields: {
  [K in AnyField]: (obj: ExpectedType<K>, target: StoreTypes[K]) => void;
} = {
  position: (obj, { x, y, z }) => obj.position.set(x, y, z),
  rotation: (obj, { x, y, z }) => obj.rotation.set(x, y, z),
  scale: (obj, { x, y, z }) => obj.scale.set(x, y, z),
  intensity: (obj, v) => (obj.intensity = v),
  lookAt: (object, { pos: { x, y, z }, target }) => {
    if ("position" in object)
      (object as any).position.set(x, y, z);

    object.lookAt(target.x, target.y, target.z);
  },
  opacity: (obj, v) => (obj.opacity = v),
};

export const applySelf: {
  [K in AnyField]: (obj: ObjectStore<K>, target: StoreTypes[K]) => void;
} = {
  position: (obj, { x, y, z }) => {
    obj.position.x = x;
    obj.position.y = y;
    obj.position.z = z;
  },
  rotation: (obj, { x, y, z }) => {
    obj.rotation.x = x;
    obj.rotation.y = y;
    obj.rotation.z = z;
  },
  scale: (obj, { x, y, z }) => {
    obj.scale.x = x;
    obj.scale.y = y;
    obj.scale.z = z;
  },
  intensity: (obj, v) => (obj.intensity = v),
  lookAt: (obj, { pos, target }) => {
    obj.lookAt.pos.x = pos.x;
    obj.lookAt.pos.y = pos.y;
    obj.lookAt.pos.z = pos.z;

    obj.lookAt.target.x = target.x;
    obj.lookAt.target.y = target.y;
    obj.lookAt.target.z = target.z;
  },
  opacity: (obj, v) => (obj.opacity = v),
};

// **********************************************
// Interpolation functions
export const interpolateFields: {
  [K in AnyField]: (
    store: ObjectStore<K>,
    from: StoreTypes[K],
    to: StoreTypes[K],
    alpha: number
  ) => void;
} = {
  position: (store, ...rest) => lerpVec(store.position, ...rest),
  rotation: (store, ...rest) => lerpVec(store.rotation, ...rest),
  scale: (store, ...rest) => lerpVec(store.scale, ...rest),
  intensity: (store, ...rest) => (store.intensity = lerp(...rest)),
  lookAt: (store, from, to, alpha) => {
    lerpVec(store.lookAt.pos, from.pos, to.pos, alpha);
    lerpVec(store.lookAt.target, from.target, to.target, alpha);
  },
  opacity: (store, ...rest) => (store.opacity = lerp(...rest)),
};
