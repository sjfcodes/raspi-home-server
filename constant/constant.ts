import { HeaterCabState, RoomTempState } from "../types/main";

export const RASP_PI = {
  ip: "192.168.68.142",
  wsPort: 3001,
};

export enum CHANNEL {
  HEATER_CAB_0 = "/heater-cab-0",
  THERMOSTAT_MAP = "thermostat-map-0",
  PI_TEMP = "pi-temp-0",
  TARGET_TEMP = "target-temp-0",
  LOG_STREAM = "log-stream-0",
}

export enum HEATER_OVERRIDE {
  OFF = "OFF",
  ON = "ON",
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

export const HEATER_GPO_DEFAULT_STATE: HeaterCabState = {
  cabHumidity: 0,
  cabTempF: 0,
  chipId: "",
  heaterPinVal: null,
  manualOverride: null,
  updatedAt: "",
};

export const ROOM_TEMP_DEFAULT_STATE: RoomTempState = {
  type: "F",
  max: 69,
  min: 68,
};
