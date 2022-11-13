import { helpers, InheritSymbol, orchestrate } from "jongleur";
import { Vector3 } from "three";

export const clips = orchestrate(
  {
    // DOM cards
    start: { opacity: 1, config: { interpolation: "linear" } },
    second: { opacity: 0, abdasd: 2 },
    third: { opacity: 0 },
    fourth: { opacity: 0 },
    fifth: { opacity: 0 },
    // wall elements
    wall: { scale: new Vector3(0, 0, 0) },
    table: { position: new Vector3(0, 0, 1000) },
    tableStuff: { scale: new Vector3(0, 0, 0) },

    chair: { scale: new Vector3(0, 0, 0), rotation: new Vector3(0, 0, 0), position: new Vector3(0, 0, 0) },
    bed: { scale: new Vector3(0, 0, 0) },
    lamp: { visible: true as boolean, position: new Vector3(0, 800, 0) },
    lampLights: { intensity: 0 }
  },
  {
    start: {
      // pretty early the start label has to vanish
      0.08: { opacity: helpers.state(0, undefined, false) }
    },
    second: {
      0.75: { opacity: InheritSymbol },
      1: { opacity: helpers.state(1) },
      1.25: { opacity: helpers.state(0) }
    },
    third: {
      1.75: { opacity: InheritSymbol },
      2: { opacity: helpers.state(1) },
      2.25: { opacity: helpers.state(0) }
    },
    fourth: {
      2.75: { opacity: InheritSymbol },
      3: { opacity: helpers.state(1) },
      3.25: { opacity: helpers.state(0) }
    },
    fifth: {
      3.75: { opacity: InheritSymbol },
      4: { opacity: helpers.state(1) }
    },
    wall: {
      1.1: { scale: InheritSymbol },
      1.5: { scale: helpers.state(new Vector3(1, 1, 1), "linear") }
    },
    table: {
      1.1: { position: InheritSymbol },
      1.6: { position: helpers.state(new Vector3(0, 0, 0), "ease-out") }
    },
    tableStuff: {
      1.6: { scale: InheritSymbol },
      1.9: { scale: helpers.state(new Vector3(1, 1, 1), "ease-out") }
    },
    chair: {
      2: { scale: InheritSymbol },
      2.2: { scale: helpers.state(new Vector3(1, 1, 1), "linear"), rotation: InheritSymbol },
      2.4: { position: InheritSymbol },
      2.6: { rotation: helpers.state(new Vector3(0, -Math.PI / 2, 0)) },
      2.9: { position: helpers.state(new Vector3(-50, 0, 0), "ease-out") }
    },
    bed: {
      3: { scale: InheritSymbol },
      3.5: { scale: helpers.state(new Vector3(1, 1, 1), "ease-out") }
    },
    lamp: {
      3: { visible: InheritSymbol, position: InheritSymbol },
      3.8: { visible: helpers.state(true, "start"), position: helpers.state(new Vector3(0, 0, 0), "ease-out") }
    },
    lampLights: {
      3.5: { intensity: InheritSymbol },
      4: { intensity: helpers.state(1.5, "linear") }
    }
  },
  {
    interpolation: "ease-in-out",
    length: 5
  }
);
