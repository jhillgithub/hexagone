"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Experience } from "./Experience";
import { Controls } from "./Controls/Controls";

const Hexagone = () => {
  const [startGame, setStartGame] = useState(false);

  if (!startGame)
    return (
      <div className="w-screen h-screen grid place-content-center">
        <Button onClick={() => setStartGame(true)}>Start Game</Button>
      </div>
    );

  return (
    <div className="w-screen h-screen">
      <Controls>
        <Experience />
      </Controls>
    </div>
  );
};

export default Hexagone;
