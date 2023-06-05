import { Inherit, timeline } from "jongleur";
import { Vector3 } from "three";

export const [refs, seek, clips] = timeline(
  {
    camera: { position: new Vector3(0, 0, 150), lookAt: new Vector3(0, 0, 0) } // a camera object (uses the lookAt field)
  },
  {
    camera: {
      2: {
        position: new Vector3(150, 30, 0),
        lookAt: new Vector3(0, 0, 0)
      },
      3: {
        position: new Vector3(-30, 90, -30),
        lookAt: new Vector3(0, 0, 0)
      },
      4: {
        position: new Vector3(-60, 20, -30),
        lookAt: new Vector3(0, 0, 0)
      }
    } // camera rotates up during the animation,
  },
  { interpolation: "ease-in-out", length: 4 }
);
