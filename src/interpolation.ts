export type Interpolation =
  // The function y=x
  | "linear"
  // Standard Easing function
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  // 1 ∀scrollDistance: scrollDistance > transitionBegin else 0
  | "start"
  // 0 ∀scrollDistance: scrollDistance < transitionEnd else 1
  | "end";

/**
 * Get the interpolation function for a linear offset between 0..1
 */
export const interpolate = (type: Interpolation, value: number) => {
  switch (type) {
    case "linear":
      return value;
    case "start":
      return value > 0 ? 1 : 0;
    case "end":
      return value < 1 ? 0 : 1;
    // Cool website for easing functions (https://easings.net/de); We will use quad for now
    case "ease-in":
      return value * value;
    case "ease-out":
      return 1 - (1 - value) * (1 - value);
    case "ease-in-out":
      return value < 0.5
        ? 2 * value * value
        : 1 - (-2 * value + 2) ** 2 / 2;
  }
};
