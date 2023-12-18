import { networkInterfaces } from 'os';

const nets = networkInterfaces();
export const ipAddress = nets.wlan0[0].address
