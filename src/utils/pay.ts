import { bot } from "../app"
import { usersCollection } from "../db/mongo/mongoClient"
import { redisClient } from "../db/redis/redisClient"

export async function pay(userId: number) {
    const user = await usersCollection.findOne({ id: userId })
    if (!user) {
        bot.sendMessage(userId, 'Нажмите /start чтобы зарегистрироватсья')
    }
    else {
        bot.sendMessage(userId, 'Введите сумму игры')
        await redisClient.set(`${userId}`, 'PAY_STATE')
        return
    }
}