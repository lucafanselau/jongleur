import { describe, expect, it } from "vitest";
import { Vector3 } from "three";
import { parseKeyframes } from "./keyframes";
import { InheritSymbol } from "./clip";

// type TestScene = { test: { position: Vector3 } };

describe("parsing", () => {
  it("clip from base", () => {
    const [objects, keyframes] = parseKeyframes(
      { test: { position: new Vector3(0, 0, 0) } },
      { test: { 1: { position: [new Vector3(0, 1, 0), "linear"] } } }
    );

    expect(objects).to.eql(["test"]);
    expect(keyframes).to.eql({
      test: {
        position: [
          {
            start: [0, new Vector3(0, 0, 0)],
            end: [1, new Vector3(0, 1, 0)],
            interpolation: "linear"
          }
        ]
      }
    });
  });
  it("clip from inherit", () => {
    const [, keyframes] = parseKeyframes(
      { test: { position: new Vector3(0, 0, 0) } },
      {
        test: {
          0.5: { position: InheritSymbol },
          1: { position: [new Vector3(0, 1, 0), "linear"] }
        }
      }
    );
    expect(keyframes).to.eql({
      test: {
        position: [
          {
            start: [0.5, new Vector3(0, 0, 0)],
            end: [1, new Vector3(0, 1, 0)],
            interpolation: "linear"
          }
        ]
      }
    });
  });
  it("multiple clips from inherit", () => {
    const [, keyframes] = parseKeyframes(
      { test: { position: new Vector3(0, 0, 0) } },
      {
        test: {
          0.5: { position: InheritSymbol },
          1: { position: [new Vector3(0, 1, 0), "linear"] },
          1.5: { position: InheritSymbol },
          2: { position: [new Vector3(0, 2, 0), "ease-in"] }
        }
      }
    );
    expect(keyframes).to.eql({
      test: {
        position: [
          {
            start: [0.5, new Vector3(0, 0, 0)],
            end: [1, new Vector3(0, 1, 0)],
            interpolation: "linear"
          },
          {
            start: [1.5, new Vector3(0, 1, 0)],
            end: [2, new Vector3(0, 2, 0)],
            interpolation: "ease-in"
          }
        ]
      }
    });
  });

  it("interleaved clips", () => {
    const [, keyframes] = parseKeyframes(
      { test: { position: new Vector3(0, 0, 0), rotation: 0 } },
      {
        test: {
          0.5: { position: InheritSymbol },
          0.7: { rotation: InheritSymbol },
          1: { position: [new Vector3(0, 1, 0), "linear"] },
          1.5: { position: InheritSymbol },
          2: { position: [new Vector3(0, 2, 0), "ease-in"] },
          2.3: { rotation: [1, "start"] }
        }
      }
    );
    expect(keyframes).to.eql({
      test: {
        position: [
          {
            start: [0.5, new Vector3(0, 0, 0)],
            end: [1, new Vector3(0, 1, 0)],
            interpolation: "linear"
          },
          {
            start: [1.5, new Vector3(0, 1, 0)],
            end: [2, new Vector3(0, 2, 0)],
            interpolation: "ease-in"
          }
        ],
        rotation: [
          {
            start: [0.7, 0],
            end: [2.3, 1],
            interpolation: "start"
          }
        ]
      }
    });
  });
});
