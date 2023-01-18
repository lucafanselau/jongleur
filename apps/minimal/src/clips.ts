import { helpers, orchestrate } from "jongleur";
import { Vector3 } from "three";

export const clips = orchestrate(
  {
    // Scene
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
    }
  },
  {
    // Reyframes
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
    }
  },
  {
    interpolation: "ease-in-out",
    length: 5
  }
);
