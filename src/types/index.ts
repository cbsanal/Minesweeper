export enum Value {
    none,
    one,
    two,
    three,
    four,
    five,
    six,
    seven,
    eight,
    bomb
}

export enum Status {
    opened,
    unopened,
    flagged
}

export type Cell = {value: Value; status: Status; red?: boolean};

export enum Face {
    smile =  "😁",
    oh = "😲",
    lost = "🤕",
    win = "😎"
}