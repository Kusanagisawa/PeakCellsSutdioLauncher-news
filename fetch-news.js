const fs = require('fs');

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

async function fetchNews() {
    const response = await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages?limit=100`, {
        headers: { "Authorization": `Bot ${TOKEN}` }
    });

    if (!response.ok) {
        console.error("Erreur Discord:", response.status);
        process.exit(1);
    }

    const messages = await response.json();
    const formattedNews = messages
        .filter(msg => !msg.author.bot && msg.content.length > 0) // On ignore les messages des bots et les messages sans texte
        .map(msg => {
        const dateObj = new Date(msg.timestamp);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return {
            author: msg.author.username,
            date: dateObj.toLocaleDateString('fr-FR', options),
            content: msg.content,
            // Ajoute l'URL de l'avatar s'il existe
            avatar: msg.author.avatar ? `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png` : ""
        };
    });

    fs.writeFileSync('news.json', JSON.stringify(formattedNews, null, 2));
}

fetchNews();
