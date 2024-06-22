import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
dotenv.config();
const token = process.env.TOKEN;  // Using environment variable for security
console.log(token);

if (!token) {
    console.error('EFATAL: Telegram Bot Token not provided!');
    console.log("no token provided")
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// Start the game
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Tap!', callback_data: 'tap' }]
            ]
        }
    };
    bot.sendMessage(chatId, 'Tap the button!', opts);
    bot.userData = bot.userData || {};
    bot.userData[chatId] = { count: 0 };
});

// Handle button taps
bot.on('callback_query', (callbackQuery) => {
    const msg = callbackQuery.message;
    const chatId = msg.chat.id;
    const data = callbackQuery.data;

    if (data === 'tap') {
        bot.userData[chatId].count += 1;
        const newText = `Taps: ${bot.userData[chatId].count}\nTap the button!`;
        const opts = {
            chat_id: chatId,
            message_id: msg.message_id,
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Tap!', callback_data: 'tap' }]
                ]
            }
        };
        bot.editMessageText(newText, opts);
    }
});
