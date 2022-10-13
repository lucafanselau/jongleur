import { RefCallback } from "react";
type FieldDefinition<Target, Store> = {
  apply: (obj: Target, value: Store) => void;
  interpolate: (a: Store, b: Store, alpha: number) => Store;
};
export type FieldsBase = { [K: string]: FieldDefinition<any, any> };

export const createField = <Target, Store>(
  apply: (obj: Target, value: Store) => void,
  interpolate: (a: Store, b: Store, alpha: number) => Store
): FieldDefinition<Target, Store> => ({ apply, interpolate });

type TargetFromFields<
  Fields extends FieldsBase,
  K extends keyof Fields
> = Parameters<Fields[K]["apply"]>[1];
type ApplyFunctionForField<
  Fields extends FieldsBase,
  Key extends keyof Fields
> = Fields[Key]["apply"];

type ObjectFromBase<
  Fields extends FieldsBase,
  Base extends StateBase<Fields>,
  Obj extends keyof Base
  // NOTE: I know, I know, but try to convince typescript that `keyof Base[Obj]` extends `keyof Fields`
  // The inference works btw
  // @ts-ignore
> = ApplyFunctionForField<Fields, keyof Base[Obj]> extends (
  i: infer I,
  ...other: any[]
) => void
  ? I
  : never;

type StateBase<Fields extends FieldsBase> = {
  [K: string]: { [F in keyof Fields]?: TargetFromFields<Fields, F> };
};

type KeyframeDefinitionBase<
  Fields extends FieldsBase,
  Base extends StateBase<Fields>
> = {
  [O in keyof Base]: { [T: number]: Base[O] };
};

type Register<Fields extends FieldsBase, Base extends StateBase<Fields>> = <
  Obj extends keyof Base
>(
  obj: Obj
) => ObjectFromBase<Fields, Base, Obj>;

export const createOrchestrate =
  <Fields extends FieldsBase>(fields: Fields) =>
  <
    Base extends StateBase<Fields>,
    KeyframeDefintion extends KeyframeDefinitionBase<Fields, Base>
  >(
    base: Base,
    defintion: KeyframeDefintion
  ): [number, Register<Fields, Base>] => {
    // @ts-ignore
    return [0, 0];
  };
