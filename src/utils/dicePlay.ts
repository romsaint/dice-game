import { exhaustiveUniqueRandom } from 'unique-random'
import { TypePlayRange, playRange } from '../consts/playRange'
import { TypeDicePlay } from '../interfaces/dicePlay.interface'
import { redisClient } from '../db/redis/redisClient'
import { gifts } from '../consts/gifts'
import { Cheat } from './cheats/cheat'
import { LuckyCheat } from './cheats/luckyCheat'
import { CheatService } from './cheats/cheatService'
import { IUser } from '../interfaces/user.interface'
import { usersCollection } from '../db/mongo/mongoClient'
import { numberPlayCheat } from './dicePlayCheats/numberCheat'
import { stringCheat } from './dicePlayCheats/stringCheat'

export async function dicePlay(dicePrediction: string | TypePlayRange[number], userId: number, money: number, user: IUser): Promise<TypeDicePlay> {
    const random = exhaustiveUniqueRandom(1, 6)
    try {
        let randomNum = random()
        let gift

        const cheat = new Cheat(user, money)
        const luckyCheat = new LuckyCheat(user, money)
        const cheatService = new CheatService(user, cheat, luckyCheat)
        const res = cheatService.cheatDistribution()

        if (res === true) {
            await usersCollection.updateOne({ id: userId }, { $inc: { cheatingCount: 1 } })
        }
        else {
            await usersCollection.updateOne({ id: userId }, { $set: { cheatingCount: 0 } })
        }

        console.log([randomNum, dicePrediction, res])
        if (!isNaN(Number(dicePrediction))) {
            // CHEATS
            randomNum = await numberPlayCheat(res, randomNum, Number(dicePrediction), userId)

            for (const i of gifts) {
                let split = i.split('/')
                if (split[split.length - 1].includes(`${randomNum}`)) {
                    gift = i
                }
            }

            if (!gift) {
                return null
            }

            console.log([randomNum, dicePrediction, res])

            if (randomNum === Number(dicePrediction)) {
                await redisClient.set(`${userId}-money`, Math.round(money * 4))
                return { msg: "Вы выиграли!!", randomNum, gift }
            } else {
                return { msg: "Вы Проиграли!!", randomNum, gift }
            }
        } else {
            // CHEATS
            randomNum = await stringCheat(res, randomNum, dicePrediction, userId)

            for (const i of gifts) {
                let split = i.split('/')
                if (split[split.length - 1].includes(`${randomNum}`)) {
                    gift = i
                }
            }
            if (!gift) {
                return null
            }

            console.log([randomNum, dicePrediction, res])
            switch (dicePrediction) {
                case playRange[0]:
                    if (randomNum > 3) {
                        return { msg: "Вы Проиграли!!", randomNum, gift }
                    }
                    break
                case playRange[1]:
                    if (randomNum > 4 || randomNum < 2) {
                        return { msg: "Вы Проиграли!!", randomNum, gift }
                    }
                    break
                case playRange[2]:
                    if (randomNum > 5 || randomNum < 3) {
                        return { msg: "Вы Проиграли!!", randomNum, gift }
                    }
                    break
                case playRange[3]:
                    if (randomNum < 4) {
                        return { msg: "Вы Проиграли!!", randomNum, gift }
                    }
                    break
                case playRange[4]:
                    if (randomNum % 2 !== 0) {
                        return { msg: "Вы Проиграли!!", randomNum, gift }
                    }
                    break
                case playRange[5]:
                    if (randomNum % 2 === 0) {
                        return { msg: "Вы Проиграли!!", randomNum, gift }
                    }
                    break
            }

            await redisClient.set(`${userId}-money`, Math.round(money * 1.7))

            return { msg: "Вы выиграли!!", randomNum, gift }
        }

    } catch (e) {
        console.log(e)
        return null
    }
}