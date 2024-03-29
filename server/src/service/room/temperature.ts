import { Socket } from "socket.io";
import {
  CHANNEL,
  ROOM_TEMP_DEFAULT_STATE,
} from "../../../../constant/constant";
import { RoomTempState } from "../../../../types/main";
import { emitStateUpdate } from "../websocket/emit";

export let roomTempState = ROOM_TEMP_DEFAULT_STATE;

export const setRoomTempState = (newState: RoomTempState, socket?: Socket) => {
  if (newState === undefined) {
    console.error(new Error("newState must be defined"));
    return;
  }

  if (!newState.max || !newState.min) {
    console.error(
      new Error("unexpected room temp state: " + JSON.stringify(newState))
    );
    return;
  }

  // only set new state if valid
  if (newState.max >= newState.min) {
    roomTempState = newState;
  }

  emitStateUpdate(CHANNEL.TARGET_TEMP, roomTempState, socket);
};
