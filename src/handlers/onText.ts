import { Message } from "node-telegram-bot-api";
import { bot } from "../app";
import { usersCollection } from "../db/mongo/mongoClient";
import { redisClient } from "../db/redis/redisClient";
import { payState } from "./states/payState";
import { playState } from "./states/playState";
import { depositState } from "./states/depositState";
import { deleteState } from "../utils/deleteState";

export async function onText(msg: Message) {
    const userId = msg.from?.id
    if (!userId) return

    try {
        const state = await redisClient.get(`${userId}`)
        const user = await usersCollection.findOne({ id: userId })
        if (!user) {
            return
        }
        if (state === 'PAY_STATE') {
            if (msg.text && msg.text.includes('.')) {
                bot.sendMessage(userId, 'Только целые числа')
                return
            }
            await payState(msg, userId, user)
        }
        if (state === 'DEPOSIT_STATE') {
            if (msg.text && msg.text.includes('.')) {
                bot.sendMessage(userId, 'Только целые числа')
                return
            }
            await depositState(msg, userId, user)
        }

        if (state && !isNaN(Number(state))) {
            if (user.balance < Number(state)) {
                bot.sendMessage(userId, 'Не хватает средств', {
                    reply_markup: {
                        inline_keyboard: [[{ text: "Пополнить", callback_data: 'DEPOSIT' }]]
                    }
                })
                await deleteState(userId)

                return
            }
            await playState(msg, Number(state), userId)
            return
        }

    } catch (e) {
        bot.sendMessage(userId, 'ошибка')
    }
}