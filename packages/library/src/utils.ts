import type { Interpolation } from "./interpolation";
import type { AnyField, ObjectStore, StoreTypes } from "./states";
import type { State, ValidScene, Vec } from "./types";

/**
 * Get the offsetTop with regards to the page
 *
 * This calculated the offset recursively, so use with caution?
 */
export const getOffsetTop = (el?: HTMLElement): number => {
  // recursive anchor
  if (!el) return 0;
  return getOffsetTop(el.offsetParent as HTMLElement) + el.offsetTop;
};

/**
 * Applies a state to an object
 *
 * NOTE: This does not perform type checking, every field in state is expected to be present
 * in *to* as well, type checking is performed at the api layer
 */
// TODO: JUST REMOVE!
// export const applyState = (to: RefSlot<StateField>, state: StateField) => {
//   Object.entries<FieldTypes>(state).forEach(([field, value]) => {
//     if (field === "time") {
//       to.mixer?.setTime(value as number);
//     } else {
//       if (!to.element) return;
//       const target = to.element[field as keyof StateField] as FieldTypes;
//       if (target instanceof Vector3 || target instanceof Euler) {
//         const v = value as Vector3 | Euler;
//         // console.log(`setting ${field} to `, value);
//         target.set(v.x, v.y, v.z);
//       } else {
//         // For now target === number | boolean
//         (to[field as keyof StateField] as FieldTypes) = target;
//       }
//     }
//   });
// };

/**
 * Deep copy function for TypeScript.
 * @template T Generic type of target/copied value.
 * @param target Target value to be copied.
 * @see Source project, ts-deepcopy https://github.com/ykdr2017/ts-deepcopy
 * @see Code pen https://codepen.io/erikvullings/pen/ejyBYg
 */
export const deepCopy = <T>(target: T): T => {
  if (target === null)
    return target;

  if (target instanceof Date)
    return new Date(target.getTime()) as any;

  if (Array.isArray(target)) {
    const cp = [] as any[];
    (target as any[]).forEach((v) => {
      cp.push(v);
    });
    return cp.map((n: any) => deepCopy<any>(n)) as any;
  }
  if (typeof target === "object") {
    const cp = { ...(target as { [key: string]: any }) } as {
      [key: string]: any;
    };
    Object.keys(cp).forEach((k) => {
      cp[k] = deepCopy<any>(cp[k]);
    });
    return cp as T;
  }
  return target;
};

export const vec = {
  xyz: (x: number, y: number, z: number): Vec => ({ x, y, z }),
  scalar: (s: number): Vec => ({ x: s, y: s, z: s }),
  zero: () => ({ x: 0, y: 0, z: 0 }),
};

export const lerp = (v0: number, v1: number, alpha: number): number =>
  (1 - alpha) * v0 + alpha * v1;

export const lerpVec = (target: Vec, from: Vec, to: Vec, alpha: number) => {
  target.x = lerp(from.x, to.x, alpha);
  target.y = lerp(from.y, to.y, alpha);
  target.z = lerp(from.z, to.z, alpha);
};

export const deepLoopState = <Scene extends ValidScene>(
  state: State<Scene>,
  objects: (keyof Scene)[],
  cb: (obj: string, field: AnyField, value: StoreTypes[AnyField]) => void,
) => {
  objects.forEach((obj) => {
    const objStore = state[obj] as ObjectStore<AnyField>;
    Object.entries<StoreTypes[AnyField]>(objStore).forEach(([name, value]) =>
      cb(obj as string, name as Scene[keyof Scene], value),
    );
  });
};

export const clip = {
  scale: (from: number, to: number, value: Vec, interp: Interpolation) => ({
    [from]: {},
    [to]: {
      scale: { target: value, interp },
    },
  }),

  position: (from: number, to: number, value: Vec, interp: Interpolation) => ({
    [from]: {},
    [to]: {
      position: { target: value, interp },
    },
  }),

  intensity: (
    from: number,
    to: number,
    value: number,
    interp: Interpolation,
  ) => ({
    [from]: {},
    [to]: {
      intensity: { target: value, interp },
    },
  }),

  opacity: (
    from: number,
    to: number,
    value: number,
    interp: Interpolation,
  ) => ({
    [from]: {},
    [to]: {
      opacity: { target: value, interp },
    },
  }),
};

export const overlayRange = (a: [number, number], b: [number, number]) => {
  if (b[0] < a[0])
    return b[1] > a[0];
   else
    return b[0] < a[1];
};
