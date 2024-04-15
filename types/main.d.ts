import { HEATER_STATE } from "../constant/constant";

export type HeaterCabState = {
  status: HEATER_STATE;
  expireAt: string;
};

export type HeaterCabMap = Record<string, HeaterCab | undefined>;
export type HeaterCab = {
  cabHumidity: number;
  cabTempF: number;
  chipId: string;
  heaterPinVal: 1 | 0 | null;
  state?: HeaterCabState;
  updatedAt: string;
};

export type ThermostatMap = Record<string, Thermostat | undefined>;
export type Thermostat = {
  chipName: string;
  chipId: string;
  tempF: number;
  calibrate: number;
  updatedAt: string;
};

export type RemoteMap = Record<string, Remote | undefined>;
export type Remote = {
  id: string;
  type: "F" | "C";
  max: number;
  min: number;
};

export type SystemTemperatureMap = Record<string, SytemTemperature | undefined>;
export type SytemTemperature = {
  id: string;
  tempC: number;
  tempF: number;
  readAt: string;
};

export type ZoneMap = Record<string, Zone | undefined>;
export type Zone = {
  id: string;
  zoneName: string;
  remoteId: string;
  thermostatId: string;
  heaterId: string;
  isActive: boolean;
};

export type SytemInformation = {
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
