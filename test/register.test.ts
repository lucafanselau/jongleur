// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { Object3D, Vector3 } from "three";
import { act, renderHook } from "@testing-library/react";
import { timeline } from "../src/timeline";
import { useRegister, useUndampedProgress } from "../src/progress";

describe("register", () => {
  // although this is in keyframe test, we use the predefined fields
  const initialize = () => {
    const clips = timeline(
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
    return clips;
  };

  it("applied state", () => {
    const clips = initialize();
    const {
      result: { current: register }
    } = renderHook(() => useRegister(clips));
    const target = new Object3D();

    act(() => {
      register("obj")(target);
    });

    expect(target.position).to.eql(new Vector3(4, 4, 4));
  });
  it("applied state after progres", () => {
    const clips = initialize();
    // first update progress
    const {
      result: { current: progress }
    } = renderHook(() => useUndampedProgress(clips));
    progress(0.5);

    const {
      result: { current: register }
    } = renderHook(() => useRegister(clips));
    const target = new Object3D();

    act(() => {
      register("obj")(target);
    });

    expect(target.position).to.eql(new Vector3(3.5, 3.5, 3.5));
  });
  it("apply state after update", () => {
    const clips = initialize();
    const {
      result: { current: progress }
    } = renderHook(() => useUndampedProgress(clips));

    // first register
    const {
      result: { current: register }
    } = renderHook(() => useRegister(clips));
    const target = new Object3D();

    act(() => {
      register("obj")(target);
    });

    expect(target.position).to.eql(new Vector3(4, 4, 4));

    act(() => progress(0.1));
    expect(target.position).to.eql(new Vector3(3.9, 3.9, 3.9));

    act(() => progress(1));
    expect(target.position).to.eql(new Vector3(3, 3, 3));
  });
  // TODO: progress related updates (espacially over multiple clips)
});
