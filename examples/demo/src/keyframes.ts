import { orchestrate } from "jongleur";
import { Vector3 } from "three";

export const [progression, register] = orchestrate(
  {
    camera: {
      position: new Vector3(0, 0, 0)
    }
  },
  {
    camera: {
      0: {
        position: new Vector3(1, 2, 0)
      }
    }
  }
);
