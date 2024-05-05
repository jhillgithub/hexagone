import { MovableSphere } from "./MovableSphere";

export const Player = () => {
  return (
    <group position={[0, 2, 0]}>
      <MovableSphere />
    </group>
  );
};
