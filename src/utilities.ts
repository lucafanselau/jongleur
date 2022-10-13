export const isSome = <T>(some: T | undefined | null): some is T => {
  return some !== undefined && some !== null;
};

export const isNone = <T>(
  none: T | undefined | null
): none is null | undefined => !isSome<T>(none);
