import { Server, Socket } from "socket.io";
import { CHANNEL, THERMOSTAT } from "../../../constant/constant";
import { Thermostat, ThermostatMap } from "../../../types/main";
import { getSortedObject } from "../utils/general";
import { emitStateUpdate } from "../websocket/emit";

export let clientMapState: ThermostatMap = {};

export const setEsp32Client = (
  client: Thermostat,
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
    const formatted = Math.trunc(client?.tempF);
    if (!history.length) history.push(formatted);
    else {
      history = [formatted, ...history.slice(0, 59)];
    }
  }

  const tempAverage = Math.trunc(
    history.reduce((acc, curr) => acc + curr, 0) / history.length
  );

  clientMapState = getSortedObject({
    ...clientMapState,
    [client.chipId]: {
      chipId: client.chipId,
      // @ts-ignore
      chipName: THERMOSTAT[client.chipId] || client.chipName,
      tempF: tempAverage,
      calibrate: client.calibrate || 0,
      updatedAt: new Date().toLocaleTimeString(),
      tempFHistory: history,
    },
  });

  // clientMapState[client.chipId as string] = {
  //   chipId: client.chipId,
  //   chipName: client.chipName,
  //   tempF: tempAverage,
  //   calibrate: client.calibrate || 0,
  //   updatedAt: new Date().toLocaleTimeString(),
  //   tempFHistory: history,
  // };

  emitStateUpdate(CHANNEL.THERMOSTAT_MAP, clientMapState, io, socket);
};
