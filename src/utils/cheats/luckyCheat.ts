import { ILuckyCheat } from "../../interfaces/luckyCheat.interface"
import { IUser } from "../../interfaces/user.interface"

export class LuckyCheat implements ILuckyCheat {
    constructor(
        private readonly user: IUser,
        private readonly currentGameSum: number
    ) { }

    luckyCheat(): boolean | null | {val: false, msg: "BIG_WIN"} {
        if (this.user.gameCount > this.user.bigWinCount * [9, 10, 11, 12, 13][Math.floor(Math.random() * 5)] || this.user.bigWinCount === 0) {
            const avg = this.user.gameSum / this.user.gameCount
            if (this.currentGameSum > avg * 1.5 && this.currentGameSum < avg * 4) {
                return {val: false, msg: "BIG_WIN"}
            }
        }

        return Math.random() > 0.8 === true ? null : false
    }
}
