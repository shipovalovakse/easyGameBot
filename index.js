const TelegramApi = require ('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')
//не просто импорты, т к в package.json "type": "commonjs", а не module. такой формат используется по умолчанию
// import { gameOptions, againOptions } from './options.js'; - но вроде на такое не ругается

const token = '7765850239:AAHxS1B1BLS8tGQeTCmMqqfx70l8bSBIbW0';

const bot = new TelegramApi (token, {polling: true});

const chats = [];

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'cейчас я загадаю цифру от 1 до 9, а ты попробуй ее отгадать');
    const random = Math.floor(Math.random() * 10);
    chats[chatId] = random;
    await bot.sendMessage(chatId, 'отгадывай', gameOptions)
}

bot.setMyCommands([
    {command: '/start', description: 'начало работы'},
    {command: '/info', description: 'информация о юзере'},
    {command: '/game', description: 'давай поиграем'},
])

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'начало работы'},
        {command: '/info', description: 'информация о юзере'},
    ])

    //bot.on - метод из библиотеки node-telegram-bot-api, а не апи тг-бота
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://cdn2.combot.org/catsunicmass/webp/73xf09fa497.webp')
           return  bot.sendMessage(chatId, `Привет, пользователь! Добро пожаловать в чат-бот Ксении`)
        }

        if (text === '/info') {
            await bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }

        if (text === '/game') {
           return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'я тебя не понимаю :(')
    })

    bot.on('callback_query', async msg => {
        const chatId = msg.message.chat.id;
        const data = msg.data;

        if (data === '/again') {
            return startGame(chatId);
        }

        if (data === chats[chatId]) {
            bot.sendMessage(chatId, `Ты угадал! Цифра ${chats[chatId]}`, againOptions)
        } else {
            bot.sendMessage(chatId, `Ты не угадал! Цифра ${chats[chatId]}`, againOptions)
        }
    })
}

start()