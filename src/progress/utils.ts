import type { Clip, FieldDefinition } from "../orchestrate";
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

/**
 * Apply a given field based on the progress
 *
 * IMPORTANT: `progress` is expected to be in `[0;length]` and *not* `[0, 1]`. This transformation is subject to the caller
 **/
export const applyClip = <Target = any, Store = any>(
  field: FieldDefinition<Target, Store>,
  target: Target,
  clip: Clip<Store>,
  progress: number
) => {
  const alpha = alphaForClip(clip, progress);
  field.apply(target, clip.start[1], clip.end[1], alpha);
};

export const findConsideredClips = (range: [number, number], clips: Clip[]) =>
  clips.filter(({ start: [start], end: [end] }) => rangesOverlap(range, [start, end]));

/**
 * Check if any of the clips are should be executed based on
 *
 **/
export const findActiveClip = (progress: number, considered: Clip[]) => {
  // NOTE: this might be a bit to pricy to do all the time (same with the ranges overlap),
  // maybe we could investigate into a smarter look up solution
  const distances = considered.map(({ start: [start], end: [end] }) =>
    Math.min(Math.abs(start - progress), Math.abs(end - progress))
  );
  const minIndex = distances.reduce((lowest, next, index) => {
    return next < distances[lowest] ? index : lowest;
  }, 0);
  return considered[minIndex];
};
