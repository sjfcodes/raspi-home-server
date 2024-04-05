import { ROOM_TEMP_DEFAULT_STATE } from "../../../../constant/constant";
import { RoomTempState } from "../../../../types/main";
import SseDataStream from "../../lib/SseDataStream";
import { log } from "../../utils/general";
import { server } from "../server";

let state = ROOM_TEMP_DEFAULT_STATE;
const path = "/api/home/temperature/target";
const stream = new SseDataStream(server, path, state);

export const setRoomTempState = (newState: RoomTempState) => {
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
        state = newState;
    }
    stream.publish(state);
};

// [NOTE] must export & call this function in index.ts BEFORE server.listen()
export function initHomeTargetTemp() {
  log(path, "start");
}

export const roomTempState = state;
