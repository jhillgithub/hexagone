import { useGame } from "@/app/hooks/useGame";
import { Button } from "@/components/ui/button";

export const Lobby = () => {
  const { gameIdle, startGame } = useGame();
  if (gameIdle)
    return (
      <div className="w-screen h-screen grid place-content-center">
        <Button onClick={startGame}>Start Game</Button>
      </div>
    );
};
