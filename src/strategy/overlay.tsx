import { useThree } from "@react-three/fiber";
import { FC, ReactNode, useEffect } from "react";
import { Fragment } from "react";
import type { HandleProgress } from "../types";

/**
 * The ScrollOverlay is a scrollable container next to the canvas
 *
 * This implementation is inspired and loosely based on @react-three/drei's `ScrollControls`
 */
export const ScrollOverlay: FC<{ children: ReactNode; pages: number; progress: HandleProgress }> = ({
  children,
  pages,
  progress
}) => {
  const {
    setEvents,
    gl: { domElement }
  } = useThree();

  const target = domElement.parentNode;

  useEffect(() => {
    // try to render something into element
    const p = document.createElement("p");

    p.textContent = "Hello World";

    const style = {
      position: "absolute",
      width: "100%",
      height: "100%",
      top: "0",
      left: "0"
    };

    (Object.keys(style) as (keyof typeof style)[]).forEach(
      key => void (p.style[key as keyof typeof style] = style[key])
    );

    target?.appendChild(p);

    return () => {
      target?.removeChild(p);
    };
  });

  return <Fragment>{children}</Fragment>;
};
