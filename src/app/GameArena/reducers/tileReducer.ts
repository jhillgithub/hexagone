export enum TileStatus {
  IDLE = "IDLE",
  FADING = "FADING",
  REMOVED = "REMOVED",
}

export type TileState = {
  status: TileStatus;
};

export enum TileActionTypes {
  COLLIDE = "COLLIDE",
  FADED = "FADED",
}

type TileAction = { type: TileActionTypes };

export const tileReducer = (
  state: TileState,
  action: TileAction
): TileState => {
  switch (action.type) {
    case "COLLIDE":
      return { ...state, status: TileStatus.FADING };
    case "FADED":
      return { ...state, status: TileStatus.REMOVED };
    default:
      return state;
  }
};
