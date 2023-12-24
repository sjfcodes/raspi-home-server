export type Esp32ClientMap = {
  [key: string]: Esp32Client;
}

export type HeaterGpioState = {
  isOn?: boolean;
};

export type Esp32Client = {
  chipName: string;
  chipId: string;
  tempF: number;
  updatedAt: string;
}