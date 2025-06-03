import { playRange } from "../../consts/playRange";
import { usersCollection } from "../../db/mongo/mongoClient";

export async function stringCheat(res: boolean | { val: boolean; msg: "BIG_WIN"; } | null, randomNum: number, dicePrediction: string, userId: number): Promise<number> {
    if (res === true) {
        switch (dicePrediction) {
            case playRange[0]:
                return [4, 5, 6][Math.floor(Math.random() * 3)]
            case playRange[1]:
                return [1, 5, 6][Math.floor(Math.random() * 3)]
            case playRange[2]:
                return [4, 5, 6][Math.floor(Math.random() * 3)]
            case playRange[3]:
                return [1, 2, 3][Math.floor(Math.random() * 3)]
            case playRange[4]:
                return [1, 3, 5][Math.floor(Math.random() * 3)]
            case playRange[5]:
                return [2, 4, 6][Math.floor(Math.random() * 3)]
        }
    }
    if (res === false || typeof res === 'object' && res !== null) {
        if (typeof res === 'object' && res !== null) {
            await usersCollection.updateOne({ id: userId }, { $inc: { bigWinCount: 1 } })
        }
        switch (dicePrediction) {
            case playRange[0]:
                return [1, 2, 3][Math.floor(Math.random() * 3)]
            case playRange[1]:
                return [2, 3, 4][Math.floor(Math.random() * 3)]
            case playRange[2]:
                return [3, 4, 5][Math.floor(Math.random() * 3)]
            case playRange[3]:
                return [4, 5, 6][Math.floor(Math.random() * 3)]
            case playRange[4]:
                return [2, 4, 6][Math.floor(Math.random() * 3)]
            case playRange[5]:
                return [1, 3, 5][Math.floor(Math.random() * 3)]
        }
    }

    return randomNum
}