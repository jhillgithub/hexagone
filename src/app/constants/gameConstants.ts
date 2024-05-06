import { GameState } from "../reducers/gameReducer";

export enum GameStatus {
  IDLE = "IDLE",
  PLAYING = "PLAYING",
  GAME_OVER = "GAME_OVER",
  RESET = "RESET",
}
export const INITIAL_GAME_STATE: GameState = {
  status: GameStatus.IDLE,
};
