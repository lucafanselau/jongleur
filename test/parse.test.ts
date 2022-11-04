import { describe, expect, it } from "vitest";
import { Vector3 } from "three";
import { parseKeyframes } from "@/orchestrate/parse";
import { InheritSymbol, helpers } from "@/orchestrate";

// type TestScene = { test: { position: Vector3 } };

describe("parsing", () => {
  it("clips & configs", () => {
    const [objects, keyframes, length] = parseKeyframes(
      { test: { position: new Vector3(0, 0, 0) } },
      {
        test: {
          1: { position: helpers.state(new Vector3(0, 1, 0), "linear") },
          2: { position: helpers.state(new Vector3(0, 2, 0), undefined, false) }
        }
      },
      { interpolation: "ease-in-out", damping: true }
    );

    expect(length).to.eql(2);
    expect(objects).to.eql(["test"]);
    expect(keyframes).to.eql({
      test: {
        fields: ["position"],
        clips: {
          position: [
            {
              start: [0, new Vector3(0, 0, 0)],
              end: [1, new Vector3(0, 1, 0)],
              config: { interpolation: "linear", damping: true }
            },
            {
              start: [1, new Vector3(0, 1, 0)],
              end: [2, new Vector3(0, 2, 0)],
              config: { interpolation: "ease-in-out", damping: false }
            }
          ]
        }
      }
    });
  });
  it("clips & inherit symbol", () => {
    const [, keyframes] = parseKeyframes(
      { test: { position: new Vector3(0, 0, 0) } },
      {
        test: {
          0.5: { position: InheritSymbol },
          1: { position: helpers.state(new Vector3(0, 1, 0)) }
        }
      },
      { interpolation: "ease-in-out", damping: true }
    );
    expect(keyframes).to.eql({
      test: {
        fields: ["position"],
        clips: {
          position: [
            {
              start: [0.5, new Vector3(0, 0, 0)],
              end: [1, new Vector3(0, 1, 0)],
              config: { interpolation: "ease-in-out", damping: true }
            }
          ]
        }
      }
    });
  });
  it("multiple clips with inherit", () => {
    const [, keyframes] = parseKeyframes(
      { test: { position: new Vector3(0, 0, 0) } },
      {
        test: {
          0.5: { position: InheritSymbol },
          1: { position: helpers.state(new Vector3(0, 1, 0), "linear") },
          1.5: { position: InheritSymbol },
          2: { position: helpers.state(new Vector3(0, 2, 0), "ease-in") }
        }
      },
      { interpolation: "ease-in-out", damping: true }
    );
    expect(keyframes).to.eql({
      test: {
        fields: ["position"],
        clips: {
          position: [
            {
              start: [0.5, new Vector3(0, 0, 0)],
              end: [1, new Vector3(0, 1, 0)],
              config: { interpolation: "linear", damping: true }
            },
            {
              start: [1.5, new Vector3(0, 1, 0)],
              end: [2, new Vector3(0, 2, 0)],
              config: { interpolation: "ease-in", damping: true }
            }
          ]
        }
      }
    });
  });

  it("interleaved & unsorted clips", () => {
    const [, keyframes] = parseKeyframes(
      { test: { position: new Vector3(0, 0, 0), rotation: 0 } },
      {
        test: {
          0.5: { position: InheritSymbol },
          0.7: { rotation: InheritSymbol },
          1: { position: helpers.state(new Vector3(0, 1, 0), "linear", false) },
          1.5: { position: InheritSymbol },
          2: { position: helpers.state(new Vector3(0, 2, 0), "ease-in") },
          2.3: { rotation: helpers.state(1, "start") }
        }
      },
      { interpolation: "ease-in-out", damping: true }
    );
    expect(keyframes).to.eql({
      test: {
        fields: ["position", "rotation"],
        clips: {
          position: [
            {
              start: [0.5, new Vector3(0, 0, 0)],
              end: [1, new Vector3(0, 1, 0)],
              config: { interpolation: "linear", damping: false }
            },
            {
              start: [1.5, new Vector3(0, 1, 0)],
              end: [2, new Vector3(0, 2, 0)],
              config: { interpolation: "ease-in", damping: true }
            }
          ],
          rotation: [
            {
              start: [0.7, 0],
              end: [2.3, 1],
              config: { interpolation: "start", damping: true }
            }
          ]
        }
      }
    });
  });
});
