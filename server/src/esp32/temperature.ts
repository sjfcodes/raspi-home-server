import { Server, Socket } from "socket.io";
import { CHANNEL } from "../../../constant/constant";
import { Esp32ClientMap, Esp32ClientState } from "../../../types/main";
import { emitStateUpdate } from "../websocket/emit";

export const clientMapState: Esp32ClientMap = {};

export const setEsp32Client = (
  client: Esp32ClientState,
  io?: Server,
  socket?: Socket
) => {
  if (client === undefined) {
    console.error(new Error("client must be defined"));
    return;
  }

  if (!client.chipId) {
    console.error(new Error("client.chipId must be defined"));
    return;
  }

  let history = clientMapState[client.chipId as string]?.tempFHistory || [];
  if (client?.tempF) {
    if (!history.length) history.push(client?.tempF);
    else {
      history = [client.tempF, ...history.slice(0, 59)];
    }
  }

  const tempAverage = (
    history.reduce((acc, curr) => acc + curr, 0) / history.length
  ).toFixed(0);

  clientMapState[client.chipId as string] = {
    chipId: client.chipId,
    chipName: client.chipName,
    tempF: Number(tempAverage),
    calibrate: client.calibrate || -5,
    updatedAt: new Date().toLocaleTimeString(),
    tempFHistory: history,
  };

  emitStateUpdate(CHANNEL.ESP32_TEMP_CLIENT_MAP, clientMapState, io, socket);
};
