import { appendFileSync, readFileSync } from "node:fs";

const logFile = "/home/sjfox/code/raspi-home-server/logs/logs.txt";

let lastLine = "";
export const writeLog = (line: string) => {
    if (line === lastLine) return;
    const message = `${new Date().toISOString()}: ${line}`;
    appendFileSync(logFile, "\n" + message, { encoding: "utf-8" });
    lastLine = line;
};

export const getLogs = (count = 5) => {
    const lines = readFileSync(logFile, { encoding: "utf-8" }).split("\n");
    return lines.slice(-count).filter((log) => !!log);
};
