import { usersCollection } from "../../db/mongo/mongoClient";

export async function numberPlayCheat(res: boolean | {val: boolean;msg: "BIG_WIN";} | null, randomNum: number, dicePrediction: number, userId: number): Promise<number> {
    if (res === true) {
        if (randomNum === dicePrediction) {
            if (randomNum > 5) {
                return randomNum - 1
            } else {
                return randomNum + 1
            }
        }
    }
    if (res === false || typeof res === 'object' && res !== null) {
        if (typeof res === 'object' && res !== null) {
            await usersCollection.updateOne({ id: userId }, { $inc: { bigWinCount: 1 } })
        }
        return dicePrediction
    }
    return randomNum
}