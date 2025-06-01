import { Message } from "node-telegram-bot-api";
import { bot } from "../app";
import { play } from "../utils/play";
import { redisClient } from "../db/redis/redisClient";

export async function onPlay(msg: Message) {
    const userId = msg.from?.id
    if (!userId) return
    // await usersCollection.deleteOne({id: userId})
    // await deleteState(userId)
    
    try {
        const redisState = await redisClient.get(`${userId}`)
        
        if(redisState !== 'PAY_STATE' && redisState !== 'DEPOSIT_STATE' && redisState !== null) {
            bot.sendMessage(userId, 'Вы уже играете', {
                reply_markup: {
                    inline_keyboard: [[{text: "Выйти", callback_data: 'EXIT'}]]
                }
            })
            return
        }

        await play(userId)
    }
    catch (e) {
        bot.sendMessage(userId, 'ошибка')
    }
}   