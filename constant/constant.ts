import { HeaterCab, Remote } from "../types/main";

export const RASP_PI = {
  ip: "192.168.68.142",
  serverPort: 3000,
  wsPort: 3001,
};

export enum CHANNEL {
  HEATER_CAB_0 = "/heater-cab-0",
  THERMOSTAT_MAP = "thermostat-map-0",
  PI_TEMP = "pi-temp-0",
  TARGET_TEMP = "target-temp-0",
  LOG_STREAM = "log-stream-0",
}

export enum HEATER_STATE {
  FORCE_OFF = "FORCE_OFF",
  FORCE_ON = "FORCE_ON",
}

export const PRIMARY_THERMOSTAT = "9efc8ad4";

export enum THERMOSTAT {
  "9efc8ad4" = "Living Room",
  "abe342a8" = "Office",
  "9ffc8ad4" = "Aux",
}

export enum HEATER_CAB {
  HOME = "d0fc8ad4",
}

export const HEATER_GPO_DEFAULT_STATE: HeaterCab = {
  cabHumidity: 0,
  cabTempF: 0,
  chipId: "",
  heaterPinVal: 0,
  updatedAt: "",
};

export const REMOTE_HOME_DEFAULT_STATE: Remote = {
  id: "home",
  type: "F",
  max: 66,
  min: 66,
  updatedAt: new Date().toISOString(),
};

export const REMOTE_OFFICE_DEFAULT_STATE: Remote = {
  id: "office",
  type: "F",
  max: 66,
  min: 66,
  updatedAt: new Date().toISOString(),
};

export const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  Connection: "keep-alive",
  "Cache-Control": "no-cache",
};
