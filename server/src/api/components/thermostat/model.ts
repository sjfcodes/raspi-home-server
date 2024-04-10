export class Thermostat {
    constructor(
        chipName: string,
        chipId: string,
        tempF: number,
        calibrate: number,
        tempFHistory: number[],
        updatedAt: string
    ) {
        this.chipName = chipName;
        this.chipId = chipId;
        this.tempF = tempF;
        this.calibrate = calibrate;
        this.tempFHistory = tempFHistory;
        this.updatedAt = updatedAt;
    }

    public chipName: string;
    public chipId: string;
    public tempF: number;
    public calibrate: number;
    public tempFHistory: number[];
    public updatedAt: string;
}
