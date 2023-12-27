import { HEATER_OVERRIDE } from "../constant/constant";

export type Esp32ClientMap = {
  [key: string]: Esp32ClientState;
}

export type HeaterManualOverride = {
  status: HEATER_OVERRIDE;
  expireAt: string;
}

export type HeaterGpioState = {
  isOn: boolean;
  manualOverride: HeaterManualOverride | null;
};

export type Esp32ClientState = {
  chipName: string;
  chipId: string;
  tempF: number;
  calibrate: number;
  tempFHistory: number[];
  updatedAt: string;
}

export type PiTemp = {
  tempC: number;
  tempF: number;
  message: string;
  updatedAt: string;
}

export type RoomTempState = {
  type: 'F' | 'C';
  min: number;
  max: number;
}