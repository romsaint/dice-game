import { Message } from "node-telegram-bot-api";
import { deposit } from "../utils/deposit";
import { usersCollection } from "../db/mongo/mongoClient";
import { bot } from "../app";

export async function onDeposit(msg: Message) {
    const userId = msg.from?.id
    if (!userId) return
    
    const user = await usersCollection.findOne({ id: userId }, { projection: { balance: 1 } })
    if (!user) {
        bot.sendMessage(userId, 'Нажмите /start чтобы зарегистрироваться')
        return
    }
    
    await deposit(userId)
}