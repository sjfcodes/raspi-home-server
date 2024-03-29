import { Socket } from "socket.io";
import { CHANNEL, THERMOSTAT } from "../../../../constant/constant";
import { Thermostat, ThermostatMap } from "../../../../types/main";
import { getSortedObject } from "../../utils/general";
import { emitStateUpdate } from "../websocket/emit";

export let clientMapState: ThermostatMap = {};

export const setEsp32Client = (client: Thermostat, socket?: Socket) => {
  if (client === undefined) {
    console.error(new Error("client must be defined"));
    return;
  }

  if (!client.chipId) {
    console.error(new Error("client.chipId must be defined"));
    return;
  }

  const maxLen = 60;
  const temp = Math.trunc(client.tempF);
  let tempFHistory = clientMapState[client.chipId]?.tempFHistory || [];
  if (tempFHistory.length < maxLen) tempFHistory.unshift(temp);
  else tempFHistory = [temp, ...tempFHistory.slice(0, maxLen - 1)];

  const tempAverage =
    tempFHistory.reduce((acc, curr) => acc + curr, 0) / tempFHistory.length;

  clientMapState = getSortedObject({
    ...clientMapState,
    [client.chipId]: {
      chipId: client.chipId,
      // @ts-ignore
      chipName: THERMOSTAT[client.chipId] || client.chipName,
      tempF: Math.trunc(tempAverage),
      calibrate: client.calibrate || 0,
      updatedAt: new Date().toLocaleTimeString(),
      tempFHistory,
    },
  });

  emitStateUpdate(CHANNEL.THERMOSTAT_MAP, clientMapState, socket);
};
