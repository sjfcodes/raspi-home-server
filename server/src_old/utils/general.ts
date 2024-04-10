import { config } from '../../config';

export const getSortedObject = (object: Record<any, any>) => {
    const keys = Object.keys(object).sort();
    const copy: Record<any, any> = {};

    for (const key of keys) {
        copy[key] = object[key];
    }

    return copy;
};

export function formatLog(channel: string, message: string, data: any = {}): string[]{
    const args = [channel, message];
    if (config.log.showData) args.push(JSON.stringify(data));
    return args;
}

export function log(channel: string, message: string, data: any = {}) {

    console.log(...formatLog(channel, message, data));
}
