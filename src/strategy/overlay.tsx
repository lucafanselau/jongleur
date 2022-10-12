import { useThree } from "@react-three/fiber";
import type { FC, ReactNode } from "react";
import { Fragment } from "react";

/**
 * The ScrollOverlay is a
 */
export const ScrollOverlay: FC<{ children: ReactNode; pages: number }> = ({
  children,
  pages,
}) => {
  const {
    gl: { domElement },
  } = useThree();

  return <Fragment></Fragment>;
};
