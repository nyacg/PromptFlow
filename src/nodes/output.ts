export class Output {
    name: string;
    stopsAt: string;

    lmqlBody = () => {
        return `"[${this.name}]"`;
    };

    lmqlStopsAt = () => {
        return `STOPS_AT(${this.name}, "${this.stopsAt}")`;
    };

    constructor(name: string, stopsAt?: string) {
        this.name = name;
        if (stopsAt === undefined) {
            this.stopsAt = "\\n";
        } else {
            this.stopsAt = stopsAt;
        }
    }
}

export class ListOutput extends Output {
    name: string;
    stopsAt: string;
    count: number;

    constructor(count: number, name: string) {
        super(name, "\\n");
        this.name = name;
        this.stopsAt = "\\n";
        this.count = count;
    }

    lmqlBody = () => {
        return `
    for i in range(${this.count}):
        "- [${this.name}] \\n"`;
    };
}
