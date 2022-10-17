import { clips, InheritSymbol, orchestrate } from "jongleur";
import { Vector3 } from "three";

export const [progression, register] = orchestrate(
  {
    camera: {
      position: new Vector3(0, 2, 0),
      lookAt:
    },
    realCamera: {
      position: new Vector3(0, 0, 0)
    }
  },
  {
    camera: {
      0: {
        position: InheritSymbol
      }
    },
    realCamera: {}
  }
);
