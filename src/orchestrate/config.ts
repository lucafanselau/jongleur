import type { Interpolation } from "@/progress";

export type ClipConfig = {
  interpolation?: Interpolation;
  damping?: boolean;
};

export type ObjectConfig = ClipConfig & {
  // dont know yet
};

export type ClipsConfig = ObjectConfig & {
  length?: number;
};

export const defaultObjectConfig: Required<ObjectConfig> = {
  damping: true,
  interpolation: "linear"
};
