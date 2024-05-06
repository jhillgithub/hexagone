import { ReactNode, createContext, useContext, useReducer } from "react";
import { INITIAL_GAME_STATE } from "../constants/gameConstants";
import { GameAction, GameState, gameReducer } from "../reducers/gameReducer";

type GameContextType = {
  gameState: GameState;
  dispatchGameActions: React.Dispatch<GameAction>;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error(
      "useGameContext must be used inside of a GameContextProvider"
    );
  }
  return context;
};

export const GameContextProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, dispatchGameActions] = useReducer(
    gameReducer,
    INITIAL_GAME_STATE
  );

  return (
    <GameContext.Provider value={{ gameState, dispatchGameActions }}>
      {children}
    </GameContext.Provider>
  );
};
