import { Esp32Client, GpioHeaterPinState } from "../types/main";

export const CHANNEL = {
    GPIO_HEATER_0: "gpio-heater-0",
    ESP32_TEMP_CLIENT_MAP: "esp32-temp-0"
};
export const GPIO_HEATER_DEFAULT_STATE: GpioHeaterPinState = { isOn: false };
export const ESP32_TEMP_DEFAULT_STATE: Esp32Client = { chipName: 'offline', chipId: '', tempF: 0, updatedAt: '' };
