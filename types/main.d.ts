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

export type SystemTemperatureState = Record<string, PiSytemTemperature>;

export type RoomTempState = {
  id: string;
  type: "F" | "C";
  max: number;
  min: number;
};

export type PiSytemTemperature = {
  id: string;
  tempC: number;
  tempF: number;
  readAt: string;
};

export type PiSytemInfo = {
  processor: string;
  BogoMIPS: string;
  Features: string;
  "CPU implementer": string;
  "CPU architecture": string;
  "CPU variant": string;
  "CPU part": string;
  "CPU revision": string;
  Revision: string;
  Serial: string;
  Model: string;
  readAt: string;
};
