import { useControlsContext } from "@/app/Controls/Controls";
import { PositionalAudio } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import { RefObject, useRef } from "react";
import {
  Euler,
  Matrix4,
  Mesh,
  Quaternion,
  Vector3,
  type PositionalAudio as PositionalAudioType,
} from "three";

export const PlayerAudio = ({
  rigidBodyRef,
  meshRef,
}: {
  rigidBodyRef: RefObject<RapierRigidBody>;
  meshRef: RefObject<Mesh>;
}) => {
  /**Controls */
  const { getControls } = useControlsContext();

  /**Sound */
  const engineSoundRef = useRef<PositionalAudioType | null>(null);
  const driftSoundRef = useRef<PositionalAudioType | null>(null);
  const jumpSoundRef = useRef<PositionalAudioType | null>(null);
  const landingSoundRef = useRef<PositionalAudioType | null>(null);

  /**State */
  const didJump = useRef(false);
  const prevPosition = useRef(new Vector3());
  const prevQuaternion = useRef(new Quaternion());

  useFrame(({ scene, camera, raycaster }, delta) => {
    const rigidBody = rigidBodyRef.current;
    if (!rigidBody) return;
    if (!meshRef.current) return;

    /**Engine rev sounds based on linear velocity */
    const linearVelocity = rigidBody.linvel();

    // Convert Rapier Vector to Three.js Vector3
    const linearVelocityVector3 = new Vector3(
      linearVelocity.x,
      0,
      linearVelocity.z
    );

    const linearVelocityMagnitude = linearVelocityVector3.length();
    if (engineSoundRef.current) {
      engineSoundRef.current.setPlaybackRate(
        Math.min(1 + Math.abs(linearVelocityMagnitude) * 0.05, 5)
      );
      engineSoundRef.current.setVolume(
        Math.min(Math.abs(linearVelocityMagnitude) * 0.05, 1.0)
      );
    }

    /** Jumping and landing sound effects */

    // Cast a ray downwards from the RigidBody's position
    const position = rigidBody.translation();
    const raycastOrigin = new Vector3(position.x, position.y, position.z);
    const raycastDirection = new Vector3(0, -1, 0);
    raycaster.set(raycastOrigin, raycastDirection);

    // Check for intersections with the ground
    const intersections = raycaster.intersectObjects(scene.children, true);

    const isNearGround =
      intersections.length > 0 && intersections[0].distance < 1.5;

    const isInAir = intersections.length > 0 && intersections[0].distance > 5;

    const { jump } = getControls();

    // did player jump
    if (isNearGround && jump) {
      jumpSoundRef.current?.setVolume(0.5);

      if (jumpSoundRef.current?.isPlaying) {
        jumpSoundRef.current.stop();
        jumpSoundRef.current.play();
      } else {
        jumpSoundRef.current?.play();
      }
    }

    // check if player jumped high enough to make landing sound
    if (isInAir) {
      didJump.current = true;
    }

    // play landing sound effects
    if (didJump.current && isNearGround) {
      landingSoundRef.current?.setVolume(0.5);

      if (landingSoundRef.current?.isPlaying) {
        landingSoundRef.current.stop();
        landingSoundRef.current.play();
      } else {
        landingSoundRef.current?.play();
      }
      didJump.current = false;
    }

    /**Angular Velocity sound effects */
    const currentPosition = new Vector3().copy(camera.position);
    const currentQuaternion = new Quaternion().copy(camera.quaternion);

    const deltaQuaternion = currentQuaternion
      .clone()
      .multiply(prevQuaternion.current.clone().invert());

    // Convert delta quaternion to Euler angles (YXZ order specifically chosen for this use case)
    const deltaEuler = new Euler().setFromQuaternion(deltaQuaternion, "YXZ");

    // Y component of Euler angles represents the rotation around the Y-axis
    const angleChangeY = deltaEuler.y;
    // console.log(angleChangeY);

    const angularVelocityY = deltaEuler.y / delta;

    // Calculate the distance traveled by the camera between frames
    const positionChange = prevPosition.current.distanceTo(currentPosition);

    // Calculate the angle difference between the previous and current orientations
    const angleChange = prevQuaternion.current.angleTo(currentQuaternion);

    // Update previous camera state for the next frame
    prevPosition.current.copy(currentPosition);
    prevQuaternion.current.copy(currentQuaternion);

    if (driftSoundRef.current) {
      const absRotationSpeed = Math.abs(angularVelocityY);
      // const absRotationSpeed = Math.abs(angleChange);
      // if (absRotationSpeed > 0.005 && isNearGround) {
      if (absRotationSpeed > 0.8 && isNearGround) {
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
            Math.min(
              Math.max(driftSoundRef.current.getVolume() - delta * 2, 0),
              1
            )
          );
        } else {
          driftSoundRef.current.stop();
        }
      }
    }
  });

  return (
    <>
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
