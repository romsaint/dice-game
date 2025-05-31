import { Message } from "node-telegram-bot-api";
import { bot } from "../app";
import { play } from "../utils/play";
import { redisClient } from "../db/redis/redisClient";
import { usersCollection } from "../db/mongo/mongoClient";

export async function onBalance(msg: Message) {
    const userId = msg.from?.id
    if (!userId) return

    try {
        const user = await usersCollection.findOne({id: userId}, {projection: {balance: 1}})
        if(!user) {
            bot.sendMessage(userId, 'Нажмите /start чтобы зарегистрироваться')
            return
        }
        bot.sendMessage(userId, `Ваш баланс - ${user.balance}`, {
            reply_markup: {
                inline_keyboard: [[{text: "Пополнить", callback_data: 'DEPOSIT'}]]
            }
        })
    }
    catch (e) {
        bot.sendMessage(userId, 'ошибка')
    }
}   