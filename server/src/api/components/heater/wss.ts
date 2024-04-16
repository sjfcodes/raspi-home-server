import { WebSocketServer } from 'ws';
import { WSS_CHANNEL, env } from "../../../config/globals";

// wss connection for heater
const wss = new WebSocketServer({
    path: WSS_CHANNEL.HEATER_CAB_0,
    port: env.WSS_PORT,
});


export const getWss = () => wss