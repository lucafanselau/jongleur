import { clips, InheritSymbol, orchestrate } from "jongleur";
import { Vector3 } from "three";

export const sceneAnimation = orchestrate(
  {
    // DOM cards
    start: { opacity: 1 },
    second: { opacity: 0 },
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
      0.15: { opacity: 0 }
    },
    second: {
      0.75: { opacity: InheritSymbol },
      1: { opacity: [1, { interpolation: "ease-in-out" }] },
      1.25: { opacity: clips.state(0, "ease-in-out") }
    },
    third: {
      1.75: { opacity: InheritSymbol },
      2: { opacity: clips.state(1, "ease-in-out") },
      2.25: { opacity: clips.state(0, "ease-in-out") }
    },
    fourth: {
      2.75: { opacity: InheritSymbol },
      3: { opacity: clips.state(1, "ease-in-out") },
      3.25: { opacity: clips.state(0, "ease-in-out") }
    },
    fifth: {
      3.75: { opacity: InheritSymbol },
      4: { opacity: clips.state(1, "ease-in-out") }
    },
    wall: {
      1.1: { scale: InheritSymbol },
      1.5: { scale: clips.state(new Vector3(1, 1, 1), "linear") }
    },
    table: {
      1.1: { position: InheritSymbol },
      1.6: { position: clips.state(new Vector3(0, 0, 0), "ease-out") }
    },
    tableStuff: {
      1.6: { scale: InheritSymbol },
      1.9: { scale: clips.state(new Vector3(1, 1, 1), "ease-out") }
    },
    chair: {
      2: { scale: InheritSymbol },
      2.2: { scale: clips.state(new Vector3(1, 1, 1), "linear"), rotation: InheritSymbol },
      2.4: { position: InheritSymbol },
      2.6: { rotation: clips.state(new Vector3(0, -Math.PI / 2, 0), "ease-in-out") },
      2.9: { position: clips.state(new Vector3(-50, 0, 0), "ease-out") }
    },
    bed: {
      3: { scale: InheritSymbol },
      3.5: { scale: clips.state(new Vector3(1, 1, 1), "ease-out") }
    },
    lamp: {
      3: { visible: InheritSymbol, position: InheritSymbol },
      3.8: { visible: clips.state(true, "start"), position: clips.state(new Vector3(0, 0, 0), "ease-out") }
    },
    lampLights: {
      3.5: { intensity: InheritSymbol },
      4: { intensity: clips.state(1.5, "linear") }
    }
  },
  5
);
