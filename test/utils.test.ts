import { describe, expect, it } from "vitest";
import { rangesOverlap } from "../src/utils";

describe("utils", () => {
  it("overlap", () => {
    expect(rangesOverlap([0, 1], [0.5, 0.5])).true;
    expect(rangesOverlap([0, 1], [0.5, 1.5])).true;
    expect(rangesOverlap([0.5, 1], [0, 0.6])).true;
    expect(rangesOverlap([0, 1], [1.1, 1.5])).false;
    // this does *not* overlap, kinda arbitrary, but we should need to apply an edge condition
    expect(rangesOverlap([0, 1], [1, 1.5])).false;
  });
});
