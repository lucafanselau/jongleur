import type { Object3D } from "three";
import { Vector3 } from "three";
import { createField, createOrchestrate } from "./keyframes";

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
export const defaultFields = {
  position: createObject3dField("position"),
  scale: createObject3dField("scale"),
  rotation: createField<Object3D, Vector3>((target, a, b, alpha) =>
    target.rotation.setFromVector3(vec.lerpVectors(a, b, alpha))
  ),
  lookAt: createField<Object3D, Vector3>((target, a, b, alpha) => target.lookAt(vec.lerpVectors(a, b, alpha)))
};

export type DefaultFields = typeof defaultFields;

/**
 * The default orchestration function using the fields
 *
 * This is a specalization of the `createOrchestrate` function, tailored to be suitable in
 * most r3f context
 *
 * @param base       - The base definition of the scene
 * @param definition - The keyframes that define the timeline
 * @param total      - The length of the timeline, if not provided its the key of the last frame
 **/
export const orchestrate = createOrchestrate(defaultFields);
