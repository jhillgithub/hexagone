import { useControlsContext } from "@/app/Controls/Controls";
import { useGame } from "@/app/hooks/useGame";
import { useFrame } from "@react-three/fiber";
import {
  RapierRigidBody,
  RigidBody,
  interactionGroups,
} from "@react-three/rapier";
import { ReactNode, RefObject, useMemo, useRef } from "react";
import { Vector3 } from "three";

export const name = "Player";
const baseImpulseStrength = 4 * 60;
const baseRotationStrength = 1 * 60;
const baseJumpStrength = 60;
const cameraDistance = 10;
const heightOffset = 5;

type PlayerControllerProps = {
  rigidBodyRef: RefObject<RapierRigidBody>;
  children: ReactNode;
};

export const PlayerController = ({
  rigidBodyRef,
  children,
}: PlayerControllerProps) => {
  /**Game State */
  const { gameOver, gameRestart, setGameOver } = useGame();

  /** Physics */
  const { getControls } = useControlsContext();
  const canJump = useRef(false);
  const stopUseFrame = useRef(false);
  const targetCameraPosition = useMemo(() => new Vector3(), []);
  const lookDirection = useMemo(() => new Vector3(), []);

  useFrame(({ camera }, delta) => {
    if (gameOver || gameRestart || stopUseFrame.current) return;

    const rigidBody = rigidBodyRef.current;
    if (!rigidBody) return;

    const { forward, backward, left, right, jump } = getControls();

    // Calculate the camera's look direction
    camera.getWorldDirection(lookDirection);
    lookDirection.y = 0;

    // Apply movement impulses based on forward and backward controls
    const impulseStrength = baseImpulseStrength * delta;
    const impulse = new Vector3();
    if (forward) {
      impulse.copy(lookDirection).multiplyScalar(impulseStrength);
    }
    if (backward) {
      impulse.copy(lookDirection).multiplyScalar(-impulseStrength);
    }

    rigidBody.applyImpulse(impulse, true);

    // Handle left and right rotation of the camera around the sphere
    const spherePosition = rigidBody.translation();
    if (spherePosition.y < -10) {
      camera.position.set(250, 500, 0);
      camera.lookAt(new Vector3());
      stopUseFrame.current = true;
      setGameOver();
      return;
    }

    let cameraDirection = camera.position.clone().sub(spherePosition);

    // Rotate around the y-axis for left and right controls
    const rotationInterpolation = baseRotationStrength * delta;
    if (left) {
      cameraDirection.applyAxisAngle(
        new Vector3(0, 1, 0),
        rotationInterpolation
      );
    }
    if (right) {
      cameraDirection.applyAxisAngle(
        new Vector3(0, 1, 0),
        -rotationInterpolation
      );
    }

    // Normalize the direction and multiply by the desired camera distance
    cameraDirection.normalize().multiplyScalar(cameraDistance);

    // Set the target position with the specified height offset
    targetCameraPosition.set(
      spherePosition.x + cameraDirection.x,
      spherePosition.y + heightOffset,
      spherePosition.z + cameraDirection.z
    );

    // Smoothly interpolate the camera position using lerp
    camera.position.lerp(targetCameraPosition, 0.1);

    camera.lookAt(spherePosition.x, spherePosition.y, spherePosition.z);

    // Apply jump if grounded
    if (canJump.current && jump) {
      const upwardImpulse = new Vector3(0, baseJumpStrength, 0);
      rigidBody.applyImpulse(upwardImpulse, true);
      // Disable further jumping until grounded again
      canJump.current = false;
    }
  });

  if (gameRestart) return null;
  return (
    <>
      <RigidBody
        type="dynamic"
        ref={rigidBodyRef}
        colliders="ball"
        restitution={0.01}
        linearDamping={1}
        name={name}
        collisionGroups={interactionGroups(1, [0, 1, 2])}
        onCollisionEnter={() => {
          canJump.current = true;
        }}
        onCollisionExit={() => {
          canJump.current = false;
        }}
      >
        {children}
      </RigidBody>
    </>
  );
};
