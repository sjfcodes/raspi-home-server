import { readFileSync } from 'fs';
import { logger } from '../../../config/logger';
import { Info, Temperature } from './model';
import { SseManager } from '../sse';
import { getDate } from '../../../services/utility';

export const sseManager = new SseManager({} as Record<string, Temperature>);

let cpuInfo: Info | null;
export async function getPiCpuInfo(): Promise<Info | undefined> {
    if (cpuInfo) return cpuInfo;

    const info = readFileSync('/proc/cpuinfo', 'utf8');
    if (!info) {
        logger.error('failed to read system info');
        return;
    }

    const map = info.split('\n').reduce((prev, line) => {
        const [key, value] = line.split(':');
        if (key) prev[key.replaceAll('\t', '') as keyof Info] = value.trim();
        return prev;
    }, {} as Info);
    map.readAt = getDate();

    if (!cpuInfo) cpuInfo = map;

    return cpuInfo;
}

export async function getPiTemp(): Promise<Temperature | undefined> {
    const cpuInfo = await getPiCpuInfo();
    if (!cpuInfo) {
        logger.error('failed to get system info for temp state');
        return;
    }

    const temp = Number(
        readFileSync('/sys/class/thermal/thermal_zone0/temp', 'utf8')
    );

    if (isNaN(temp)) {
        logger.error('temp must be number');
        return;
    }

    const tempC = Math.trunc(temp / 1000);
    return {
        id: cpuInfo?.Serial,
        tempC,
        tempF: Math.trunc((tempC * 9) / 5 + 32),
        readAt: getDate(),
    };
}

// publish pi temp on loop
(async () => {
    setInterval(async () => {
        const data = await getPiTemp();
        if (!data) return;
        sseManager.setState('system', data);
    }, 5000);
})();
