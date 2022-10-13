import type { AnyField, ObjectStore } from "./states";
import type {
  Keyframe,
  Keyframes,
  State,
  TimelineDefinition,
  ValidScene,
} from "./types";

/**
 * Orchestrate a set of keyframes used for animation
 *
 * @param base The base state for the elements
 * @param timelines The definition for the single keyframes
 * @returns A parsed version of the keyframes, usable by the other hooks
 */
export const createKeyframes = <Base extends { [K: string]: {  } }(
  base: State<Scene>,
  timelines: TimelineDefinition<Scene>
): Keyframes<Scene> => {
  const allObjects: (keyof Scene)[] = Object.keys(base);

  type Objects = Keyframes<Scene>["objects"];

  const objects = allObjects.reduce<Objects>((prev, curr) => {
    type Object = Objects[keyof Scene];
    const timelineDefinition = timelines[curr];

    const objBase = base[curr];
    const active: Object["active"] = [];

    const keyframes: number[] = Object.keys(timelineDefinition).map(Number);
    keyframes.sort();
    const timeline = keyframes.reduce<Object["timeline"]>(
      (frames, frame, index) => {
        const def = timelineDefinition[frame];

        let prev: ObjectStore<Scene[keyof Scene]>;
        let prevKeyframe;
        if (index === 0) {
          prev = objBase;
          prevKeyframe = 0;
        } else {
          prevKeyframe = keyframes[index - 1];
          prev = frames[prevKeyframe].state;
        }

        const fields = Object.keys(def) as Scene[keyof Scene][];
        if (fields.length === 0) {
          return {
            ...frames,
            [frame]: {
              state: prev,
              interpolations: {},
            },
          };
        }

        // When there is something set active state
        active.push([prevKeyframe, frame]);

        // New state for this keyframe
        const state = { ...prev };
        const interpolations: Keyframe<Scene[keyof Scene]>["interpolations"] =
          {};
        fields.forEach((f) => {
          if (def[f]) {
            state[f] = def[f]!.target;
            interpolations[f] = def[f]!.interp;
          }
        });

        return {
          ...frames,
          [frame]: {
            state,
            interpolations,
          },
        };
      },
      {}
    );

    return {
      ...prev,
      [curr]: {
        base: objBase,
        frames: keyframes,
        active,
        timeline,
      },
    };
  }, {} as Objects);

  return {
    objects,
    allObjects,
  };
};

const create = <
  S extends { [O: string]: { [K in AnyField]?: number } },
  Keyframes extends { [O in keyof S]: { [frame: number]: S[O] } }
>(
  _s: S,
  _keyframes: Keyframes
) => {};

create(
  {
    camera: {
      position: 0,
    },
    other: {
      intensity: 1,
    },
  },
  {
    camera: {
      0: {
        position: 4,
      },
    },
    other: {
      20: {
        intensity: 2,
      },
    },
  }
);
