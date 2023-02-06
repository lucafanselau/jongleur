import type { Interpolation } from "../progress";

export type ClipConfig = {
  interpolation?: Interpolation;
  checkEq?: boolean;
};

export type ObjectConfig = ClipConfig & {
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
