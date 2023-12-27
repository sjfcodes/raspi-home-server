import { Server, Socket } from "socket.io";
import { CHANNEL } from "../../../constant/constant";
import { Esp32Client, Esp32ClientMap } from "../../../types/main";

export const clientMap: Esp32ClientMap = {};

export const setEsp32Client = (client: Esp32Client, io?: Server, socket?: Socket) => {
    if (client === undefined) {
        console.error(new Error("client must be defined"));
        return;
    }

    if (!client.chipId) {
        console.error(new Error("client.chipId must be defined"));
        return;
    }

    let history = clientMap[client.chipId as string]?.tempFHistory || [];
    if (client?.tempF) {
        if (!history.length) history.push(client?.tempF);
        else {
            history = [client.tempF, ...history.slice(0, 59)]
        }
    }

    const tempAverage = (history.reduce((acc, curr) => acc + curr, 0) / history.length).toFixed(0);

    clientMap[client.chipId as string] = {
        chipId: client?.chipId,
        chipName: client?.chipName,
        tempF: Number(tempAverage),
        tempFHistory: history,
        updatedAt: new Date().toLocaleTimeString(),
    };

    if (socket) {
        socket.broadcast.emit(CHANNEL.ESP32_TEMP_CLIENT_MAP, clientMap);
    } else if (io) {
        io.emit(CHANNEL.ESP32_TEMP_CLIENT_MAP, clientMap);
    }

    console.log("EMIT: ", CHANNEL.ESP32_TEMP_CLIENT_MAP, JSON.stringify(clientMap));
};