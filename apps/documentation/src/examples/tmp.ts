import { orchestrate } from "jongleur";
import { Vector3 } from "three";

// @errors: 2345
orchestrate(
  {
    one: {
      position: new Vector3(0, 0, 0),
      ooooopacity: 0,
    },
  },
  {},
  {}
);
