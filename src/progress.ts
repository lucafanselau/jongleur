import { interpolate } from "./interpolation";
import type { Clip, FieldDefinition } from "./types";
import { clamp, rangesOverlap } from "./utils";

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
    interpolation
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

/**
 * Check if any of the clips are should be executed based on
 **/
export const findActiveClip = (range: [number, number], clips: Clip[]) =>
  findLastClip(
    range[1],
    clips.filter(({ start: [start], end: [end] }) => rangesOverlap(range, [start, end]))
  );
