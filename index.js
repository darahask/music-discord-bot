require("dotenv").config(); //initialize dotenv
const { Client } = require("discord.js");
const play = require("play-dl");
const { getHelpEmbed, getListEmbed } = require("./scripts/message-embed");
const {
    playSong,
    addSong,
    nextSong,
    nextSongButton,
    bass,
    treble,
    leave,
    getWatchLink,
} = require("./handlers/handlers");
const { getResourceQueue } = require("./handlers/handlerutils");
const { DiscordTogether } = require("discord-together");

play.setToken({
    spotify: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: process.env.REFRESH_TOKEN,
        market: "IN",
    },
});

let playerObj = new Map();
let audioFilters = new Map();
let resourceQueue = new Map();

// Discord client
const client = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"],
});

client.discordTogether = new DiscordTogether(client);

client.once("ready", () => {
    console.log("Connected on: " + Date());
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.guildId) return;

    if (interaction.isCommand()) {
        try {
            switch (interaction.commandName) {
                case "help":
                    interaction.reply({ embeds: [getHelpEmbed()] });
                    break;
                case "play":
                    playSong({
                        interaction,
                        playerObj,
                        resourceQueue,
                        audioFilters,
                    });
                    break;
                case "add":
                    addSong({ interaction, resourceQueue, audioFilters });
                    break;
                case "next":
                    nextSong({ interaction, playerObj, resourceQueue });
                    break;
                case "list":
                    let list = getResourceQueue(
                        resourceQueue,
                        interaction.guild.id
                    );
                    interaction.reply({
                        embeds: [getListEmbed(list)],
                    });
                    break;
                case "pause":
                    interaction.reply(`Player paused!`);
                    playerObj.get(interaction.guild.id).audioPlayer.pause();
                    break;
                case "resume":
                    interaction.reply(`Player resumed!`);
                    playerObj.get(interaction.guild.id).audioPlayer.unpause();
                    break;
                case "clear":
                    resourceQueue.set(interaction.guild.id, []);
                    interaction.reply(`Queue cleared 👍`);
                    break;
                case "leave":
                    leave({ interaction, playerObj, resourceQueue });
                    break;
                case "bass":
                    bass({ interaction, audioFilters });
                    break;
                case "treble":
                    treble({ interaction, audioFilters });
                    break;
                case "partytogether":
                    getWatchLink(interaction, client);
                    break;
            }
        } catch (e) {
            console.log(Date(), e);
        }
    } else if (interaction.isButton()) {
        try {
            switch (interaction.customId) {
                case "pause":
                    playerObj.get(interaction.guild.id).audioPlayer.pause();
                    interaction.update("Player paused!");
                    break;
                case "resume":
                    playerObj.get(interaction.guild.id).audioPlayer.unpause();
                    interaction.update("Player resumed!");
                    break;
                case "next":
                    nextSongButton({ interaction, playerObj, resourceQueue });
                    break;
            }
        } catch (e) {
            console.log(e);
        }
    } else {
        return;
    }
});

client.login(process.env.CLIENT_TOKEN);
