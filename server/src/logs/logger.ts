import { appendFileSync, readFileSync } from "node:fs";
import { Server, Socket } from "socket.io";
import { CHANNEL } from "../../../constant/constant";
import { emitStateUpdate } from "../websocket/emit";

const logFile = "/home/sjfox/code/raspi-home-server/logs/logs.txt";

export const getLogs = (count = 5) => {
  const lines = readFileSync(logFile, { encoding: "utf-8" }).split("\n");
  return lines.slice(-count);
};

export const writeLog = (line: string, io?: Server, socket?: Socket) => {
  const message = `${new Date().toISOString()}: ${line}`;
  appendFileSync(logFile, "\n" + message, { encoding: "utf-8" });
  emitStateUpdate(CHANNEL.LOG_STREAM, [message], io, socket);
};
