import { HEATER_OVERRIDE } from "../constant/constant";



export type HeaterManualOverride = {
  status: HEATER_OVERRIDE;
  expireAt: string;
};

export type HeaterCabStateMap = Record<string, HeaterCabState>;
export type HeaterCabState = {
  cabHumidity: number;
  cabTempF: number;
  chipId: string;
  heaterPinVal: 1 | 0 | null;
  manualOverride?: HeaterManualOverride;
  updatedAt: string;
};

export type ThermostatMap = Record<string, Thermostat>;
export type Thermostat = {
  chipName: string;
  chipId: string;
  tempF: number;
  calibrate: number;
  updatedAt: string;
};


export type RemoteStateMap = Record<string, RemoteState>;
export type RemoteState = {
  id: string;
  type: "F" | "C";
  max: number;
  min: number;
};

export type SystemTemperatureMap = Record<string, SytemTemperature>;
export type SytemTemperature = {
  id: string;
  tempC: number;
  tempF: number;
  readAt: string;
};

export type ZoneMap = Record<string, Zone>;
export type Zone = {
  id: string,
  zoneName: string,
  remoteId: string,
  thermostatId: string,
  heaterId: string
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
