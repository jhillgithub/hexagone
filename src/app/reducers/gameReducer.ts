import { GameStatus, INITIAL_GAME_STATE } from "./../constants/gameConstants";

export type GameState = {
  status: GameStatus;
};

export enum GameActionTypes {
  RESTART = "RESTART",
  PLAY = "PLAY",
  PAUSE = "PAUSE",
  SET_GAME_OVER = "SET_GAME_OVER",
}

export type GameAction = { type: GameActionTypes };

export const gameReducer = (
  state: GameState,
  action: GameAction
): GameState => {
  switch (action.type) {
    case GameActionTypes.RESTART: {
      return { ...INITIAL_GAME_STATE, status: GameStatus.RESET };
    }
    case GameActionTypes.PLAY: {
      return { ...state, status: GameStatus.PLAYING };
    }
    case GameActionTypes.SET_GAME_OVER: {
      return { ...state, status: GameStatus.GAME_OVER };
    }
    default:
      return state;
  }
};
