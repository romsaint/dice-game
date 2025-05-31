import { bot } from "../../app";
import { playRangeKeyboard } from "../../consts/playRange";
import { redisClient } from "../../db/redis/redisClient";
import { IUser } from "../../interfaces/user.interface"
import { Message } from "node-telegram-bot-api";

export async function payState(msg: Message, userId: number, user: IUser) {
    try {
        const money = Number(msg.text)

        if (isNaN(money)) {
            return
        }
        if (money < 10) {
            bot.sendMessage(userId, 'Мин 10 рублей')
            return
        }
        if (user.balance < money) {
            bot.sendMessage(userId, 'У вас не хватает денег', {
                reply_markup: {
                    inline_keyboard: [[{ text: 'Пополнить', callback_data: 'DEPOSIT' }]]
                }
            })
            return
        }

        await redisClient.set(`${userId}`, Math.round(money))
        await redisClient.set(`${userId}-money`, Math.round(money))
        bot.sendMessage(userId, 'Напишите цифру от 1 до 6 либо выберите предложенные варианты', {
            reply_markup: {
                keyboard: playRangeKeyboard
            }
        })
        return
    } catch (e) {
        bot.sendMessage(userId, 'ошибка')
    }
}