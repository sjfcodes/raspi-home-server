export const env = {
    REDIS_URL: process.env.REDIS_URL || '',
    NODE_ENV: process.env.NODE_ENV || 'development',
    NODE_PORT: process.env.NODE_PORT ? Number(process.env.NODE_PORT) : 3000,
    WSS_PORT: process.env.WSS_PORT ? Number(process.env.WSS_PORT) : 3001
};

export const isTestEnv = env.NODE_ENV.toLowerCase() === 'test'

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

export enum THERMOMETER_ID {
    HOME = '9efc8ad4',
    OFFICE = 'abe342a8',
}

export enum WSS_CHANNEL {
    HEATER_CAB_0 = '/heater-cab-0',
}

export enum ITEM_TYPE {
    HEATER = 'HEATER',
    THERMOMETER = 'THERMOMETER',
    REMOTE = 'REMOTE',
    ZONE = 'ZONE',
    SYSTEM_TEMPERATURE = 'SYSTEM_TEMPERATURE',
}
