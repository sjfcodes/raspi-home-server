export class Item {
    constructor(
        id: string,
        zoneName: string,
        remoteId: string,
        thermostatId: string,
        heaterId: string
    ) {
        this.id = id;
        this.zoneName = zoneName;
        this.remoteId = remoteId;
        this.thermostatId = thermostatId;
        this.heaterId = heaterId;
    }

    public id: string;
    public zoneName: string;
    public remoteId: string;
    public thermostatId: string;
    public heaterId: string;
}
