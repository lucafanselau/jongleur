import type { FieldKeyframeState } from "./types";
import type { Interpolation } from "@/progress";

export const InheritSymbol: unique symbol = Symbol("jongleur-inherit-symbol");

/**
 * Utilities to be used to create keyframe clips
 **/
export const helpers = {
  inherit: InheritSymbol,
  state: <T>(value: T, interpolation?: Interpolation, damping?: number): FieldKeyframeState<T> => ({
    value,
    config: { interpolation, damping }
  })
};
