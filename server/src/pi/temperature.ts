import { readFileSync } from "node:fs";
import { Server } from "socket.io";
import { CHANNEL } from "../../../constant/constant";
import { PiTemp } from "../../../types/main";
import { emitStateUpdate } from "../websocket/emit";

export const setPiTemp = (io: Server) => {
  const temp = Number(
    readFileSync("/sys/class/thermal/thermal_zone0/temp", { encoding: "utf8" })
  );
  const data = {
    tempC: 0,
    tempF: 0,
    message: "default",
    updatedAt: new Date().toLocaleTimeString(),
  } as PiTemp;
  if (isNaN(temp)) {
    data.message = "temp must be number";
  } else {
    const tempC = Math.trunc(temp / 1000);
    data.tempC = tempC;
    data.tempF = Math.trunc((tempC * 9) / 5 + 32);
    data.message = "ok";
  }

  emitStateUpdate(CHANNEL.PI_TEMP, data, io);
};
