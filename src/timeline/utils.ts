import { clamp, isSome, isNone, rangesOverlap } from "../utils";
import { interpolate } from "./interpolation";
import { ClipStore } from "./store";
import { Clip, FieldsBase, StateBase, StoreFromFields } from "./types";

export const Inherit = "inherit-state" as const; // "jongleur-inherit-symbol"

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

/**
 * Utility function to apply a specific field
 *
 * This should generally be prefered to interacting with the fields directly
 */
export const applyProgressToObject = <
  Fields extends FieldsBase,
  Base extends StateBase<Fields>,
  Obj extends keyof Base,
  Field extends keyof Base[Obj] & keyof Fields
>(
  store: ClipStore<Fields, Base>,
  progress: number,
  obj: Obj,
  key: Field,
  considered: Clip<StoreFromFields<Fields, Field>>[],
  alwaysApply = false
) => {
  // get the objects that we need in order
  const { state, slots, fields, setLastState } = store.getState();
  const last = state[obj][key];
  const field = fields[key];

  const clip = findActiveClip(progress, considered);
  if (isNone(clip)) return false;
  // interpolation targets
  const {
    start: [_s, start],
    end: [_e, end]
  } = clip;

  // now compute the interpolation, eg what happens via the store (orchestrate/fields/store)
  const alpha = alphaForClip(clip, progress);
  const value = field.store.interp(start, end, alpha);

  // check if progress actually occured
  if (!alwaysApply && clip.config.checkEq && isSome(last.store) && field.store.eq(value, last.store)) return true;

  // If so apply to the target, call callbacks and store the stuff back
  const slot = slots[obj] ?? {};
  Object.values(slot).forEach(target => {
    field.assign(target, value, last.store);
  });

  // in the end update the state
  setLastState(obj, key, draft => field.store.set(draft, value));
  return true;
};
