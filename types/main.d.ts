export type AppState = {
  client: ThermostatState;
  ledPinState: PinState;
}

export type PinState = {
  isOn?: boolean;
};


export type ThermostatState = {
  [ket: string]: Thermostat
}

export type Thermostat = {
  clientName: string;
  tempF: string;
  updatedAt: string;
}