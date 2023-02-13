import { normalizeVector, sanitizeVector } from "leva/plugin";
import type { Seek } from "jongleur";
import { InternalSeekerSettings } from "./seeker-types";

const defaultSettings = { graph: true, preview: true };

export const normalize = (input: Seek) => {
  return { value: input, settings: {} as InternalSeekerSettings };
};

export const sanitize = (value: any, settings: InternalSeekerSettings, prevValue?: any) => {
  return value;
};
