import { lerp } from "../../utils";
import type { ClipConfig } from "../config";
import type { FieldDefinition, FieldStore } from "../types";

export const createField = <Entry, Target, Store>(
  store: FieldStore<Entry, Store>,
  assign: (target: Target, value: Store, last?: Store) => void,
  config?: ClipConfig
): FieldDefinition<Entry, Target, Store> => ({
  store,
  assign,
  config
});

// Some utils to work with CSS style values
export type LengthOrPercentage = `${number}px` | `${number}%`;

export const lerpLengthOrPercentage = (
  a: LengthOrPercentage,
  b: LengthOrPercentage,
  alpha: number
): LengthOrPercentage => {
  if (a.endsWith("%") && b.endsWith("%")) return `${lerp(Number(a.slice(0, -1)), Number(b.slice(0, -1)), alpha)}%`;
  else if (a.endsWith("px") && b.endsWith("px"))
    return `${lerp(Number(a.slice(0, -2)), Number(b.slice(0, -2)), alpha)}px`;
  throw new Error(`[jongleur] Cannot interpolate between values: ${a} and ${b}`);
};
