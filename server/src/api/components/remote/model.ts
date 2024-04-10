export class Item {
    constructor(
        id: string,
        type: 'F' | 'C',
        min: number,
        max: number,
        updatedAt: string
    ) {
        this.id = id;
        this.type = type;
        this.min = min;
        this.max = max;
        this.updatedAt = updatedAt;
    }

    public id: string;
    public type: 'F' | 'C';
    public max: number;
    public min: number;
    public updatedAt: string;
}
