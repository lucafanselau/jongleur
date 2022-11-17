import type { Interpolation } from "../progress";
import type { FieldKeyframeState } from "./types";

export const InheritSymbol = "inherit-state" as const; // "jongleur-inherit-symbol"

/**
 * Utilities to be used to create keyframe clips
 **/
export const helpers = {
  inherit: InheritSymbol,
  state: <T>(value: T, interpolation?: Interpolation, damping?: boolean): FieldKeyframeState<T> => ({
    value,
    config: { interpolation, damping }
  })
};
