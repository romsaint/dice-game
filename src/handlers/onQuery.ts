import { CallbackQuery } from "node-telegram-bot-api";
import { play } from "../utils/play";
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
        await play(userId)
        return
    }
}