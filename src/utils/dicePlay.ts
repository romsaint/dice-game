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

export async function dicePlay(dicePrediction: string | TypePlayRange[number], userId: number, money: number, user: IUser): Promise<TypeDicePlay> {
    const random = exhaustiveUniqueRandom(1, 6)
    try {
        let randomNum = random()
        let gift

        const cheat = new Cheat(user, money)
        const luckyCheat = new LuckyCheat(user, money)
        const cheatService = new CheatService(user, cheat, luckyCheat)
        const res = cheatService.cheatDistribution()

        console.log([randomNum, dicePrediction, res])
        if (!isNaN(Number(dicePrediction))) {
            if (res === true) {
                if (randomNum === Number(dicePrediction)) {
                    if (randomNum > 5) {
                        randomNum = randomNum - 1
                    } else {
                        randomNum = randomNum + 1
                    }
                }
            }
            if (res === false) {
                randomNum = Number(dicePrediction)
            }
            if (typeof res === 'object' && res !== null) {
                await usersCollection.updateOne({ id: userId }, { $inc: { bigWinCount: 1 } })
            }

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
            for (const i of gifts) {
                let split = i.split('/')
                if (split[split.length - 1].includes(`${randomNum}`)) {
                    gift = i
                }
            }
            if (!gift) {
                return null
            }
            if (res === true) {
                switch (dicePrediction) {
                    case playRange[0]:
                        randomNum = [4, 5, 6][Math.floor(Math.random() * 4)]
                        break
                    case playRange[1]:
                        randomNum = [1, 5, 6][Math.floor(Math.random() * 4)]
                        break
                    case playRange[2]:
                        randomNum = [4, 5, 6][Math.floor(Math.random() * 4)]
                        break
                    case playRange[3]:
                        randomNum = [1, 2, 3][Math.floor(Math.random() * 4)]
                        break
                    case playRange[4]:
                        randomNum = [1, 3, 5][Math.floor(Math.random() * 4)]
                        break
                    case playRange[5]:
                        randomNum = [2, 4, 6][Math.floor(Math.random() * 4)]
                        break
                }
            }
            if (res === false || typeof res === 'object' && res !== null) {
                switch (dicePrediction) {
                    case playRange[0]:
                        randomNum = 2
                        break
                    case playRange[1]:
                        randomNum = 4
                        break
                    case playRange[2]:
                        randomNum = 3
                        break
                    case playRange[3]:
                        randomNum = 6
                        break
                    case playRange[4]:
                        randomNum = [2, 4, 6][Math.floor(Math.random() * 4)]
                        break
                    case playRange[5]:
                        randomNum = [1, 3, 5][Math.floor(Math.random() * 4)]
                        break
                }
                if (res !== false) {
                    await usersCollection.updateOne({ id: userId }, { $inc: { bigWinCount: 1 } })
                }
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
        return null
    }
}