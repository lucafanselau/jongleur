export const isSome = <T>(some: T | undefined | null): some is T => {
  return some !== undefined && some !== null;
};

export const isNone = <T>(none: T | undefined | null): none is null | undefined => !isSome<T>(none);

export const rangesOverlap = (a: [number, number], b: [number, number]) => {
  if (b[0] < a[0]) return b[1] > a[0];
  else return b[0] < a[1];
};

export const clamp = (value: number, min: number, max: number) => (value > max ? max : value < min ? min : value);
export const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

export const range = (start: number, end: number): number[] => Array.from({ length: end - start }, (_, k) => k + start);

export const omitUndefined = <T extends Record<string, any>>(t: T): T =>
  Object.fromEntries(Object.entries(t).filter(([_, v]) => isSome(v))) as T;

export const spreadWithUndefined = <T extends Record<string, any>>(t: (Partial<T> | undefined)[]) =>
  t.reduce((prev, t) => ({ ...prev, ...omitUndefined(t ?? {}) } as T), {} as T) as T;

export const pick = <T extends Record<string, any>, K extends keyof T>(t: T, keys: K[]): Pick<T, K> =>
  Object.fromEntries(Object.entries(t).filter(([k, _]) => keys.includes(k as K))) as Pick<T, K>;
