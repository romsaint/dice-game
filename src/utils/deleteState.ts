import { redisClient } from "../db/redis/redisClient";

export async function deleteState(userId: number) {
    await redisClient.del(`${userId}`)
    await redisClient.del(`${userId}-money`)
}