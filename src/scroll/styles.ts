export const fullscreenStyle = {
  width: "100%",
  height: "100%",
  top: "0px",
  left: "0px"
};

export const containerStyle = {
  ...fullscreenStyle,
  position: "absolute",
  overflowY: "auto"
};

export const stickyStyle = {
  ...fullscreenStyle,
  position: "sticky",
  zIndex: "1",
  overflow: "hidden",
  pointerEvents: "none"
};

export const scrollStyle = {
  pointerEvents: "none",
  width: "100%",
  position: "relative"
};

export const applyStyle = (style: Record<string, string>, element: HTMLElement) => {
  (Object.keys(style) as (keyof typeof style)[]).forEach(
    // @ts-expect-error this is very unsafe, since there are read-only properties in style, this is just used
    // as a utility so caller beware
    key => void (element.style[key] = style[key])
  );
};
