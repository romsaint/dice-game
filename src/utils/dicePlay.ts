import { exhaustiveUniqueRandom } from 'unique-random'
import { TypePlayRange, playRange } from '../consts/playRange'
import { TypeDicePlay } from '../interfaces/dicePlay.interface'
import { redisClient } from '../db/redis/redisClient'
import { gifts } from '../consts/gifts'

export async function dicePlay(dicePrediction: string | TypePlayRange[number], userId: number, money: number): Promise<TypeDicePlay> {
    const random = exhaustiveUniqueRandom(1, 6)
    try {
        const randomNum = random()
        let gift
      
        for (const i of gifts) {
            let split = i.split('/')
            if (split[split.length - 1].includes(`${randomNum}`)) {
                gift = i
            }
        }
        if(!gift) {
            return null
        }
        if (!isNaN(Number(dicePrediction))) {
            if (randomNum === Number(dicePrediction)) {
                await redisClient.set(`${userId}-money`, Math.round(money * 4))
                return { msg: "Вы выиграли!!", randomNum, gift }
            } else {
                return { msg: "Вы Проиграли!!", randomNum, gift  }
            }
        } else {
            switch (dicePrediction) {
                case playRange[0]:
                    if (randomNum > 3) {
                        return { msg: "Вы Проиграли!!", randomNum, gift  }
                    }
                    break
                case playRange[1]:
                    if (randomNum > 4 || randomNum < 2) {
                        return { msg: "Вы Проиграли!!", randomNum, gift  }
                    }
                    break
                case playRange[2]:
                    if (randomNum > 5 || randomNum < 3) {
                        return { msg: "Вы Проиграли!!", randomNum, gift  }
                    }
                    break
                case playRange[3]:
                    if (randomNum < 4) {
                        return { msg: "Вы Проиграли!!", randomNum, gift  }
                    }
                    break
                case playRange[4]:
                    if (randomNum % 2 !== 0) {
                        return { msg: "Вы Проиграли!!", randomNum, gift  }
                    }
                    break
                case playRange[5]:
                    if (randomNum % 2 === 0) {
                        return { msg: "Вы Проиграли!!", randomNum, gift  }
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