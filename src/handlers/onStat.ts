import { Message } from "node-telegram-bot-api";
import { bot } from "../app";
import { usersCollection } from "../db/mongo/mongoClient";

export async function onStat(msg: Message) {
    const userId = msg.from?.id
    if (!userId) return

    try {
        const user = await usersCollection.findOne({ id: userId })
        if (!user) {
            bot.sendMessage(userId, 'Нажмите /start чтобы зарегистрироваться')
            return
        }
        bot.sendMessage(userId, `кол-во игр - ${user.gameCount}, общая сумма проигрышей - ${user.loseSum}, сумма выигрышей - ${user.winSum}`)
    } catch (e) {
        bot.sendMessage(userId, 'ошибка')
    }
}