import { ROOM_TEMP_DEFAULT_STATE } from "../../../../constant/constant";
import { RoomTempState } from "../../../../types/main";
import SseDataStream from "../../lib/SseDataStream";
import { log } from "../../utils/general";
import { server } from "../server";

const path = "/api/home/temperature/target";
const stream = new SseDataStream(server, path, ROOM_TEMP_DEFAULT_STATE);

const setRoomTempState = (newState: RoomTempState) => {
    const state = stream.getState();
    if (newState === undefined) {
        console.error(new Error("newState must be defined"));
        return;
    }

    if (!newState.max || !newState.min) {
        console.error(
            new Error(`unexpected state: ${JSON.stringify(newState)}`)
        );
        return;
    }

    if (newState.max < newState.min) {
        console.error(new Error("max must be >= min"));
        return;
    }

    stream.setState(newState);
    stream.publish(state);
    log(path, "status", state);
};

server.post(path, (req, res) => {
    if (req.body) setRoomTempState(req.body);
    res.status(200).send({ message: "ok" });
});

// [NOTE] must export & call this function in index.ts BEFORE server.listen()
export function initHomeTargetTemp() {
    log(path, "start");
}

export const roomTemperatureStream = stream;
