import {
  PositionalAudio,
  Sphere,
  useKeyboardControls,
} from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import {
  RapierRigidBody,
  RigidBody,
  interactionGroups,
} from "@react-three/rapier";
import { useRef, useState } from "react";
import {
  AudioLoader,
  Vector3,
  type PositionalAudio as PositionalAudioType,
} from "three";

export const MovableSphereName = "Player";

export const MovableSphere = () => {
  /**Physics */
  const rigidBody = useRef<RapierRigidBody>(null);
  const canJump = useRef(false);
  const hasJumped = useRef(false);
  const [_, getKeys] = useKeyboardControls();

  /**Game State */
  const [playerDied, setPlayerDied] = useState(false);

  /**Camera */
  const cameraRotation = useRef(0);

  /**Sound */
  const engineSoundRef = useRef<PositionalAudioType | null>(null);
  const driftSoundRef = useRef<PositionalAudioType | null>(null);
  const jumpSoundRef = useRef<PositionalAudioType | null>(null);
  const landingSoundRef = useRef<PositionalAudioType | null>(null);
  // const engineSound = useLoader(AudioLoader, "sound/engine.wav");

  useFrame(({ scene, camera, raycaster }, delta) => {
    if (playerDied) return;
    if (!rigidBody.current) return;
    let forwardSpeed = 0;
    let rotationSpeed = 0;

    const position = rigidBody.current.translation();
    if (position.y < -30) {
      camera.position.set(0, 10, 30);
      setPlayerDied(true);
    }

    const keyboardState = getKeys();

    // Update camera rotation based on "a" and "d" keys
    if (keyboardState.left) {
      cameraRotation.current += delta * 2;
      rotationSpeed = delta * 2;
    }
    if (keyboardState.right) {
      cameraRotation.current -= delta * 2;
      rotationSpeed = -delta * 2;
    }

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
    const jumpStrength = 10.0;

    // Apply force based on camera direction using "w" and "s" keys
    if (keyboardState.forward) {
      impulse.x -= impulseStrength * Math.sin(cameraRotation.current);
      impulse.z -= impulseStrength * Math.cos(cameraRotation.current);
      forwardSpeed = impulseStrength;
    }
    if (keyboardState.backward) {
      impulse.x += impulseStrength * Math.sin(cameraRotation.current);
      impulse.z += impulseStrength * Math.cos(cameraRotation.current);
      forwardSpeed = -impulseStrength;
    }
    if (engineSoundRef.current) {
      engineSoundRef.current.setPlaybackRate(1 + Math.abs(forwardSpeed) * 0.5);
      engineSoundRef.current.setVolume(Math.abs(forwardSpeed) * 0.5);
    }

    // Cast a ray downwards from the RigidBody's position
    const raycastOrigin = new Vector3(position.x, position.y, position.z);
    const raycastDirection = new Vector3(0, -1, 0);
    raycaster.set(raycastOrigin, raycastDirection);

    // Check for intersections with the ground
    const intersections = raycaster.intersectObjects(scene.children, true);
    const isNearGround =
      intersections.length > 0 && intersections[0].distance < 1.5;

    // Update the drift sound based on the rotation speed and proximity to the ground
    if (driftSoundRef.current) {
      const absRotationSpeed = Math.abs(rotationSpeed);
      if (absRotationSpeed > 0 && isNearGround) {
        if (!driftSoundRef.current.isPlaying) {
          driftSoundRef.current.play();
        }
        const volumeFactor = 10;
        const targetVolume = Math.min(absRotationSpeed * volumeFactor, 0.8);

        // Fade in the drift sound
        if (driftSoundRef.current.getVolume() < targetVolume) {
          driftSoundRef.current.setVolume(
            Math.min(
              driftSoundRef.current.getVolume() + delta * 2,
              targetVolume
            )
          );
        }
      } else {
        // Fade out the drift sound
        if (driftSoundRef.current.getVolume() > 0) {
          driftSoundRef.current.setVolume(
            Math.max(driftSoundRef.current.getVolume() - delta * 2, 0)
          );
        } else {
          driftSoundRef.current.stop();
        }
      }
    }

    if (isNearGround) {
      canJump.current = true;
      if (hasJumped.current) {
        if (landingSoundRef.current) {
          if (landingSoundRef.current.isPlaying) {
            landingSoundRef.current.stop();
          }
          if (!keyboardState.jump) {
            landingSoundRef.current.setVolume(0.5);
            landingSoundRef.current.play();
          }
        }
        hasJumped.current = false;
      }
    } else {
      canJump.current = false;
    }

    if (keyboardState.jump && canJump.current) {
      impulse.y = jumpStrength;
      hasJumped.current = true;

      jumpSoundRef.current?.setVolume(0.5);

      if (jumpSoundRef.current?.isPlaying) {
        jumpSoundRef.current.stop();
        jumpSoundRef.current.play();
      } else {
        jumpSoundRef.current?.play();
      }

      if (driftSoundRef.current?.isPlaying) {
        driftSoundRef.current.stop();
      }
    }

    rigidBody.current.applyImpulse(impulse, true);
  });

  if (playerDied) return null;

  return (
    <>
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
      <PositionalAudio
        ref={engineSoundRef}
        url="/sound/engine.mp3"
        autoplay
        loop
        distance={1000}
      />
      <PositionalAudio
        ref={jumpSoundRef}
        url="/sound/jump.mp3"
        loop={false}
        distance={1000}
      />
      <PositionalAudio
        ref={driftSoundRef}
        url="/sound/drifting.mp3"
        loop
        distance={1000}
      />
      <PositionalAudio
        ref={landingSoundRef}
        url="/sound/landing.mp3"
        loop={false}
        distance={1000}
      />
    </>
  );
};
