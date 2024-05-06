import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Joystick } from "react-joystick-component";
import { useControlsContext } from "./Controls/Controls";
import { RaceTrack } from "./GameArena/components/RaceTrack";
import { Player } from "./Player/components/Player";
import { Button } from "@/components/ui/button";

export const Experience = () => {
  const {
    handleJoystickMove,
    handleJoystickStop,
    handleJumpButtonDown,
    handleJumpButtonUp,
  } = useControlsContext();

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
        {/* <OrbitControls /> */}
      </Canvas>
      <div className="absolute inset-x-0 bottom-20">
        <div className="container flex justify-between items-center gap-x-24">
          <Joystick
            throttle={100}
            move={handleJoystickMove}
            stop={handleJoystickStop}
          />
          <Button
            className="bg-[#3d59ab] rounded-3xl rotate-45"
            onMouseDown={handleJumpButtonDown}
            onMouseUp={handleJumpButtonUp}
          >
            Jump
          </Button>
        </div>
      </div>
    </div>
  );
};
