import { Esp32Client, HeaterGpioState } from "../types/main";

export const CHANNEL = {
    HEATER_GPIO_0: "gpio-heater-0",
    ESP32_TEMP_CLIENT_MAP: "esp32-temp-0"
};
export const HEATER_GPIO_DEFAULT_STATE: HeaterGpioState = { isOn: false };
export const ESP32_TEMP_DEFAULT_STATE: Esp32Client = { chipName: 'offline', chipId: '', tempF: 0, updatedAt: '' };
