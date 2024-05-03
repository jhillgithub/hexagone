import { Sphere, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  RapierRigidBody,
  RigidBody,
  interactionGroups,
} from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";

export const MovableSphereName = "Player";

export const MovableSphere = () => {
  const rigidBody = useRef<RapierRigidBody>(null);
  const canJump = useRef(false);
  const [_, getKeys] = useKeyboardControls();
  const [playerDied, setPlayerDied] = useState(false);
  const cameraRotation = useRef(0);

  useFrame(({ camera }, delta) => {
    if (playerDied) return;
    if (!rigidBody.current) return;

    const position = rigidBody.current.translation();
    if (position.y < -30) {
      camera.position.set(0, 10, 30);
      setPlayerDied(true);
    }

    const keyboardState = getKeys();

    // Update camera rotation based on "a" and "d" keys
    if (keyboardState.left) cameraRotation.current += delta * 2;
    if (keyboardState.right) cameraRotation.current -= delta * 2;

    // Calculate camera position based on rotation
    const cameraDistance = 8;
    const cameraX =
      position.x + cameraDistance * Math.sin(cameraRotation.current);
    const cameraZ =
      position.z + cameraDistance * Math.cos(cameraRotation.current);
    const targetPosition = { x: cameraX, y: position.y + 2, z: cameraZ };

    // Linear interpolation for smooth camera movement
    const lerpFactor = Math.min(1, 0.1 * delta * 60);
    camera.position.lerp(targetPosition, lerpFactor);

    // Ensure the camera always looks at the sphere
    camera.lookAt(position.x, position.y, position.z);

    const impulse = { x: 0, y: 0, z: 0 };
    const impulseStrength = 1.0;
    const jumpStrength = 42;

    // Apply force based on camera direction using "w" and "s" keys
    if (keyboardState.forward) {
      impulse.x -= impulseStrength * Math.sin(cameraRotation.current);
      impulse.z -= impulseStrength * Math.cos(cameraRotation.current);
    }
    if (keyboardState.backward) {
      impulse.x += impulseStrength * Math.sin(cameraRotation.current);
      impulse.z += impulseStrength * Math.cos(cameraRotation.current);
    }

    if (keyboardState.jump && canJump.current) {
      impulse.y += jumpStrength;
      canJump.current = false;
    }

    rigidBody.current.applyImpulse(impulse, true);
  });

  if (playerDied) return null;

  return (
    <RigidBody
      ref={rigidBody}
      colliders="ball"
      restitution={0.01}
      linearDamping={0.42}
      friction={0.05}
      name={MovableSphereName}
      collisionGroups={interactionGroups(1, [0, 1, 2])}
      onCollisionEnter={() => {
        canJump.current = true;
      }}
      onCollisionExit={() => {
        canJump.current = false;
      }}
    >
      <Sphere>
        <meshPhysicalMaterial
          roughness={0.2}
          color={"lightpink"}
          emissive={"purple"}
          envMapIntensity={0.5}
        />
      </Sphere>
    </RigidBody>
  );
};
