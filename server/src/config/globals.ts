export const env = {
    REDIS_URL: process.env.REDIS_URL || '',
    NODE_ENV: process.env.NODE_ENV || 'development',
    NODE_PORT: process.env.NODE_PORT ? Number(process.env.NODE_PORT) : 3000,
    WSS_PORT: process.env.WSS_PORT ? Number(process.env.WSS_PORT) : 3001
};

export enum ZONE_ID {
    HOME = 'home',
    OFFICE = 'office',
}

export enum REMOTE_ID {
    HOME = 'home',
    OFFICE = 'office',
}

export enum HEATER_ID {
    HOME = 'd0fc8ad4',
}

export enum THERMOSTAT_ID {
    HOME = '9efc8ad4',
    OFFICE = '',
}

export enum WSS_CHANNEL {
    HEATER_CAB_0 = '/heater-cab-0',
}

export enum ITEM_TYPE {
    HEATER = 'HEATER',
    THERMOSTAT = 'THERMOSTAT',
    REMOTE = 'REMOTE',
    ZONE = 'ZONE',
    SYSTEM_TEMPERATURE = 'SYSTEM_TEMPERATURE',
}
