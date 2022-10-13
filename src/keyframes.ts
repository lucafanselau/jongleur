import { createStore } from "./store";
import type { FieldDefinition, FieldsBase, KeyframeDefinitionBase, Register, StateBase } from "./types";
import { isSome } from "./utilities";

export const createField = <Target, Store>(
  apply: (obj: Target, value: Store) => void,
  interpolate: (a: Store, b: Store, alpha: number) => Store
): FieldDefinition<Target, Store> => ({ apply, interpolate });

/**
 * Create a new orchestration function that allows for custom fields to be included in the scene
 *
 * You probably want to use the provided `orchestrate` function from the library. This function is intended
 * for advanced use cases, where the default fields provided in `./fields.ts` are not enough.
 *
 * You can refer to the top-level guide in `README.md` or look at the default implementation of this function in `field.ts` for usage
 * examples
 **/
export const createOrchestrate =
  <Fields extends FieldsBase>(fields: Fields) =>
  <Base extends StateBase<Fields>, KeyframeDefintion extends KeyframeDefinitionBase<Fields, Base>>(
    base: Base,
    defintion: KeyframeDefintion
  ): [any, Register<Fields, Base>] => {
    // NOTE: store is returned to the user, so lifetime management could be a problem
    const store = createStore<Fields, Base>();

    // wauw, such easy
    const register: Register<Fields, Base> = obj => target => {
      if (isSome(target)) store.getState().setSlot(obj, target);
    };

    return [0, register];
  };
