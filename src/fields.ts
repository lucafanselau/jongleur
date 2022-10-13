import { Object3D, Vector3 } from "three";
import {
  createField,
  createOrchestrate,
  FunctionParameters,
} from "./keyframes";

/**
 * A default implementation of fields to be used in a r3f context
 **/
export const orchestrate = createOrchestrate({
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
});

export const [progression, register] = orchestrate(
  {
    camera: {
      position: new Vector3(0, 0, 0),
    },
  },
  {
    camera: {
      0: {
        position: new Vector3(1, 2, 0),
      },
    },
  }
);

const reg = register("camera");
