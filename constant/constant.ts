import { HeaterGpioState, RoomTempState } from "../types/main";

export enum CHANNEL {
  HEATER_GPIO_0 = "gpio-heater-0",
  THERMOSTAT_MAP = "thermostat-map-0",
  PI_TEMP = "pi-temp-0",
  TARGET_TEMP = "target-temp-0",
  LOG_STREAM = "log-stream-0",
}

export enum HEATER_OVERRIDE {
  OFF = "OFF",
  ON = "ON",
}

export enum THERMOSTAT {
  _0 = "9efc8ad4",
  _1 = "abe342a8",
  _2 = "9ffc8ad4",
}

export const HEATER_GPIO_DEFAULT_STATE: HeaterGpioState = {
  isOn: false,
  manualOverride: null,
};

export const ROOM_TEMP_DEFAULT_STATE: RoomTempState = {
  type: "F",
  min: 65,
  max: 70,
};
