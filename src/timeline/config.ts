import type { Interpolation } from "../progress";

export type ClipConfig = {
  interpolation?: Interpolation;
  checkEq?: boolean;
};

export type ObjectConfig = ClipConfig & {
  // DEPRECATED: Damping should be implemented in User land
  damping?: boolean;
};

export type ClipsConfig = ObjectConfig & {
  length?: number;
};

export const defaultClipConfig: Required<ClipConfig> = {
  interpolation: "linear",
  checkEq: true
};

export const defaultObjectConfig: Required<ObjectConfig> = {
  ...defaultClipConfig,
  damping: true
};
