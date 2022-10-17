import { describe, expect, it } from "vitest";
import type { Interpolation } from "./interpolation";
import { alphaForClip, findActiveClip, findLastClip } from "./progress";
import type { Clip } from "./types";

const dummy = (start: number, end: number, interpolation: Interpolation = "linear"): Clip => ({
  start: [start, null],
  end: [end, null],
  interpolation
});

describe("progress", () => {
  it("last clip", () => {
    const clips: Clip[] = [dummy(0, 1), dummy(1, 2), dummy(2, 3)];
    // sanity check for my implementation
    expect(findLastClip(0, clips)).eql(dummy(0, 1));
    expect(findLastClip(0.7, clips)).eql(dummy(0, 1));
    expect(findLastClip(1.0, clips)).eql(dummy(1, 2));
    expect(findLastClip(1.5, clips)).eql(dummy(1, 2));
    expect(findLastClip(2, clips)).eql(dummy(2, 3));
    expect(findLastClip(4, clips)).eql(dummy(2, 3));

    expect(findLastClip(-1, clips)).to.be.undefined;
  });

  it("alpha", () => {
    const clip = dummy(0, 1);
    expect(alphaForClip(clip, 0.5)).to.be.eq(0.5);
    expect(alphaForClip(clip, -1)).to.be.eq(0);
    expect(alphaForClip(clip, 2)).to.be.eq(1);
    const clip2 = dummy(2, 5);
    expect(alphaForClip(clip2, 0.5)).to.be.eq(0);
    expect(alphaForClip(clip2, 3)).to.be.closeTo(1 / 3, 1e-4);
    expect(alphaForClip(clip2, 7)).to.be.eq(1);
    const clip3 = dummy(2, 5, "start");
    expect(alphaForClip(clip3, 2)).to.be.eq(0);
    expect(alphaForClip(clip3, 3)).to.be.eq(1);
    expect(alphaForClip(clip3, 7)).to.be.eq(1);
    // TODO: maybe add more interpolation tests
  });

  it("active clips", () => {
    const clips: Clip[] = [dummy(0, 1), dummy(2, 3)];

    expect(findActiveClip([0, 2.2], clips)).eql(dummy(2, 3));
    expect(findActiveClip([2.2, 4], clips)).eql(dummy(2, 3));
    expect(findActiveClip([0, 2], clips)).eql(dummy(0, 1));

    expect(findActiveClip([4, 5], clips)).to.be.undefined;
    expect(findActiveClip([1, 1.5], clips)).to.be.undefined;
  });
});
