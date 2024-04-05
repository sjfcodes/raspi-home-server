export const getSortedObject = (object: Record<any, any>) => {
  const keys = Object.keys(object).sort();
  const copy: Record<any, any> = {};

  for (const key of keys) {
    copy[key] = object[key];
  }

  return copy;
};

export function log(channel:string, message: string, data: any = "") {
  console.log(`[${channel.padEnd(15, ' ')}]:`, message, data);
}