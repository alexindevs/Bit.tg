import { Bot } from "grammy";
import { addShortenRequest, deleteShortenRequest, getAllUrls, getOriginalUrl, getShortenRequest, shortenUrl } from "./helper";

const botToken = process.env.BOT_TOKEN;
if (!botToken) {
    throw new Error("BOT_TOKEN is not set");
}

const bot = new Bot(botToken);


bot.command("start", async (ctx) => {
    await ctx.reply(`👋 Welcome to Bit.tg, your personal URL shortener bot on Telegram!
    
    Bit.tg is born out of a simple desire to streamline your online experience. Tired of long, unwieldy URLs cluttering your messages? Say no more! With Bit.tg, you can shorten any URL into a concise, shareable link with just a few taps.
    
    Inspired by the need for efficiency and convenience, Bit.tg aims to simplify the way you share links on Telegram. Whether you're sharing articles, videos, or any other web content, Bit.tg has got you covered.
    
    Built with passion and precision by Alexin, a seasoned software engineer with a knack for crafting tools that solve real-world problems, Bit.tg is here to enhance your Telegram experience.
    
    Ready to start shortening URLs effortlessly? Just send me any long URL, and I'll do the rest!`);
});

bot.hears('Tell me more about Alexin.', async (ctx) => {
    await ctx.reply(`
    Alexin is a driven and dedicated software engineer based in Lagos, Nigeria. With a passion for coding, problem-solving, and continuous learning, they are always eager to tackle new challenges in the world of technology.

Having recently embarked on an internship journey at Xavier Paisley Ltd., Alexin is gaining practical experience while honing their skills in backend engineering. Their decision to pursue further education at Altschool Africa reflects their commitment to personal and professional growth in the field of backend engineering.

Alexin's portfolio is marked by a series of innovative projects, including their latest endeavor: Bit.tg, a URL shortener bot on Telegram. This project showcases their ability to identify user needs and develop practical solutions using their technical expertise.    `)
})

bot.command("shorten", async (ctx) => {
    const userId = ctx.from?.id || 0;
    if (!ctx.from) {
        await ctx.reply("Please share this bot with your Telegram account.");
        return;
    }

    // Check if the user has a pending shorten request
    if (await getShortenRequest(userId)) {
        await ctx.reply("You already have a pending shorten request. Please provide the URL.");
        return;
    }

    // Set the user's state to indicate a pending shorten request
    await addShortenRequest(userId);

    // Prompt the user for the URL
    await ctx.reply("Please provide the URL you want to shorten.");
});

bot.on("message", async (ctx) => {
    const userId = ctx.from.id;
    const message = ctx.message;

    if (await getShortenRequest(userId)) {
        const url = message.text;

        if (!url) {
            await ctx.reply("Please provide a URL.");
            return;
        }

        if (!isValidUrl(url)) {
            await ctx.reply("Please provide a valid URL.");
            return;
        }

        const shortenedUrl = shortenUrl(url, userId);

        await ctx.reply(`Here's your shortened URL: ${shortenedUrl}`);

        await deleteShortenRequest(userId);
    }
});

bot.command("geturl", async (ctx) => {
    if (!ctx.from) {
        await ctx.reply("Please share this bot with your Telegram account.");
        return;
    }
    if (!ctx.message) {
        await ctx.reply("Please provide the shortened URL.");
        return;
    }
    const userId = ctx.from.id;
    const url = await getOriginalUrl(ctx.message.text);
    if (url) {
        await ctx.reply(`Original URL: ${url}`);
    } else {
        await ctx.reply("Shortened URL not found.");
    }
});

bot.command("cancel", async (ctx) => {
    if (!ctx.from) {
        await ctx.reply("Please share this bot with your Telegram account.");
        return;
    }
    const userId = ctx.from.id;
    await deleteShortenRequest(userId);
    await ctx.reply("Shorten request canceled.");
});

bot.command("getmyurls", async (ctx) => {
    if (!ctx.from) {
        await ctx.reply("Please share this bot with your Telegram account.");
        return;
    }
    const userId = ctx.from.id;
    const urls = await getAllUrls(userId);
    if (urls.length > 0) {
        let replyMessage = "Here are your shortened URLs:\n\n";
        replyMessage += "| Original URL | Shortcode |\n";
        replyMessage += "|--------------|-----------|\n";
    
        urls.forEach((url: any) => {
            replyMessage += `| ${url.originalUrl} | ${url.shortCode} |\n`;
        });
    
        await ctx.reply(replyMessage, { parse_mode: "Markdown" });
    } else {
        await ctx.reply("You haven't shortened any URLs yet.");
    }
});

// Function to validate URL
function isValidUrl(url: string): boolean {
    const urlRegex = /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
    return urlRegex.test(url);
}

export { bot };