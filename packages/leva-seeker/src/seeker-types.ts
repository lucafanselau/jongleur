import type { LevaInputProps, InternalVectorSettings, MergedInputWithSettings } from "leva/plugin";
import type { Seek } from "jongleur";

export type SeekerSettings = { graph?: boolean; preview?: boolean };
export type SeekedInput = MergedInputWithSettings<Seek, SeekerSettings, "handles">;

export type InternalSeeker = [number, number, number, number] & { evaluate(value: number): number; cssEasing: string };

export type DisplayValueSeeker = { x1: number; y1: number; x2: number; y2: number };

export type InternalSeekerSettings = { graph: boolean; preview: boolean };

export type SeekerProps = LevaInputProps<InternalSeeker, InternalSeekerSettings, DisplayValueSeeker>;
