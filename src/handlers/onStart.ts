import { Message } from "node-telegram-bot-api";
import { usersCollection } from "../db/mongo/mongoClient";
import { IUser } from "../interfaces/user.interface";
import { bot } from "../app";
import { redisClient } from "../db/redis/redisClient";

export async function onStart(msg: Message) {
    const userId = msg.from?.id
    if (!userId) return
    const user = await usersCollection.findOne({ id: userId })
    const redisState = await redisClient.get(`${userId}`)
   
    if(redisState !== 'PAY_STATE' && redisState !== 'DEPOSIT_STATE' && redisState !== null) {
        bot.sendMessage(userId, 'Вы уже играете', {
                reply_markup: {
                    inline_keyboard: [[{text: "Выйти", callback_data: 'EXIT'}]]
                }
            })
        return
    }

    if (!user) {
        const newUser: IUser = { balance: 0, gameCount: 0, id: userId, loseSum: 0, winSum: 0 }
        await usersCollection.insertOne(newUser)
        bot.sendMessage(userId, 'Добро пожаловать в игру Wintab Dice! В этой игре вы должны угадать число, которое выпало на игральном кубике либо диапазон чисел (от 2 до 4 и т.д), если угадаете, то приумножите свои деньги!', {
            reply_markup: {
                inline_keyboard: [[{ text: "ИГРАТЬ!", callback_data: "PLAY" }]]
            }
        })
    } else {
        bot.sendMessage(userId, 'Сыграй-ка еще!', {
            reply_markup: {
                inline_keyboard: [[{ text: "ИГРАТЬ!", callback_data: "PLAY" }]]
            }
        })
    }
}