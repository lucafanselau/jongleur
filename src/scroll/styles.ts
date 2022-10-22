export const fullscreenStyle = {
  width: "100%",
  height: "100%",
  top: "0",
  left: "0"
};

export const containerStyle = {
  ...fullscreenStyle,
  position: "absolute",
  overflowY: "auto"
};

export const applyStyle = (style: Record<string, string>, element: HTMLElement) => {
  (Object.keys(style) as (keyof typeof style)[]).forEach(
    // @ts-expect-error this is very unsafe, since there are read-only properties in style, this is just used
    // as a utility so caller beware
    key => void (element.style[key] = style[key])
  );
};
