import { io } from "socket.io-client";
import { CHANNEL } from "../../../constant/constant";
export const socket = io();

const logEnabled = {
  [CHANNEL.HEATER_CAB_0]: false,
  [CHANNEL.THERMOSTAT_MAP]: false,
  [CHANNEL.PI_TEMP]: false,
  [CHANNEL.TARGET_TEMP]: false,
  [CHANNEL.LOG_STREAM]: false,
};

export const socketLogger = (
  channel: CHANNEL,
  message: string | null = null,
  data: any = null,
) => {
  if (logEnabled[channel]) {
    console.log(`${channel}:`, message, data);
  }
};
