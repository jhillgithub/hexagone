import { Sphere } from "@react-three/drei";
import { RapierRigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { Mesh } from "three";
import { PlayerAudio } from "./PlayerAudio";
import { PlayerController } from "./PlayerController";
import { useMobile } from "@/app/hooks/useMobile";

export const Player = () => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<Mesh>(null);
  useMobile();

  return (
    <group position={[0, 10, 0]}>
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
