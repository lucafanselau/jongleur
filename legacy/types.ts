import type { RefCallback } from "react";
import type { Interpolation } from "./interpolation";
import type { AnyField, ExpectedType, ObjectStore, StoreTypes } from "./states";

export type ValidScene = { [key: string]: AnyField };
export type State<Scene extends ValidScene> = {
  [K in keyof Scene]: ObjectStore<Scene[K]>;
};

// **********************
// Keyframe Definition
export type DefinitionField<Target> = {
  target: Target;
  interp: Interpolation;
};

type StateDefinition<Fields extends AnyField> = {
  [K in Fields]?: DefinitionField<StoreTypes[K]>;
};

export type ObjectTimelineDefinition<Fields extends AnyField> = {
  [T: number]: StateDefinition<Fields>;
};

export type TimelineDefinition<Scene extends ValidScene> = {
  [K in keyof Scene]: ObjectTimelineDefinition<Scene[K]>;
};

// ************************
// Keyframes

export type Keyframe<Fields extends AnyField> = {
  interpolations: {
    [field in Fields]?: Interpolation;
  };
  state: ObjectStore<Fields>;
};

export type Timeline<Fields extends AnyField> = {
  [T: number]: Keyframe<Fields>;
};

export type KeyframesObject<Fields extends AnyField> = {
  timeline: Timeline<Fields>;
  frames: number[];
  base: ObjectStore<Fields>;
  active: [from: number, to: number][];
};

export type Keyframes<Scene extends ValidScene> = {
  /**
   * A timeline for each object
   */
  objects: {
    [E in keyof Scene]: KeyframesObject<Scene[E]>;
  };
  /**
   * An iterable for all of the objects of the scene
   */
  allObjects: (keyof Scene)[];
};

// ************************
// Ref Struct

export type Refs<Scene extends ValidScene> = {
  [K in keyof Scene]?: ExpectedType<Scene[K]>;
};

export type KeyframeRefs<Scene extends ValidScene> = <K extends keyof Scene>(
  key: K
) => RefCallback<ExpectedType<Scene[K]>>;

// ************************
// Utility type
export type Vec = { x: number; y: number; z: number };
