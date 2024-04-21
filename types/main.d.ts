import { HEATER_OVERRIDE_STATUS } from "../constant/constant";
import { ITEM_TYPE } from "../server/src/config/globals";

export type HeaterMap = Record<string, Heater | undefined>;

export type HeaterPinVal = 1 | 0;
export type Heater = {
  zoneId: string;
  chipId: string;
  cabHumidity: number;
  cabTempF: number;
  heaterPinVal: HeaterPinVal;
  updatedAt: string;
  itemType: ITEM_TYPE.HEATER;
};

export type ThermometerMap = Record<string, Thermometer | undefined>;
export type Thermometer = {
  zoneId: string;
  chipName: string;
  chipId: string;
  tempF: number;
  updatedAt: string;
  itemType: ITEM_TYPE.THERMOMETER;
};

export type RemoteMap = Record<string, Remote | undefined>;
export type Remote = {
  remoteId: string;
  zoneId: string;
  unit: "F" | "C";
  max: number;
  min: number;
  heaterOverride?: HeaterOverrideStatus;
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

export type HeaterOverrideStatus = {
  status: HEATER_OVERRIDE_STATUS;
  expireAt: string;
};

export type ZoneMap = Record<string, Zone | undefined>;
export type Zone = {
  zoneId: string;
  zoneName: string;
  remoteId: string;
  thermometerId: string;
  heaterId: string;
  isActive: boolean;
  itemType: ITEM_TYPE.ZONE;
};

export type SystemInformation = {
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
