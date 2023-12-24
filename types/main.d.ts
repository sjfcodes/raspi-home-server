export type Esp32ClientMap = {
  [key: string]: Esp32Client;
}

export type GpioHeaterPinState = {
  isOn?: boolean;
};

export type Esp32Client = {
  clientName: string;
  tempF: number;
  updatedAt: string;
}