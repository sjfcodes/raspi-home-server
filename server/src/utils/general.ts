export const getSortedObject = (object: Record<any, any>) => {
    const keys = Object.keys(object).sort();
    const copy: Record<any, any> = {};

    for (const key of keys) {
        copy[key] = object[key];
    }

    return copy;
};

export function log(channel: string, message: string, data: any = "") {
    let label = channel.padEnd(23, " ");
    if (label.length > 23) label = label.substring(0, 22) + '…';
    console.log(`[${label}]:`, message, data);
}
