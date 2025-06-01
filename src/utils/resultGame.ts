import { bot } from "../app"
import { usersCollection } from "../db/mongo/mongoClient"
import { TypeDicePlay } from "../interfaces/dicePlay.interface"

export async function resultGame(userId: number, win: boolean, game: TypeDicePlay, moneyWin?: number) {
    if(!game) return
    if (win && game?.msg === 'Вы выиграли!!') {
        const user = await usersCollection.findOne({ id: userId })
        await bot.sendMessage(userId, `Выпало число - ${game.randomNum}`)
        await bot.sendMessage(userId, `Вы выиграли ${moneyWin} рублей, ваш баланс - ${user?.balance}`)
    } else {
        const user = await usersCollection.findOne({ id: userId })
        await bot.sendMessage(userId, `Выпало число - ${game.randomNum}`)
        await bot.sendMessage(userId, `Вы проиграли, ваш баланс - ${user?.balance}`)
    }

}