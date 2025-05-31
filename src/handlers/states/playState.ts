import { Message } from "node-telegram-bot-api";
import { dicePlay } from "../../utils/dicePlay";
import { bot } from "../../app";
import { playRange, TypePlayRange } from "../../consts/playRange";
import { mongoClient, usersCollection } from "../../db/mongo/mongoClient";
import { TypeDicePlay } from "../../interfaces/dicePlay.interface";
import { redisClient } from "../../db/redis/redisClient";
import { deleteState } from "../../utils/deleteState";
import { gifts } from "../../consts/gifts";


export async function playState(msg: Message, money: number, userId: number) {
    try {
        const prediction = msg.text
        
        if (prediction) {
            const numPred = Number(prediction)
            if (prediction === 'выход') {
                bot.sendMessage(userId, 'Вы вышли из игры')
                await deleteState(userId)
                return
            }
            if (!isNaN(numPred)) {
                if (numPred > 0 && numPred <= 6) {

                } else {
                    bot.sendMessage(userId, 'Число должно быть от 1 до 6')
                    return
                }
            } else {
                if (!playRange.includes(prediction as TypePlayRange[number])) {
                    return
                }
            }
        } else {
            return
        }

        const game = await dicePlay(prediction, userId, money)
        const gift = gifts.filter(val => val.split('/')[val.split('/').length - 1].includes(`${game?.randomNum}`))

        if (!gift) {
            return
        }

        bot.sendAnimation(userId, gift[0])
        await new Promise((res, rej) => {
            setTimeout(async () => {
                res(52)
            }, 3000)
        })

        const moneyWinData = await redisClient.get(`${userId}-money`)
        if (!moneyWinData) {
            bot.sendMessage(userId, 'что-то не то')
            return
        }

        let moneyWin = Number(moneyWinData)

        if (moneyWin === money) {
            moneyWin = 0
        }

        const session = mongoClient.startSession()
        try {
            if (game) {
                if (game.msg === 'Вы выиграли!!') {
                    session.startTransaction()
                    await usersCollection.updateOne({ id: userId }, { $inc: { balance: Math.round(-money) } }, { session })
                    await usersCollection.updateOne({ id: userId }, { $inc: { balance: Math.round(moneyWin) } }, { session })
                    await session.commitTransaction()

                    const user = await usersCollection.findOne({ id: userId })
                    await bot.sendMessage(userId, `Выпало число - ${game.randomNum}`)
                    await bot.sendMessage(userId, `Вы выиграли ${moneyWin} рублей, ваш баланс - ${user?.balance}`)

                } else {
                    await usersCollection.updateOne({ id: userId }, { $inc: { balance: Math.round(-money) } })
                    const user = await usersCollection.findOne({ id: userId })
                    await bot.sendMessage(userId, `Выпало число - ${game.randomNum}`)
                    await bot.sendMessage(userId, `Вы проиграли, ваш баланс - ${user?.balance}`)
                }
            } else {
                bot.sendMessage(userId, 'ошибка')
                return
            }
        } catch (e) {
            await session.abortTransaction();
            bot.sendMessage(userId, 'Ошибка при пополнение счёта, ваши деньги не пострадали')
            return
        }

    } catch (e) {
        bot.sendMessage(userId, 'ошибка')
    }
}