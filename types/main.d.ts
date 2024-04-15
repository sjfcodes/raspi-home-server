import { HEATER_STATE } from "../constant/constant";
import { ITEM_TYPE } from "../server/src/config/globals";

export type HeaterCabState = {
  status: HEATER_STATE;
  expireAt: string;
};

export type HeaterMap = Record<string, Heater | undefined>;

export type HeaterPinVal = 1 | 0;
export type Heater = {
  zoneId: string;
  chipId: string;
  cabHumidity: number;
  cabTempF: number;
  heaterPinVal: HeaterPinVal;
  state?: HeaterCabState;
  updatedAt: string;
  itemType: ITEM_TYPE.HEATER;
};

export type ThermostatMap = Record<string, Thermostat | undefined>;
export type Thermostat = {
  zoneId: string;
  chipName: string;
  chipId: string;
  tempF: number;
  updatedAt: string;
  itemType: ITEM_TYPE.THERMOSTAT;
};

export type RemoteMap = Record<string, Remote | undefined>;
export type Remote = {
  remoteId: string;
  zoneId: string;
  unit: "F" | "C";
  max: number;
  min: number;
  updatedAt: string;
  itemType: ITEM_TYPE.REMOTE;
};

export type SystemTemperatureMap = Record<string, SytemTemperature | undefined>;
export type SytemTemperature = {
  id: string;
  tempC: number;
  tempF: number;
  readAt: string;
  itemType: ITEM_TYPE.SYSTEM_TEMPERATURE;
};

export type ZoneMap = Record<string, Zone | undefined>;
export type Zone = {
  zoneId: string;
  zoneName: string;
  remoteId: string;
  thermostatId: string;
  heaterId: string;
  isActive: boolean;
  itemType: ITEM_TYPE.ZONE;
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
