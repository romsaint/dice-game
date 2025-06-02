import { ICheat } from "../../interfaces/cheat.interface"
import { ILuckyCheat } from "../../interfaces/luckyCheat.interface"
import { IUser } from "../../interfaces/user.interface"

export class CheatService {
    constructor(
        private readonly user: IUser,
        private readonly cheat: ICheat,
        private readonly luckyCheat: ILuckyCheat
    ) { }

    cheatDistribution() {
        console.log(this.user)
        if (this.user.gameCount > 4) {
            if (this.user.winSum * 3.5 <= this.user.loseSum) {
                return this.luckyCheat.luckyCheat()
            }
            if (this.user.loseSum * 2 <= this.user.winSum) {
                return this.cheat.cheat()
            }
        }
        return null
    }
}