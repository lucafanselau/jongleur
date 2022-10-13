import type { RefCallback } from "react";

// Field Definitions
export type FieldDefinition<Target, Store> = {
  apply: (target: Target, store: Store) => void;
  interpolate: (a: Store, b: Store, alpha: number) => Store;
};

export type FieldsBase = { [K: string]: FieldDefinition<any, any> };

/**
 * Utility type used to get the apply function for a specific field (K)
 **/
type ApplyFunctionForField<
  Fields extends FieldsBase,
  K extends keyof Fields
> = Fields[K]["apply"];
/**
 * Utility type used to get the Store type of a specific field (K)
 **/
type StoreFromFields<
  Fields extends FieldsBase,
  K extends keyof Fields
> = Parameters<ApplyFunctionForField<Fields, K>>[1];

/**
 * Utility Type to the field target for an object (Obj) in the Scene (specified by Base)
 **/
export type TargetFromBase<
  Fields extends FieldsBase,
  Base extends StateBase<Fields>,
  Obj extends keyof Base
  // @ts-ignore I know, I know, but try to convince typescript that `keyof Base[Obj]` extends `keyof Fields` (The inference works btw)
> = ApplyFunctionForField<Fields, keyof Base[Obj]> extends (
  i: infer I,
  ...other: any[]
) => void
  ? I
  : never;

/**
 * Typing for the definition of the Base scene
 *
 * This is generic over the specific Fields (which mostly should be `typeof defaultFields` from `./fields.ts`)
 **/
export type StateBase<Fields extends FieldsBase> = {
  [K: string]: { [F in keyof Fields]?: StoreFromFields<Fields, F> };
};

export type KeyframeDefinitionBase<
  Fields extends FieldsBase,
  Base extends StateBase<Fields>
> = {
  [O in keyof Base]: { [T: number]: Base[O] };
};

/**
 * The type for the register callback .This is a function, that for every object (Obj) in the scene returns a RefCallback
 * of the required TargetType (inferred through the `TargetFromBase` utility). If the object specifies multiple fields to
 * be modified, this will be the Intersection type of all fields
 **/
export type Register<
  Fields extends FieldsBase,
  Base extends StateBase<Fields>
> = <Obj extends keyof Base>(
  obj: Obj
) => RefCallback<TargetFromBase<Fields, Base, Obj>>;
