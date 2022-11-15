import { helpers, orchestrate } from "jongleur";
import { Vector3 } from "three";

const clips = orchestrate(
  // The `Base`
  {
    one: {
      opacity: 0,
      config: { damping: false },
    },
    two: { position: new Vector3(0, 0, 0) },
  },
  // The `Keyframes`
  {
    one: {
      1: { opacity: helpers.state(1) },
    },
    two: {
      0.5: { position: helpers.inherit },
      1: {
        position: helpers.state(new Vector3(1, 1, 1), "ease-in-out"),
      },
    },
  },
  // The `Config`
  {
    damping: true,
    interpolation: "linear",
  }
);
