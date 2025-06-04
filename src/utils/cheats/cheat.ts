import { ICheat } from "../../interfaces/cheat.interface"
import { IUser } from "../../interfaces/user.interface"

export class Cheat implements ICheat {
    constructor(
        private readonly user: IUser,
        private readonly currentGameSum: number
    ) { }

    cheat(): boolean | null {
        if (this.user.cheatingCount > [0, 1, 2][Math.floor(Math.random() * 3)]) {
            return false
        }
        if (this.currentGameSum > this.user.gameSum / this.user.gameCount) {
            return true
        }
        return true
    }
}