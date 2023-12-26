import { readFileSync } from "node:fs";
import { Server } from "socket.io";
import { CHANNEL } from "../../../constant/constant";
import { PiTemp } from "../../../types/main";


export const emitPiTemp = (io: Server) => {
    const temp = Number(readFileSync("/sys/class/thermal/thermal_zone0/temp", { encoding: 'utf8' }));
    const data = {
        tempC: 0,
        tempF: 0,
        message: 'default',
        updatedAt: new Date().toLocaleTimeString()
    } as PiTemp;
    if (isNaN(temp)) {
        data.message = 'temp must be number';
    } else {
        const tempC = Number((temp / 1000).toFixed(0));
        data.tempC = tempC
        data.tempF = Number(((tempC * 9 / 5) + 32).toFixed(0));
        data.message = 'ok';
    }

    if (io) {
        io.emit(CHANNEL.PI_TEMP, data);
    }

    console.log("EMIT: ", CHANNEL.PI_TEMP, JSON.stringify(data));
}
