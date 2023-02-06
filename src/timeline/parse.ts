/**
 * @file Parse keyframes into clips, this is achieved using an `orchestrate` function
 **/
import type { ClipStore } from "../store";
import { createClipStore } from "../store";
import { isNone, isSome, pick, spreadWithUndefined } from "../utils";
import type { ClipConfig, ClipsConfig, ObjectConfig } from "./config";
import { defaultClipConfig, defaultObjectConfig } from "./config";
import type { DefaultFields } from "./fields";
import { defaultFields } from "./fields";
import type {
  BaseGuard,
  Clip,
  FieldKeyframeState,
  FieldsBase,
  KeyframeDefinition,
  Keyframes,
  StateBase
} from "./types";
import { Inherit } from "./utils";

/**
 * This converts the keyframe definitions into the usable keyframes
 **/
export const parseTimeline = <
  Fields extends FieldsBase,
  Base extends StateBase<Fields>,
  KeyframeDefintion extends KeyframeDefinition<Fields, Base>
>(
  fields: Fields,
  base: Base,
  definition: KeyframeDefintion,
  config: Required<ObjectConfig>
): [(keyof Base)[], Keyframes<Fields, Base>, number] => {
  // loop over all object
  const fieldNames = Object.keys(fields) as (keyof Fields)[];
  const objects = Object.keys(base) as (keyof Base)[];
  let lastFrame = 0;

  const keyframes = objects.reduce<Keyframes<Fields, Base>>((acc, current) => {
    // get the fields for the base state (those are the animated fields)
    const { config: objectConfig, ...rest } = base[current];
    const objectFields: (keyof Fields)[] = Object.keys(rest);

    // build the clips
    // first we construct an empty list of clips for every _field_ and then we populate it
    // while traversing the keyframe definitions
    const clips = objectFields.reduce<Record<keyof Fields, Clip[]>>(
      (acc, field) => ({ ...acc, [field]: [] }),
      {} as Record<keyof Fields, Clip[]>
    );
    // this is the data stucture that is used to build new clips during the traversal
    // as a default all fields have an implicit start at `t = 0` with the base state
    const clipStack = objectFields.reduce<Record<keyof Fields, Clip["start"]>>(
      (acc, field) => ({ ...acc, [field]: [0, base[current][field]] }),
      {} as Record<keyof Fields, Clip["start"]>
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
        (Object.entries(frame) as [keyof Fields, FieldKeyframeState<any> | typeof Inherit][])
          // only consider the fields which are actually fields
          .filter(([field]) => fieldNames.includes(field))
          .forEach(([field, value]) => {
            if (isNone(value)) return;
            if (value === Inherit) {
              // Inherit symbol represents a reset of clipStack
              clipStack[field] = [time, clipStack[field][1]];
              return;
            }
            let state, frameConfig;
            // NOTE: This is what test what kind of object we have, hopefully this is robust enough
            if (typeof value === "object" && "value" in value) {
              state = value.value;
              frameConfig = value.config;
            } else {
              state = value;
            }

            const {
              config: fieldConfig,
              store: { convert }
            } = fields[field];

            // Config is created by falling back onto the higher level configs
            // this is a bit weirder then it should be, since this approach does not work with undefine's as object values
            const clipConfig = pick(
              spreadWithUndefined<Required<ClipConfig>>([config, objectConfig, fieldConfig ?? {}, frameConfig ?? {}]) ??
                config,
              Object.keys(defaultClipConfig) as (keyof ClipConfig)[]
            );

            // convert the entry type to the store type (this is the part where the convert api is used)
            const [startTime, startValue] = clipStack[field];

            // insert the new clip
            clips[field].push({
              start: [startTime, convert(startValue)],
              end: [time, convert(state)],
              config: clipConfig
            });
            // and reset the clip stack
            clipStack[field] = [time, state];
            // ...else, we don't really know what to do, but typescript should have yelled at them before hand, sooo
          });
      });

    return {
      ...acc,
      [current]: {
        clips,
        fields: objectFields,
        config: spreadWithUndefined([config, objectConfig])
      }
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
export const createTimeline =
  <Fields extends FieldsBase>(fields: Fields) =>
  <Base extends StateBase<Fields>>(
    _base: Base & BaseGuard<Fields, Base>,
    definition: KeyframeDefinition<Fields, Base>,
    config: ClipsConfig
  ): ClipStore<Fields, Base> => {
    const base = _base as Base;
    // Start by parsing the keyframes
    const [objects, keyframes, length] = parseTimeline(fields, base, definition, {
      ...defaultObjectConfig,
      ...config
    });

    // NOTE: store is returned to the user, so lifetime management could be a problem
    const store = createClipStore<Fields, Base>({
      fields,
      objects,
      keyframes,
      // @ts-ignore Don't want to convince typescript right now that the type is not "{}". Why can't we have fancy builder patterns
      state: objects.reduce(
        (acc, curr) => ({
          ...acc,
          [curr]: Object.keys(base[curr]).reduce((acc, curr) => {
            if (curr === "config") return acc;
            return { ...acc, [curr]: { store: undefined } };
          }, {})
        }),
        {}
      ),
      base,
      length: config.length ?? length
    });

    return store;
  };

/**
 * The default orchestration function using the fields
 *
 * This is a specalization of the `createOrchestrate` function, tailored to be suitable in
 * most r3f context
 *
 * @param base       - The base definition of the scene
 * @param definition - The keyframes that define the timeline
 * @param total      - The length of the timeline, if not provided its the key of the last frame
 **/
export const timeline: <Base extends StateBase<DefaultFields>>(
  _base: Base & BaseGuard<DefaultFields, Base>,
  definition: KeyframeDefinition<DefaultFields, Base>,
  config: ClipsConfig
) => ClipStore<DefaultFields, Base> = createTimeline<DefaultFields>(defaultFields);
