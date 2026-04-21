const fs = require('fs');

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

async function fetchNews() {
    const response = await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages?limit=10`, {
        headers: { "Authorization": `Bot ${TOKEN}` }
    });

    if (!response.ok) {
        console.error("Erreur Discord:", response.status);
        process.exit(1);
    }

    const messages = await response.json();
    const formattedNews = messages.map(msg => {
        const dateObj = new Date(msg.timestamp);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return {
            author: msg.author.username,
            date: dateObj.toLocaleDateString('fr-FR', options),
            content: msg.content
        };
    });

    fs.writeFileSync('news.json', JSON.stringify(formattedNews, null, 2));
}

fetchNews();
