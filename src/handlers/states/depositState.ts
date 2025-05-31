import { Message } from "node-telegram-bot-api";
import { IUser } from "../../interfaces/user.interface";
import { bot } from "../../app";
import { usersCollection } from "../../db/mongo/mongoClient";

export async function depositState(msg: Message, userId: number, user: IUser) {
    try {
        const money = Number(msg.text)
        if (isNaN(money)) {
            return
        }
        if (money < 10) {
            bot.sendMessage(userId, 'Мин 10 рублей')
            return
        }

        await usersCollection.updateOne({ id: userId }, { $inc: { balance: money } })
        const userNew = await usersCollection.findOne({ id: userId }, { projection: { balance: 1 } })

        bot.sendMessage(userId, `Успешно, ваш баланс - ${userNew?.balance}`, {
            reply_markup: {
                inline_keyboard: [[{text: "ИГРАТЬ!", callback_data: 'PLAY'}]]
            }
        })
        return
    } catch (e) {
        bot.sendMessage(userId, 'ошибка')
    }
}