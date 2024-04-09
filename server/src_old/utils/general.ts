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

    let label = channel.padEnd(config.log.labelWidth, ' ');
    if (label.length > config.log.labelWidth)
        label = label.substring(0, config.log.labelWidth - 1) + '…';

    const args = [label, message];

    if (config.log.showData) args.push(JSON.stringify(data));

    return args;
}

export function log(channel: string, message: string, data: any = {}) {

    console.log(...formatLog(channel, message, data));
}
