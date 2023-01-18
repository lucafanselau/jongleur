import { helpers, orchestrate } from "jongleur";
import { Vector3 } from "three";

export const clips = orchestrate(
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
        // translate: helpers.state(["0px","1000px"], "ease-in-out", true),
        opacity: helpers.state(0, "ease-in"),
        translate: helpers.state(["0%", "-10%"], "ease-in-out")
      }
    },
    sectionTwo: {
      1.5: {
        // translate: helpers.state(["0px","1000px"], "ease-in-out", true),
        opacity: helpers.state(0, "ease-in"),
        translate: helpers.state(["-40%", "0%"], "ease-in-out")
      },
      2: {
        // translate: helpers.state(["0px","1000px"], "ease-in-out", true),
        opacity: helpers.state(1, "ease-in"),
        translate: helpers.state(["0%", "0%"], "ease-in-out")
      },
      2.5: {
        // translate: helpers.state(["0px","1000px"], "ease-in-out", true),
        opacity: helpers.state(0, "ease-in"),
        translate: helpers.state(["40%", "0%"], "ease-in-out")
      }
    },
    sectionThree: {
      2.5: {
        opacity: helpers.inherit,
        translate: helpers.inherit
      },

      3: {
        opacity: helpers.state(1, "ease-in-out"),
        translate: helpers.state(["0%", "20%"], "ease-in-out")
      }
    },

    camera: {
      2: {
        position: helpers.state(new Vector3(150, 30, 0), "ease-in-out"),
        lookAt: helpers.state(new Vector3(0, 0, 0), "ease-in-out")
      },

      3: {
        position: helpers.state(new Vector3(-30, 90, -30), "ease-in-out"),
        lookAt: helpers.state(new Vector3(0, 0, 0), "ease-in-out")
      },
      4: {
        position: helpers.state(new Vector3(-60, 20, -30), "ease-in-out"),
        lookAt: helpers.state(new Vector3(0, 0, 0), "ease-in-out")
      }
    } // camera rotates up during the animation,
  },
  { interpolation: "ease-in-out", length: 4, damping: true }
);
