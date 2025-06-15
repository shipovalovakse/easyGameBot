const TelegramApi = require ('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')
const token = '7765850239:AAHxS1B1BLS8tGQeTCmMqqfx70l8bSBIbW0';

const bot = new TelegramApi (token, {polling: true});

const chats = [];

const gameOptions = {
    reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: '1', callback_data: '1'},{text: '2', callback_data: '2'},{text: '3', callback_data: '3'}],
                [{text: '4', callback_data: '4'},{text: '5', callback_data: '5'},{text: '6', callback_data: '6'}],
                [{text: '7', callback_data: '7'},{text: '8', callback_data: '8'}, {text: '9', callback_data: '9'}],
                [{text: '0', callback_data: '0'}],

            ]
        })
}

const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Играть еще раз', callback_data: '/again'}],

        ]
    })
}

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