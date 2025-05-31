import { config } from 'dotenv'
config()
import TelegramBot from 'node-telegram-bot-api';
import { mongoClient } from './db/mongo/mongoClient';
import { onPlay } from './handlers/onPLay';
import { onStart } from './handlers/onStart';
import { onQuery } from './handlers/onQuery';
import { onText } from './handlers/onText';
import { onBalance } from './handlers/onBalance';
import { onDeposit } from './handlers/onDeposit';

const token = process.env.TOKEN
if (!token) {
    throw new Error('TOKEN')
}

export const bot = new TelegramBot(token, { polling: true })

async function connectMongo() {
    await mongoClient.connect()
}
connectMongo()

bot.setMyCommands([
    { command: "play", description: "Играть!" },
    { command: "start", description: "Начать" },
    { command: "deposit", description: "Пополнить баланс" },
    { command: "balance", description: "Посмотреть баланс" },
    { command: "stat", description: "Посмотреть статистику игр" },
    { command: "withdrawal", description: "Вывод средств" },
])


bot.onText(/\/start/, onStart)
bot.on('text', onText)
bot.on('callback_query', onQuery)
bot.onText(/\/play/, onPlay)
bot.onText(/\/balance/, onBalance)
bot.onText(/\/deposit/, onDeposit)