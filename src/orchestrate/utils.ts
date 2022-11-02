import type { FieldConfig } from "./config";
import type { Interpolation } from "@/progress";

export const InheritSymbol: unique symbol = Symbol("inherit previous value");

/**
 * Utilities to be used to create keyframe clips
 **/
export const clips = {
  inherit: InheritSymbol,
  state: <T>(t: T, interpolation?: Interpolation, damping?: number): [T, FieldConfig] => [t, { interpolation, damping }]
};
