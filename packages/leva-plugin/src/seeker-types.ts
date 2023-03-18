import type { InternalVectorSettings, LevaInputProps, MergedInputWithSettings } from "leva/plugin";
import type { Seek } from "jongleur";

export type SeekerSettings = { graph?: boolean; preview?: boolean };
export type SeekerInput = MergedInputWithSettings<{ seek: Seek }, SeekerSettings, "seek">;

export type InternalSeeker = Seek;

export type InternalSeekerSettings = { graph: boolean; preview: boolean };

export type SeekerProps = LevaInputProps<InternalSeeker, InternalSeekerSettings>;
