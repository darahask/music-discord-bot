const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

function getHelpEmbed() {
    const messageEmbed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Medley bot commands 🎵")
        .setAuthor({ name: "By Darahas" })
        .setThumbnail("https://i.imgur.com/mKkSZOl.png")
        .setFields([
            {
                name: "`/play`",
                value: "Inputs: url or name or index",
                inline: false,
            },
            {
                name: "`/add`",
                value: "Inputs: url or name",
                inline: false,
            },
            {
                name: "`/bass`",
                value: "Inputs: values from 1 to 50",
                inline: false,
            },
            {
                name: "`/treble`",
                value: "Inputs: values from 1 to 50",
                inline: false,
            },
            {
                name: "`/volume`",
                value: "Inputs: values from 1",
                inline: false,
            },
            {
                name: "`/partytogether`",
                value: "Inputs: select from options",
                inline: false,
            },
            {
                "name":"Controls:",
                "value":"`/pause` `/resume` `/next` `/list` `/clear` `/leave`"
            }
        ]);

    return messageEmbed;
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

function getSingleMessageEmbed(type, name) {
    return new MessageEmbed()
        .setFields([
            {
                name: type,
                value: name,
            },
        ])
        .setColor("#0099ff");
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

module.exports = {
    getHelpEmbed,
    getListEmbed,
    getPlayerButtons,
    getSingleMessageEmbed,
};
