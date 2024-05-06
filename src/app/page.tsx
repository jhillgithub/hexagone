"use client";
import { Controls } from "./Controls/Controls";
import { GameOverOverlay } from "./UI/components/GameOverOverlay";
import { Lobby } from "./UI/components/Lobby";
import { Experience } from "./components/Experience";
import { GameContextProvider } from "./contexts/GameContext";

const Hexagone = () => {
  return (
    <div className="relative w-screen h-screen">
      <GameContextProvider>
        <Lobby />
        <Controls>
          <Experience />
        </Controls>
        <GameOverOverlay />
      </GameContextProvider>
    </div>
  );
};

export default Hexagone;
