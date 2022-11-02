import type { Interpolation } from "@/progress";

export type ClipConfig = {
  damping?: number;
  interpolation?: Interpolation;
};

export type ObjectConfig = ClipConfig & {
  // dont know yet
};

export type ClipsConfig = Required<ObjectConfig> & {
  length: number;
};
