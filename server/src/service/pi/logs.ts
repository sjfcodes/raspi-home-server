import fs from 'fs';

// @ts-ignore
const thisDir = __dirname; // /home/sjfox/code/raspi-home-server/server/src/service/pi
const logPath = `${thisDir}/../../../../logs/logs.txt`;

let lastLog = ''
export function writeLog(nextLog: string) {
    if (lastLog === nextLog) return;
    lastLog = nextLog;
    
    fs.appendFileSync(logPath, '\n' + new Date().toISOString() + ': ' + nextLog, 'utf-8');
}
