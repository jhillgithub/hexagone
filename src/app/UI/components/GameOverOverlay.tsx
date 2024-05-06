import { useGame } from "@/app/hooks/useGame";
import { Button } from "@/components/ui/button";
import React from "react";

export const GameOverOverlay = () => {
  const { gameOver, resetGame } = useGame();
  if (gameOver)
    return (
      <div className="absolute w-screen h-screen inset-0 z-10 grid place-content-center">
        <div className="flex flex-col gap-6">
          <h1 className="text-teal-200 text-6xl">Game Over!</h1>
          <Button
            className="bg-teal-200"
            variant={"outline"}
            onClick={resetGame}
          >
            Play Again?
          </Button>
        </div>
      </div>
    );
};
