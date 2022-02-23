const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

function getHelpEmbed() {
    let mainStr = `\`/play <url> or <song-name> or <index>\`\n\`/add <url> or <song-name>\`\n\`/list\`\n\`/next\`\n\`/pause\`\n\`/resume\`\n\`/clear\`\n\`/leave\`\n\`/bass <values from 1 to 50>\`\n\`/treble <values from 1 to 50>\`\n\`/partytogether <options>\``;
    const exampleEmbed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Medley bot commands 🎵")
        .setAuthor({ name: "By Darahas" })
        .setThumbnail("https://i.imgur.com/mKkSZOl.png")
        .setDescription(mainStr);

    return exampleEmbed;
}

function getListEmbed(data, i) {
    let fields = data.map((value, index) => {
        return {
            name:
                i === index
                    ? `➡  ${index + 1}: ` + value.name
                    : `${index + 1}: ` + value.name,
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

function getPlayerButtons() {
    const row1 = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("pause")
            .setEmoji("⏸")
            .setStyle("PRIMARY"),
        new MessageButton()
            .setCustomId("resume")
            .setEmoji("▶")
            .setStyle("SUCCESS"),
        new MessageButton().setCustomId("next").setEmoji("⏭").setStyle("DANGER")
    );

    const row2 = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("list")
            .setEmoji("📀")
            .setStyle("PRIMARY"),
        new MessageButton()
            .setCustomId("clear")
            .setEmoji("🧹")
            .setStyle("SUCCESS"),
        new MessageButton()
            .setCustomId("leave")
            .setEmoji("⏹")
            .setStyle("DANGER")
    );

    return [row1, row2];
}

module.exports = { getHelpEmbed, getListEmbed, getPlayerButtons };
