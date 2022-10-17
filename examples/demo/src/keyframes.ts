import { clips, InheritSymbol, orchestrate } from "jongleur";
import { Vector3 } from "three";

export const [progress, register] = orchestrate(
  {
    camera: {
      position: new Vector3(-3213.2, 3187.24, 3639.33),
      lookAt: new Vector3(0, 0, 0)
    }
  },
  {
    camera: {
      1: {
        position: [new Vector3(-3213.2, 3187.24, 3639.33 + 3000), "ease-in-out"]
      }
    }
  }
);
