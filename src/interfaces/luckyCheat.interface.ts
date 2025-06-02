export interface ILuckyCheat {
    luckyCheat(): boolean | null | {val: boolean, msg: 'BIG_WIN'}
}