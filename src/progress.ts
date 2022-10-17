import type { Clip, FieldsBase, Keyframes, StateBase } from "./types";

// Main driving force, find active clips for the
const findActiveClips = <Fields extends FieldsBase, Base extends StateBase<Fields>>(
  progress: [number, number],
  objects: (keyof Base)[],
  keyframes: Keyframes<Fields, Base>
): { object: keyof Base; field: keyof Fields; clip: Clip }[] =>
  objects.flatMap(object =>
    (Object.entries(keyframes[object]) as [keyof Fields, Clip[]][]).flatMap(([field, clips]) =>
      clips
        .map(clip => ({ object, field, clip }))
        .reduce((prev, { current: clip }) => {
          // This is the main part, we check if the
          const clipRange = [current.start[0], current.end[1]];

          return current;
        })
    )
  );
