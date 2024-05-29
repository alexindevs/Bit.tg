import { bot } from './lib/bot';
import { connectDatabase } from './lib/db';
import { config } from 'dotenv';
import express from 'express';
import { getOriginalUrl } from './lib/helper';

config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/:shortenedUrl', async (req, res) => {
  const shortenedUrl = req.params.shortenedUrl;
  const originalUrl = await getOriginalUrl(shortenedUrl);
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).send('Shortened URL not found.');
  }
});

app.get('/bot', (req, res) => {
  res.redirect('https://t.me/BitTg_bot');
});

async function startBot() {
    await connectDatabase();

    bot.start();
    console.log('Bit.tg started');
}
startBot().catch(err => console.error(err));
app.listen(3000, () => {
    console.log('Server started on port 3000');
})