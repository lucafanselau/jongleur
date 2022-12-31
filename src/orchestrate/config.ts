import type { Interpolation } from "../progress";

export type ClipConfig = {
  interpolation?: Interpolation;
};

export type ObjectConfig = ClipConfig & {
  damping?: boolean;
};

export type ClipsConfig = ObjectConfig & {
  length?: number;
};

export const defaultObjectConfig: Required<ObjectConfig> = {
  damping: true,
  interpolation: "linear"
};
