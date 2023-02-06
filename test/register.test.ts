// @vitest-environment jsdom
import { Object3D, Vector3 } from "three";
import { describe, expect, it } from "vitest";
import { timeline } from "../src/timeline";

describe("register", () => {
  // although this is in keyframe test, we use the predefined fields
  const initialize = () => {
    return timeline(
      {
        obj: {
          position: 4
        }
      },
      {
        obj: {
          1: {
            position: 3
          }
        }
      },
      {}
    );
  };
  it("applied state", () => {
    const [refs] = initialize();
    const target = new Object3D();
    refs.obj()(target);

    expect(target.position).to.eql(new Vector3(4, 4, 4));
  });
  it("applied state after progres", () => {
    const [refs, seek] = initialize();
    // first update progress
    seek(0.5);

    const target = new Object3D();
    refs.obj()(target);

    expect(target.position).to.eql(new Vector3(3.5, 3.5, 3.5));
  });
  it("apply state after update", () => {
    const [refs, seek] = initialize();
    const target = new Object3D();
    refs.obj()(target);

    expect(target.position).to.eql(new Vector3(4, 4, 4));

    seek(0.1);
    expect(target.position).to.eql(new Vector3(3.9, 3.9, 3.9));

    seek(1);
    expect(target.position).to.eql(new Vector3(3, 3, 3));
  });
  // TODO: progress related updates (espacially over multiple clips)
});
