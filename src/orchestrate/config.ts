import type { Interpolation } from "@/progress";

export type FieldConfig = {
  damping?: number;
  interpolation?: Interpolation;
};

export type ObjectConfig = FieldConfig & {
  // dont know yet
};

export type ClipsConfig = ObjectConfig & {
  /**
   * */
  length: number;
};
