import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Joystick } from "react-joystick-component";
import { useControlsContext } from "./Controls/Controls";
import { RaceTrack } from "./GameArena/components/RaceTrack";
import { Player } from "./Player/components/Player";

export const Experience = () => {
  const { handleJoystickMove, handleJoystickStop } = useControlsContext();

  return (
    <div className="w-full h-full relative">
      <Canvas shadows camera={{ position: [0, 10, 30], fov: 55 }}>
        <color attach="background" args={["#0f0f0f"]} />
        <Environment files={"/hdrs/neon_photostudio_1k.hdr"} />
        <Physics debug={false} timeStep="vary">
          <group position={[100, -1, -30]} rotation={[0, Math.PI / 2, 0]}>
            <RaceTrack />
          </group>
          <group>
            <Player />
          </group>
        </Physics>
        <OrbitControls />
      </Canvas>
      <div className="absolute bottom-8 left-8">
        <Joystick
          throttle={100}
          move={handleJoystickMove}
          stop={handleJoystickStop}
        />
      </div>
    </div>
  );
};
