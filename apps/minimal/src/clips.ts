import { Inherit, timeline } from "jongleur";
import { Vector3 } from "three";

export const clips = timeline(
  {
    sectionOne: {
      opacity: 1,
      translate: ["0%", "0%"],
      config: { damping: false }
    },
    sectionTwo: {
      opacity: 0,
      translate: ["-40%", "0%"],
      config: { damping: false }
    },
    sectionThree: {
      opacity: 0,
      translate: ["0%", "100%"],
      config: { damping: false }
    },
    camera: { position: new Vector3(0, 0, 150), lookAt: new Vector3(0, 0, 0) } // a camera object (uses the lookAt field)
  },

  {
    sectionOne: {
      1: {
        // translate: ["0px","1000px"], "ease-in-out",
        opacity: 0,
        translate: ["0%", "-10%"]
      }
    },
    sectionTwo: {
      1.5: {
        // translate: ["0px","1000px"], "ease-in-out",
        opacity: 0,
        translate: ["-40%", "0%"]
      },
      2: {
        // translate: ["0px","1000px"], "ease-in-out",
        opacity: 1,
        translate: ["0%", "0%"]
      },
      2.5: {
        // translate: ["0px","1000px"], "ease-in-out",
        opacity: 0,
        translate: ["40%", "0%"]
      }
    },
    sectionThree: {
      2.5: {
        opacity: Inherit,
        translate: Inherit
      },

      3: {
        opacity: 1,
        translate: ["0%", "20%"]
      }
    },

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
  { interpolation: "ease-in-out", length: 4, damping: true }
);
