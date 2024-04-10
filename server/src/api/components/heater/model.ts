import { HeaterManualOverride } from '../../../../../types/main';

export class Item {
    constructor(
        chipId: string,
        cabHumidity: number,
        cabTempF: number,
        heaterPinVal: 1 | 0 | null,
        manualOverride: HeaterManualOverride | null,
        updatedAt: string
    ) {
        this.chipId = chipId;
        this.cabHumidity = cabHumidity;
        this.cabTempF = cabTempF;
        this.heaterPinVal = heaterPinVal;
        this.manualOverride = manualOverride;
        this.updatedAt = updatedAt;
    }

    public chipId: string;
    public cabHumidity: number;
    public cabTempF: number;
    public heaterPinVal: 1 | 0 | null;
    public manualOverride: HeaterManualOverride | null;
    public updatedAt: string;
}
