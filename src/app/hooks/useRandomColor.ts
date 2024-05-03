import { useMemo } from "react";
import { Color } from "three";
import { randFloat } from "three/src/math/MathUtils.js";

export const useRandomColor = (color: string) => {
  return useMemo(() => {
    const alteredColor = new Color(color);
    alteredColor.multiplyScalar(randFloat(0.25, 1.2));
    return alteredColor;
  }, [color]);
};
