import type { RefCallback } from "react";
import type { InheritSymbol } from "./utils";
import type { ClipConfig, ObjectConfig } from "./config";

// Field Definitions
export type FieldDefinition<Target, Store> = {
  apply: (target: Target, a: Store, b: Store, alpha: number) => void;
};

export type FieldsBase = { [K: string]: FieldDefinition<any, any> };

/**
 * Utility type used to get the apply function for a specific field (K)
 **/
type ApplyFunctionForField<Fields extends FieldsBase, K extends keyof Fields> = Fields[K]["apply"];
/**
 * Utility type used to get the Store type of a specific field (K)
 **/
type StoreFromFields<Fields extends FieldsBase, K extends keyof Fields> = Parameters<
  ApplyFunctionForField<Fields, K>
>[1];

/**
 * Utility Type to the field target for an object (Obj) in the Scene (specified by Base)
 **/
export type TargetFromBase<
  Fields extends FieldsBase,
  Base extends StateBase<Fields>,
  Obj extends keyof Base
> = ApplyFunctionForField<Fields, Extract<keyof Base[Obj], keyof Fields>> extends (i: infer I, ...other: any[]) => void
  ? I
  : never;

/**
 * Typing for the definition of the Base scene
 *
 * This is generic over the specific Fields (which mostly should be `typeof defaultFields` from `./fields.ts`)
 **/
export type StateBase<Fields extends FieldsBase> = {
  [K: string]: { [F in keyof Fields]?: StoreFromFields<Fields, F> } & { config?: ObjectConfig };
};

/**
 * Utility type to extract keys of a union
 **/
type Keys<T> = T extends { [key: string]: any } ? keyof T : never;

/**
 * Custom Base Guard, that verifies that the custom Base onlu uses known fields
 * otherwise a template string is returned of the form `[unknown-fields: ]` + (wrong keys)
 **/
export type BaseGuard<Fields extends FieldsBase, Base extends StateBase<Fields>> = Keys<Base[keyof Base]> extends
  | keyof Fields
  | "config"
  ? Base
  : `[unknown-fields]: ${Exclude<Keys<Base[keyof Base]>, keyof Fields | "config">}`;

export type FieldKeyframeState<T> = { value: T; config: ClipConfig };

type ObjectKeyframe<T extends object> = {
  [K in keyof T]?: FieldKeyframeState<T[K]> | typeof InheritSymbol;
};

export type KeyframeDefinition<Fields extends FieldsBase, Base extends StateBase<Fields>> = {
  [O in keyof Base]: { [T: number]: ObjectKeyframe<Omit<Base[O], "config">> };
};

/**
 * A clip represents a single transition sequence for a Field Store
 **/
export type Clip<Store = any> = {
  start: [number, Store];
  end: [number, Store];
  config: Required<ClipConfig>;
};

/**
 * The parsed keyframes, that are computed by the orchestrate function.
 **/
export type Keyframes<Fields extends FieldsBase, Base extends StateBase<Fields>> = {
  [O in keyof Base]: {
    clips: { [K in keyof Base[O]]: Clip<Base[O][K]>[] };
    fields: (keyof Base[O])[];
  };
};

/**
 * The type for the register callback .This is a function, that for every object (Obj) in the scene returns a RefCallback
 * of the required TargetType (inferred through the `TargetFromBase` utility). If the object specifies multiple fields to
 * be modified, this will be the Intersection type of all fields
 **/
export type Register<Fields extends FieldsBase, Base extends StateBase<Fields>> = <Obj extends keyof Base>(
  obj: Obj,
  id?: string
) => RefCallback<TargetFromBase<Fields, Base, Obj>>;

export type HandleProgress = (progress: number) => void;

// Utility types

/**
 * This type returns all objects in `Base` which would be satisfied by type `Target`. This is a really helpful type
 * if you want to define reusable functionality for a scene object and only want the caller to be able to provide
 * object with a specific target type.
 *
 * For future reference this type is loosely inspired by:
 * https://stackoverflow.com/questions/60291002/can-typescript-restrict-keyof-to-a-list-of-properties-of-a-particular-type
 **/
export type ObjectsForTarget<Target, Fields extends FieldsBase, Base extends StateBase<Fields>> = {
  // for all keys in T
  [K in keyof Base]: Target extends TargetFromBase<Fields, Base, K> ? K : never; // if the value of this key is a string, keep it. Else, discard it
  // Get the union type of the remaining values.
}[keyof Base];
