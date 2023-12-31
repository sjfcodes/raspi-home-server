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

  clientMapState = getSortedObject({
    ...clientMapState,
    [client.chipId]: {
      chipId: client.chipId,
      // @ts-ignore
      chipName: THERMOSTAT[client.chipId] || client.chipName,
      tempF: Math.trunc(client?.tempF),
      calibrate: client.calibrate || 0,
      updatedAt: new Date().toLocaleTimeString(),
    },
  });

  emitStateUpdate(CHANNEL.THERMOSTAT_MAP, clientMapState, io, socket);
};
