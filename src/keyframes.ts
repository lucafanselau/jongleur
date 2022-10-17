import { InheritSymbol } from "./clip";
import { Interpolation } from "./interpolation";
import { createStore } from "./store";
import type {
  Clip,
  FieldDefinition,
  FieldsBase,
  KeyframeDefinitionBase,
  Keyframes,
  Register,
  StateBase
} from "./types";

export const createField = <Target, Store>(
  apply: (obj: Target, value: Store) => void,
  interpolate: (a: Store, b: Store, alpha: number) => Store
): FieldDefinition<Target, Store> => ({ apply, interpolate });

/**
 * This converts the keyframe definitions into the usable keyframes
 **/
export const parseKeyframes = <
  Fields extends FieldsBase,
  Base extends StateBase<Fields>,
  KeyframeDefintion extends KeyframeDefinitionBase<Fields, Base>
>(
  base: Base,
  definition: KeyframeDefintion
): [(keyof Base)[], Keyframes<Fields, Base>] => {
  // loop over all object
  const objects = Object.keys(base) as (keyof Base)[];

  const keyframes = objects.reduce<Keyframes<Fields, Base>>((acc, current) => {
    // get the fields for the base state (those are the animated fields)
    const fields: string[] = Object.keys(base[current]);

    // build the clips
    // first we construct an empty list of clips for every _field_ and then we populate it
    // while traversing the keyframe definitions
    const clips = fields.reduce<Record<string, Clip[]>>((acc, field) => ({ ...acc, [field]: [] }), {});
    // this is the data stucture that is used to build new clips during the traversal
    // as a default all fields have an implicit start at `t = 0` with the base state
    const clipStack = fields.reduce<Record<string, Clip["start"]>>(
      (acc, field) => ({ ...acc, [field]: [0, base[current][field]] }),
      {}
    );

    // check the definitions for the object
    const def = definition[current];

    // now traverse the keyframes
    Object.entries(def)

      // since javascript doesn't really have number keys, we have to parse them first
      .map(([key, frame]) => [parseFloat(key), frame] as const)
      // and we have to sort by the time, so that the clips are built predictably
      .sort(([a], [b]) => a - b)
      .forEach(([time, frame]) => {
        // and go through all fields
        Object.entries(frame).forEach(([field, value]) => {
          if (value === InheritSymbol) {
            // Inherit symbol represents a reset of clipStack
            clipStack[field] = [time, clipStack[field][1]];
          } else {
            const [end, interpolation] = value as [any, Interpolation];
            // insert the new clip
            clips[field].push({
              start: clipStack[field],
              end: [time, end],
              interpolation
            });
            // and reset the clip stack
            clipStack[field] = [time, end];
          }
        });
      });

    return {
      ...acc,
      [current]: clips
    };
  }, {} as Keyframes<Fields, Base>);

  return [objects, keyframes];
};

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

    // Parse the keyframes

    // wauw, such easy
    const register: Register<Fields, Base> =
      (obj, id = "default") =>
      target => {
        store.getState().setSlot(obj, target, id);
      };

    store.subscribe(console.log);

    return [0, register];
  };
