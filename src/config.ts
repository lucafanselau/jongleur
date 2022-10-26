import type { Interpolation } from "./interpolation";

export type ClipConfig = {
  damping: false | number;
  interpolation: Interpolation;
};

export type ObjectConfig = ClipConfig & {
  // dont know yet
};

export type ClipsConfig = ObjectConfig & {
  /**
   * */
  length: number;
};
