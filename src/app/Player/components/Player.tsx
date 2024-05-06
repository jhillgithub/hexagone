import { Sphere } from "@react-three/drei";
import { PlayerController } from "./PlayerController";
import { useRef } from "react";
import { RapierRigidBody } from "@react-three/rapier";
import { PlayerAudio } from "./PlayerAudio";
import { Mesh } from "three";

export const Player = () => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<Mesh>(null);

  return (
    <group position={[0, 2, 0]}>
      <PlayerController rigidBodyRef={rigidBodyRef}>
        <Sphere castShadow ref={meshRef}>
          <meshPhysicalMaterial
            roughness={0.2}
            color={"lightpink"}
            emissive={"purple"}
            envMapIntensity={0.5}
          />
        </Sphere>
      </PlayerController>
      <PlayerAudio rigidBodyRef={rigidBodyRef} meshRef={meshRef} />
    </group>
  );
};
