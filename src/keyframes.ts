import { InheritSymbol } from "./clip";
import type { Interpolation } from "./interpolation";
import { applyClip, findActiveClip, findLastClip } from "./progress";
import { createStore } from "./store";
import type {
  Clip,
  FieldDefinition,
  FieldsBase,
  HandleProgress,
  KeyframeDefinitionBase,
  Keyframes,
  Register,
  StateBase
} from "./types";
import { isSome } from "./utils";

export const createField = <Target, Store>(
  apply: (obj: Target, a: Store, b: Store, alpha: number) => void
): FieldDefinition<Target, Store> => ({ apply });

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
): [(keyof Base)[], Keyframes<Fields, Base>, number] => {
  // loop over all object
  const objects = Object.keys(base) as (keyof Base)[];
  let lastFrame = 0;

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
        if (time > lastFrame) lastFrame = time;
        // and go through all fields
        Object.entries(frame).forEach(([field, value]) => {
          if (value === InheritSymbol) {
            // Inherit symbol represents a reset of clipStack
            clipStack[field] = [time, clipStack[field][1]];
          } else if (Array.isArray(value)) {
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
          // ...else, we don't really know what to do, but typescript should have yelled at them before hand, sooo
        });
      });

    return {
      ...acc,
      [current]: { clips, fields }
    };
  }, {} as Keyframes<Fields, Base>);

  return [objects, keyframes, lastFrame];
};

/**
 * Create a new orchestration function that allows for custom fields to be included in the scene
 *
 * You probably want to use the provided `orchestrate` function from the library. This function is intended
 * for advanced use cases, where the default fields provided in `./fields.ts` are not enough.
 *
 * You can refer to the top-level guide in `README.md` or look at the default implementation of this function in `field.ts` for usage
 * examples
 *
 **/
export const createOrchestrate =
  <Fields extends FieldsBase>(fields: Fields) =>
  <Base extends StateBase<Fields>, KeyframeDefintion extends KeyframeDefinitionBase<Fields, Base>>(
    base: Base,
    definition: KeyframeDefintion,
    length?: number
  ): [HandleProgress, Register<Fields, Base>] => {
    // Start by parsing the keyframes
    const [objects, keyframes, lastFrame] = parseKeyframes(base, definition);

    // NOTE: store is returned to the user, so lifetime management could be a problem
    const store = createStore<Fields, Base>({ fields, objects, keyframes, length: length ?? lastFrame });

    // wauw, such easy
    const register: Register<Fields, Base> =
      (obj, id = "default") =>
      target => {
        // Update the slot in the store
        const {
          setSlot,
          keyframes,
          length,
          progress: { last }
        } = store.getState();
        setSlot(obj, target, id);
        const progress = length * last;

        // and apply the state at lastProgress
        keyframes[obj].fields.forEach(field => {
          // do all of the fields
          const clips = keyframes[obj].clips[field];
          const clip = findLastClip(progress, clips);
          if (isSome(clip)) applyClip(fields[field as keyof Fields], target, clip, progress);
        });
      };

    // Some notes about why the stuff in here is sane:
    // Since we applied the `progress.last` state to
    const progress: HandleProgress = progress => {
      const {
        updateProgress,
        length,
        objects,
        slots,
        keyframes,
        progress: { last }
      } = store.getState();

      // apply the updates, applicable to range
      const range: [number, number] = [last * length, progress * length];

      objects.forEach(o =>
        keyframes[o].fields.forEach(field => {
          const clips = keyframes[o].clips[field];

          const considered = findActiveClip(range, clips);
          if (isSome(considered)) {
            // -> means, we find a clip that should be applied, for the current progress, so lets apply that to all registered
            Object.values(slots[o] ?? {}).forEach(target => {
              applyClip(fields[field as keyof Fields], target, considered, progress);
            });
          }
        })
      );

      updateProgress(progress);
    };

    return [progress, register];
  };
