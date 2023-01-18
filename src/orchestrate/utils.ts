import type { Interpolation } from "../progress";
import type { CleanupKeyframeState, FieldKeyframeState } from "./types";

export const InheritSymbol = "inherit-state" as const; // "jongleur-inherit-symbol"

/**
 * Utilities to be used to create keyframe clips
 **/
export const helpers = {
  inherit: InheritSymbol,
  state: <T>(value: CleanupKeyframeState<T>, interpolation?: Interpolation): FieldKeyframeState<T> => ({
    value,
    config: { interpolation }
  })
};
