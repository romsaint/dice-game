import { bot } from "../app";
import { redisClient } from "../db/redis/redisClient";

export async function deposit(userId: number) {
    try{
        await redisClient.set(`${userId}`, 'DEPOSIT_STATE')
        bot.sendMessage(userId, 'Внесите сумму денег')
    }catch(e) {
        bot.sendMessage(userId, 'Ошибка')
    }
}