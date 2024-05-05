import { GroupProps, useFrame } from "@react-three/fiber";
import { RigidBody, interactionGroups } from "@react-three/rapier";
import { useCallback, useReducer, useRef } from "react";
import { Mesh, MeshPhysicalMaterial, Vector3 } from "three";
import { useRandomColor } from "../../hooks/useRandomColor";
import {
  TILE_BASE_RADIUS,
  TILE_HEIGHT,
  TILE_TOP_RADIUS,
} from "../constants/gameArenaContants";
import {
  TileActionTypes,
  TileState,
  TileStatus,
  tileReducer,
} from "../reducers/tileReducer";

type FloorTileProps = {
  name: string;
  color: string;
  position: Vector3;
  hexagonSize: number;
} & GroupProps;

const initialState: TileState = { status: TileStatus.IDLE };

export const FloorTile = ({
  name,
  color,
  position,
  hexagonSize,
  ...props
}: FloorTileProps) => {
  const hit = useRef(false);
  const ref = useRef<Mesh>(null);
  const [state, dispatch] = useReducer(tileReducer, initialState);
  const randomizedColor = useRandomColor(color);

  const handleCollision = useCallback(() => {
    if (state.status === TileStatus.IDLE) {
      dispatch({ type: TileActionTypes.COLLIDE });
    }
  }, [state.status]);

  useFrame((_, delta) => {
    if (!ref.current) return;

    const material = ref.current.material as MeshPhysicalMaterial;
    const currentOpacity = material.opacity;
    if (state.status === TileStatus.FADING) {
      const fadeDuration = 0.8; // Target fade duration in seconds
      const decrement = delta / fadeDuration;
      const newOpacity = Math.max(0, material.opacity - decrement);
      material.opacity = newOpacity;
    }

    if (state.status === TileStatus.FADING && currentOpacity <= 0.1) {
      dispatch({ type: TileActionTypes.FADED });
    }
  });

  if (state.status === TileStatus.REMOVED) return null;

  return (
    <group {...props} position={position}>
      <RigidBody
        type="fixed"
        colliders="cuboid"
        // friction={0.05}
        name={name}
        onCollisionEnter={(e) => {
          if (hit.current) return;
          hit.current = true;
          if (e.other?.rigidBodyObject?.name === "Player") {
            handleCollision();
          }
        }}
        // tiles are in group 0 and only collide with groups 1 and 2
        collisionGroups={interactionGroups(0, [1, 2])}
      >
        <mesh ref={ref}>
          <cylinderGeometry
            args={[(0.9 * hexagonSize) / 2, hexagonSize / 2, TILE_HEIGHT, 6]}
          />
          <meshPhysicalMaterial
            roughness={0.25}
            color={hit.current ? "orange" : randomizedColor}
            emissive={randomizedColor}
            envMapIntensity={0.125}
            transparent
          />
        </mesh>
      </RigidBody>
    </group>
  );
};
