const { MessageEmbed } = require("discord.js");

function getHelpEmbed() {
    let mainStr = `\`/play <url> or <song-name>\`\n\`/add <url> or <song-name>\`\n\`/list\`\n\`/next\`\n\`/pause\`\n\`/resume\`\n\`/clear\`\n\`/leave\`\n\`/bass <values from 1 to 12>\`\n\`/treble <values from 1 to 12>\`\n\`/partytogether <options>\``;
    const exampleEmbed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Medley bot commands 🎵")
        .setAuthor({ name: "By Darahas" })
        .setThumbnail("https://i.imgur.com/mKkSZOl.png")
        .setDescription(mainStr);

    return exampleEmbed;
}

function getListEmbed(data) {
    let fields = data.map((value) => {
        return {
            name: value.name,
            value: value.link,
        };
    });

    const exampleEmbed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Songs in queue 🎵")
        .setAuthor({ name: "By Darahas" })
        .setThumbnail("https://i.imgur.com/mKkSZOl.png")
        .setFields(fields);

    return exampleEmbed;
}

module.exports = { getHelpEmbed, getListEmbed };
