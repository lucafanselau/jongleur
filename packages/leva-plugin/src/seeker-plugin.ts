import { normalizeVector, sanitizeVector } from "leva/plugin";
import type { Seek } from "jongleur";
import { InternalSeekerSettings, SeekerInput } from "./seeker-types";

export const normalize = (input: SeekerInput) => {
  return { value: input.seek, settings: {} as InternalSeekerSettings };
};

export const sanitize = (value: any, settings: InternalSeekerSettings, prevValue?: any) => {
  return value;
};
