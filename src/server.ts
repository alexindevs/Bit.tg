import { bot } from './lib/bot';
import { connectDatabase } from './lib/db';
import { config } from 'dotenv';

config();

async function startBot() {
    await connectDatabase();

    bot.start();
    console.log('Bit.tg started');
}

startBot().catch(err => console.error(err));