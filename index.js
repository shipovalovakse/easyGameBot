const TelegramApi = require ('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')
//не просто импорты, т к в package.json "type": "commonjs", а не module. такой формат используется по умолчанию

const TG_TOKEN = require('./.env')
const bot = new TelegramApi (TG_TOKEN, {polling: true});
const chats = [];

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'cейчас я загадаю цифру от 1 до 9, а ты попробуй ее отгадать');
    const random = Math.floor(Math.random() * 10);
    chats[chatId] = random;//мутирует это шо
    await bot.sendMessage(chatId, 'отгадывай', gameOptions)
}

bot.setMyCommands([
    {command: '/start', description: 'начало работы'},
    {command: '/info', description: 'информация о юзере'},
    {command: '/game', description: 'давай поиграем'},
])

const start = async () => {
    await bot.setMyCommands([
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

        if (Number(data) === Number(chats[chatId])) {
            await bot.sendMessage(chatId, `Ты угадал! Цифра ${chats[chatId]}`, againOptions)
        } else {
            await bot.sendMessage(chatId, `Ты не угадал! Цифра ${chats[chatId]}`, againOptions)
        }
    })
}

start()