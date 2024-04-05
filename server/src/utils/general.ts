import { config } from "../../config";

export const getSortedObject = (object: Record<any, any>) => {
    const keys = Object.keys(object).sort();
    const copy: Record<any, any> = {};

    for (const key of keys) {
        copy[key] = object[key];
    }

    return copy;
};

export function log(channel: string, message: string, data: any = {}) {
    const time = new Date().toLocaleTimeString();

    let label = channel.padEnd(config.log.labelWidth, " ");
    if (label.length > config.log.labelWidth)
        label = label.substring(0, config.log.labelWidth - 1) + "…";

    const args = [time, `[${label}]:`, message];

    if (config.log.showData) args.push(JSON.stringify(data));

    console.log(...args);
}
