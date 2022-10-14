import type { RefCallback } from "react";
import type { Object3D } from "three";
import type { InheritSymbol } from "./clip";

// Field Definitions
export type FieldDefinition<Target, Store> = {
  apply: (target: Target, store: Store) => void;
  interpolate: (a: Store, b: Store, alpha: number) => Store;
};

export type FieldsBase = { [K: string]: FieldDefinition<any, any> };

/**
 * Utility type used to get the apply function for a specific field (K)
 **/
type ApplyFunctionForField<Fields extends FieldsBase, K extends keyof Fields> = Fields[K]["apply"];
/**
 * Utility type used to get the Store type of a specific field (K)
 **/
type StoreFromFields<Fields extends FieldsBase, K extends keyof Fields> = Parameters<ApplyFunctionForField<Fields, K>>[1];

/**
 * Utility Type to the field target for an object (Obj) in the Scene (specified by Base)
 **/
export type TargetFromBase<
  Fields extends FieldsBase,
  Base extends StateBase<Fields>,
  Obj extends keyof Base
  // @ts-ignore I know, I know, but try to convince typescript that `keyof Base[Obj]` extends `keyof Fields` (The inference works btw)
> = ApplyFunctionForField<Fields, keyof Base[Obj]> extends (i: infer I, ...other: any[]) => void ? I : never;

/**
 * Typing for the definition of the Base scene
 *
 * This is generic over the specific Fields (which mostly should be `typeof defaultFields` from `./fields.ts`)
 **/
export type StateBase<Fields extends FieldsBase> = {
  [K: string]: { [F in keyof Fields]?: StoreFromFields<Fields, F> };
};

type PartialOrInherit<T extends object> = {
  [K in keyof T]?: T[K] | typeof InheritSymbol;
};

export type KeyframeDefinitionBase<Fields extends FieldsBase, Base extends StateBase<Fields>> = {
  [O in keyof Base]: { [T: number]: PartialOrInherit<Base[O]> };
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

// Utility types

/**
 * This type returns all objects in `Base` which have an Object3D target
 *
 * Unfortunately due to the `extends Object3D` this cannot detect if the base requires additional restrictions
 * on the target type
 *
 * For future reference this type is inspired by:
 * https://stackoverflow.com/questions/60291002/can-typescript-restrict-keyof-to-a-list-of-properties-of-a-particular-type
 **/
export type Object3DTargets<Fields extends FieldsBase, Base extends StateBase<Fields>> = {
  // for all keys in T
  [K in keyof Base]: TargetFromBase<Fields, Base, K> extends Object3D ? K : never; // if the value of this key is a string, keep it. Else, discard it
  // Get the union type of the remaining values.
}[keyof Base];
