import { useMemo } from "react";
import { MovableSphere } from "./MovableSphere";
import { KeyboardControls } from "@react-three/drei";

export const Player = () => {
  const map = useMemo(
    () => [
      { name: "forward", keys: ["ArrowUp", "KeyW"] },
      { name: "backward", keys: ["ArrowDown", "KeyS"] },
      { name: "left", keys: ["ArrowLeft", "KeyA"] },
      { name: "right", keys: ["ArrowRight", "KeyD"] },
      { name: "jump", keys: ["Space"] },
    ],
    []
  );
  return (
    <KeyboardControls map={map}>
      <group position={[0, 2, 0]}>
        <MovableSphere />
      </group>
    </KeyboardControls>
  );
};

{
  /* <RigidBody */
}
//   name="player"
//   colliders="ball"
//   restitution={0.75}
//   linearDamping={0.5}
//   friction={0.1}
//   collisionGroups={interactionGroups(1, [0, 1, 2])}
// >
//   <Sphere position={[0, 10, 0]}>
//     <meshStandardMaterial color="blue" />
//   </Sphere>
// </RigidBody>
