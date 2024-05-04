"use client";
import React, { useState } from "react";
import { Experience } from "./Experience";
import { SoundButton } from "./UI/components/SoundButton";
import { Button } from "@/components/ui/button";

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
      <Experience />
    </div>
  );
};

export default Hexagone;
