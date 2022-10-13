import type { Object3D, Vector3 } from "three";
import { createField, createOrchestrate } from "./keyframes";

/**
 * A default implementation of fields to be used in a r3f context
 *
 * If you feel like one of your custom fields, should be usable for everybody, don't hesitate
 * to open a pull request
 **/
export const defaultFields = {
  position: createField(
    (value: Object3D, target: Vector3) =>
      value.position.set(target.x, target.y, target.z),
    (a, b, alpha) => a
  ),
  rotation: createField(
    (value: Vector3, target: Vector3) =>
      value.set(target.x, target.y, target.z),
    (a, b, alpha) => a
  ),
};

/**
 * The default orchestration function using the fields
 *
 * This is a specalization of the `createOrchestrate` function, tailored to be suitable in
 * most r3f context
 **/
export const orchestrate = createOrchestrate(defaultFields);
