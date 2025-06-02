import { ILuckyCheat } from "../../interfaces/luckyCheat.interface"
import { IUser } from "../../interfaces/user.interface"

export class LuckyCheat implements ILuckyCheat {
    constructor(
        private readonly user: IUser,
        private readonly currentGameSum: number
    ) { }

    luckyCheat(): boolean | null {
        if (this.user.gameCount > this.user.bigWinCount * [9, 10, 11, 12, 13][Math.floor(Math.random() * 6)] || this.user.bigWinCount === 0) {
            if (this.currentGameSum > this.user.gameSum / this.user.gameCount) {
                return false
            }
        }

        return Math.random() > 0.8
    }
}
