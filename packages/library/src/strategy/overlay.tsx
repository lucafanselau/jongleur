import { useThree } from "@react-three/fiber";
import { FC, ReactNode } from "react";

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
};
