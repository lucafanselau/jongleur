import type { Clip } from "../timeline";
import { clamp, rangesOverlap } from "../utils";
import { interpolate } from "./interpolation";

export const isIn = (progress: number, range: [number, number]) => progress >= range[0] && progress < range[1];

export const isInClip = (progress: number, clip: Clip) => isIn(progress, [clip.start[0], clip.end[0]]);

export const findLastClip = (progress: number, clips: Clip[]): Clip | undefined => {
  // console.log(clips);
  // Since clips are non overlapping, we can just take the one, where the start of the clip is closest to the current progress
  return clips.reduce<Clip | undefined>((prev, current) => {
    // if the clip happens after the current progress, dont even consider it
    if (current.start[0] > progress) return prev;
    // if we can consider current and its the first valid, just take it
    if (prev === undefined) return current;
    // otherwise we check if the currents clips start is closer too progress, then the previous
    return progress - current.start[0] < progress - prev.start[0] ? current : prev;
  }, undefined);
};

export const alphaForClip = (clip: Clip, progress: number) => {
  // figure out alpha
  const {
    start: [lower],
    end: [upper],
    config: { interpolation }
  } = clip;
  const alpha = clamp((progress - lower) / (upper - lower), 0, 1);
  // and apply interpolation
  return interpolate(interpolation, alpha);
};

export const findConsideredClips = (range: [number, number], clips: Clip[]) =>
  clips.filter(({ start: [start], end: [end] }) => rangesOverlap(range, [start, end]));

/**
 * Check if any of the clips are should be executed based on
 *
 **/
export const findActiveClip = <Store = any>(progress: number, considered: Clip<Store>[]) => {
  // NOTE: this might be a bit to pricy to do all the time (same with the ranges overlap),
  // maybe we could investigate into a smarter look up solution
  const distances = considered.map(({ start: [start], end: [end] }) =>
    // HACK: we should probably just handle start and end separate
    Math.min(Math.abs(start + 0.0001 - progress), Math.abs(end - progress))
  );
  const minIndex = distances.reduce((lowest, next, index) => {
    return next < distances[lowest] ? index : lowest;
  }, 0);
  return considered[minIndex];
};
