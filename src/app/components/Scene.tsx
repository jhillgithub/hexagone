import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { RaceTrack } from "../GameArena/components/RaceTrack";
import { Player } from "../Player/components/Player";
import { useGame } from "../hooks/useGame";

export const Scene = () => {
  const { gameIdle, gameOver, gameRestart } = useGame();
  if (gameIdle || gameRestart) return null;
  return (
    <Canvas shadows camera={{ position: [0, 10, 30], fov: 55 }}>
      <color attach="background" args={["#0f0f0f"]} />
      <Environment files={"/hdrs/neon_photostudio_1k.hdr"} />
      <Physics debug={false} paused={gameOver} timeStep="vary">
        <group position={[100, -1, -30]} rotation={[0, Math.PI / 2, 0]}>
          <RaceTrack />
        </group>
        <group>
          <Player />
        </group>
      </Physics>
      {gameOver && <OrbitControls />}
    </Canvas>
  );
};
