import { CallbackQuery } from "node-telegram-bot-api";
import { pay } from "../utils/pay";
import { deleteState } from "../utils/deleteState";
import { bot } from "../app";
import { deposit } from "../utils/deposit";

export async function onQuery(query: CallbackQuery) {
    const data = query.data
    const userId = query.from.id

    if (data === 'EXIT') {
        await deleteState(userId)
        bot.sendMessage(userId, 'Вы вышли из игры')
        return
    }
    if (data === 'DEPOSIT') {
        await deposit(userId)
        return
    }

    if (data === 'PLAY') {
        await pay(userId)
        return
    }
}