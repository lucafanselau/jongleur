import { describe, expect, it } from "vitest";
import { Object3D, Vector3 } from "three";
import { parseKeyframes } from "@/orchestrate/parse";
import { InheritSymbol, orchestrate } from "@/orchestrate";

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
        fields: ["position"],
        clips: {
          position: [
            {
              start: [0, new Vector3(0, 0, 0)],
              end: [1, new Vector3(0, 1, 0)],
              interpolation: "linear"
            }
          ]
        }
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
        fields: ["position"],
        clips: {
          position: [
            {
              start: [0.5, new Vector3(0, 0, 0)],
              end: [1, new Vector3(0, 1, 0)],
              interpolation: "linear"
            }
          ]
        }
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
        fields: ["position"],
        clips: {
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
        fields: ["position", "rotation"],
        clips: {
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
      }
    });
  });
});

describe("register", () => {
  // although this is in keyframe test, we use the predefined keys
  const initialize = () => {
    const clips = orchestrate(
      {
        obj: {
          position: new Vector3(4, 4, 4)
        }
      },
      {
        obj: {
          1: {
            position: [new Vector3(3, 3, 3), "linear"]
          }
        }
      }
    );
    const { progress, register } = clips.getState();
    return [progress, register] as const;
  };

  it("applied state", () => {
    const [, register] = initialize();
    const target = new Object3D();
    register("obj")(target);

    expect(target.position).to.eql(new Vector3(4, 4, 4));
  });
  it("applied state after progres", () => {
    const [progress, register] = initialize();
    // first update progress
    progress(() => 0.5);

    const target = new Object3D();
    register("obj")(target);

    expect(target.position).to.eql(new Vector3(3.5, 3.5, 3.5));
  });
  it("apply state after update", () => {
    const [progress, register] = initialize();

    // first register
    const target = new Object3D();
    register("obj")(target);

    expect(target.position).to.eql(new Vector3(4, 4, 4));

    progress(() => 0.1);
    expect(target.position).to.eql(new Vector3(3.9, 3.9, 3.9));

    progress(() => 1);
    expect(target.position).to.eql(new Vector3(3, 3, 3));
  });
  // TODO: progress related updates (espacially over multiple clips)
});
