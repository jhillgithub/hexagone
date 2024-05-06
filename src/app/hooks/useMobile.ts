import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { PerspectiveCamera } from "three";

export const useMobile = (
  threshhold = 768,
  mobileFov = 90,
  desktopFov = 55
) => {
  const { camera } = useThree();
  const [fov, setFov] = useState(
    window.innerWidth < threshhold ? mobileFov : desktopFov
  );
  const [isMobile, setIsMobile] = useState(window.innerWidth < threshhold);

  useEffect(() => {
    const handleResize = () => {
      const smallScreen = window.innerWidth < threshhold;
      setFov(smallScreen ? mobileFov : desktopFov);
      setIsMobile(smallScreen);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useFrame(() => {
    if (camera instanceof PerspectiveCamera && camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  });
  return { fov, isMobile };
};
