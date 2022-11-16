import type { FC, ReactNode } from "react";
import { useContext, useLayoutEffect } from "react";
import { useStore } from "zustand";
import { isNone, isSome } from "../utils";
import { scrollContext } from "./context";
import { At, Html } from "./html";

export type SnapsProps = {
  /**
   * The points at which the snaps points should occur,
   * the viewport space between the points is linearly filled depending on the `align` property
   * If 'center', the container begins and ends halway between the points
   * If 'start', the empty space is filled from the point until the next point, for 'end' its a backward fill
   */
  points: number[];
  /**
   * Maps to https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-align
   * Also controls how the space between the points is shared
   *
   * Defaults to 'center'
   */
  align?: "center" | "start" | "end";
  /**
   * Controls snap type https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type
   *
   * Defaults to 'mandatory'
   */
  snapType?: "mandatory" | "proximity";
  /**
   * An optional marker, that gets positioned to indicate the scroll snap to the user
   * position is dependent on the `align` property
   */
  marker?: (point: number, index: number) => ReactNode;
};

/**
 * Scroll.Snaps enables to define snap points on a scroll pane (via the scroll controler)
 *
 * ScrollSnaps are implemented via the css scrollSnap API https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Scroll_Snap
 */
export const Snaps: FC<SnapsProps> = ({ points, snapType = "mandatory", align = "center", marker }) => {
  const store = useContext(scrollContext);
  const layout = useStore(store, s => s.layout);

  // apply the style to the container
  useLayoutEffect(() => {
    // and mount children to the filled attribute
    if (isNone(layout)) return;

    const { container } = layout;
    // enable scrollSnap on main container
    container.style.scrollSnapType = `y ${snapType}`;
    return () => {
      // also reset container configuration
      container.style.scrollSnapType = "none";
    };
  }, [layout, snapType]);

  return (
    <Html>
      {points.map((point, index) => (
        <At at={point} key={`scroll-snap-${point}`} container={{ style: { scrollSnapAlign: align, width: "100%" } }}>
          {isSome(marker) && marker(point, index)}
        </At>
      ))}
    </Html>
  );
};
