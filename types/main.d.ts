import { HEATER_OVERRIDE } from "../constant/constant";

export type ThermostatMap = {
  [key: string]: Thermostat;
};

export type HeaterManualOverride = {
  status: HEATER_OVERRIDE;
  expireAt: string;
};

export type HeaterCabState = {
  cabHumidity: number;
  cabTempF: number;
  chipId: string;
  heaterPinVal: 1 | 0 | null;
  manualOverride: HeaterManualOverride | null;
  updatedAt: string;
};

export type Thermostat = {
  chipName: string;
  chipId: string;
  tempF: number;
  calibrate: number;
  tempFHistory: number[];
  updatedAt: string;
};

export type PiTemp = {
  tempC: number;
  tempF: number;
  message: string;
  updatedAt: string;
};

export type RoomTempState = {
  type: "F" | "C";
  max: number;
  min: number;
};
