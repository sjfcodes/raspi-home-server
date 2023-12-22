import { networkInterfaces } from "os";

const nets = networkInterfaces();
export const ipAddress = nets.wlan0?.[0]?.address || "0.0.0.0";
