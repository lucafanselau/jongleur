import type { Light, Object3D } from "three";
import { Vector3 } from "three";
import { lerp } from "../utils";
import type { FieldDefinition, FieldStore } from "./types";

export const createField = <Target, Store>(
  apply: (obj: Target, a: Store, b: Store, alpha: number) => void
): FieldDefinition<Target, Store> => ({ apply });

// utility to interpolate vector
export type KeysForVector3 = {
  [K in keyof Object3D]: Object3D[K] extends Vector3 ? K : never;
}[keyof Object3D];
const createObject3dField = (key: KeysForVector3) =>
  createField<Object3D, Vector3>((target, a, b, alpha) => target[key].lerpVectors(a, b, alpha));

// a vector in memory to lerp into
const vec = new Vector3();
/**
 * A default implementation of fields to be used in a r3f context
 *
 * If you feel like one of your custom fields, should be usable for everybody, don't hesitate
 * to open a pull request
 **/
export const defaultThreeFields = {
  position: createObject3dField("position"),
  scale: createObject3dField("scale"),
  rotation: createField<Object3D, Vector3>((target, a, b, alpha) =>
    target.rotation.setFromVector3(vec.lerpVectors(a, b, alpha))
  ),
  lookAt: createField<Object3D, Vector3>((target, a, b, alpha) => target.lookAt(vec.lerpVectors(a, b, alpha))),
  visible: createField<Object3D, boolean>((target, a, b, alpha) => (target.visible = alpha > 0.5 ? b : a)),
  intensity: createField<Light, number>((target, a, b, alpha) => (target.intensity = lerp(a, b, alpha))),
  animation: createField<Object3D, string>((target, a, b, alpha) => (target.name = a))
};

export type LengthOrPercentage = `${number}%` | `${number}px`;
const lerpLOP = (a: LengthOrPercentage, b: LengthOrPercentage, alpha: number): LengthOrPercentage => {
  if (a.endsWith("%") && b.endsWith("%")) return `${lerp(Number(a.slice(0, -1)), Number(b.slice(0, -1)), alpha)}%`;
  else if (a.endsWith("px") && b.endsWith("px"))
    return `${lerp(Number(a.slice(0, -2)), Number(b.slice(0, -2)), alpha)}px`;
  throw new Error(`Cannot interpolate between ${a} and ${b} values`);
};

const vector3 = new Vector3();
const Vector3Store: FieldStore<Vector3> = {
  eq: (a, b) => a.equals(b),
  interp: (a, b, alpha) => {
    vector3.lerpVectors(a, b, alpha);
    return vector3;
  },
  set: (object, value) => {
    object.store.copy(value);
  }
};

const NumberStore: FieldStore<number> = {
  eq: (a, b) => a === b,
  interp: lerp,
  set: (object, value) => {
    object.store = value;
  }
};

const position = {
  store: Vector3Store,
  assign: (target: Object3D, value: Vector3) => {
    target.position.copy(value);
  }
};

/**
 * A default implementation of fields to be used for DOM elements
 *
 * If you feel like one of your custom fields, should be usable for everybody, don't hesitate
 * to open a pull request
 **/
export const defaultDOMFields = {
  opacity: createField<HTMLElement, number>(
    (target, a, b, alpha) => (target.style.opacity = lerp(a, b, alpha).toString())
  ),
  // https://developer.mozilla.org/en-US/docs/Web/CSS/translate
  translate: createField<HTMLElement, [LengthOrPercentage, LengthOrPercentage]>(
    (target, a, b, alpha) =>
      (target.style.transform = `translate(${lerpLOP(a[0], b[0], alpha)}, ${lerpLOP(a[1], b[1], alpha)})`)
  )
};

export const defaultFields = {
  ...defaultThreeFields,
  ...defaultDOMFields
};

export type DefaultFields = typeof defaultFields;
