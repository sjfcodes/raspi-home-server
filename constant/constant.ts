import { Esp32Client, HeaterGpioState, PiTemp } from "../types/main";

export const CHANNEL = {
    HEATER_GPIO_0: "gpio-heater-0",
    ESP32_TEMP_CLIENT_MAP: "esp32-temp-0",
    PI_TEMP: "pi-temp-0"
};
export const HEATER_GPIO_DEFAULT_STATE: HeaterGpioState = { isOn: false, manualOverride: null };
export const ESP32_TEMP_DEFAULT_STATE: Esp32Client = { chipName: 'offline', chipId: '', tempF: 0, updatedAt: '' };
export const PI_TEMP_DEFAULT_STATE: PiTemp = { tempC: 0, tempF: 0, updatedAt: '', message: '' };

export enum HEATER_OVERRIDE {
    OFF = 'OFF',
    ON = 'ON',
}