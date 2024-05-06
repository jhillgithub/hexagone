import { GameStatus } from "../constants/gameConstants";
import { useGameContext } from "../contexts/GameContext";
import { GameActionTypes } from "./../reducers/gameReducer";

export const useGame = () => {
  const { gameState, dispatchGameActions } = useGameContext();

  const gameIdle = gameState.status === GameStatus.IDLE;
  const gamePlaying = gameState.status === GameStatus.PLAYING;
  const gameOver = gameState.status === GameStatus.GAME_OVER;
  const gameRestart = gameState.status === GameStatus.RESET;

  const startGame = () => {
    dispatchGameActions({ type: GameActionTypes.PLAY });
  };
  const resetGame = () => {
    dispatchGameActions({ type: GameActionTypes.RESTART });
    setTimeout(() => {
      startGame();
    }, 200);
  };
  const pauseGame = () => {
    dispatchGameActions({ type: GameActionTypes.PAUSE });
  };
  const setGameOver = () => {
    dispatchGameActions({ type: GameActionTypes.SET_GAME_OVER });
  };

  return {
    gameIdle,
    gameOver,
    gamePlaying,
    gameRestart,
    startGame,
    setGameOver,
    pauseGame,
    resetGame,
  };
};
