require("dotenv").config();
const play = require("play-dl");
const commands = require("./commands");
const { Client } = require("discord.js");
const Player = require("./classes/Player");
const { DiscordTogether } = require("discord-together");

play.setToken({
    spotify: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: process.env.REFRESH_TOKEN,
        market: "IN",
    },
});

const client = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"],
});

client.discordTogether = new DiscordTogether(client);
const player = new Player();

client.once("ready", () => {
    console.log("Connected on: " + Date());
    client.user.setActivity({
        name: "/help 😎",
        type: "LISTENING",
    });
    client.application.commands.set(commands);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.guildId) return;

    if (interaction.isCommand()) {
        player.setInteraction(interaction);

        try {
            switch (interaction.commandName) {
                case "help":
                    player.help();
                    break;
                case "play":
                    player.playSong();
                    break;
                case "add":
                    player.addSong();
                    break;
                case "next":
                    player.playNextSong();
                    break;
                case "list":
                    player.displayQueue();
                    break;
                case "pause":
                    player.pauseSong();
                    break;
                case "resume":
                    player.resumeSong();
                    break;
                case "clear":
                    player.clearQueue();
                    break;
                case "leave":
                    player.destroy();
                    break;
                case "bass":
                    player.setBass();
                    break;
                case "treble":
                    player.setTreble();
                    break;
                case "volume":
                    player.setVolume();
                    break;
                case "seek":
                    player.seek();
                    break;
                case "partytogether":
                    if (!interaction.member.voice.channel)
                        return interaction.reply(
                            "Please join a voice channel 😅"
                        );

                    let voicechannel = interaction.member.voice.channel.id;
                    let option =
                        interaction.options.getString("party-together");

                    client.discordTogether
                        .createTogetherCode(voicechannel, option)
                        .then(async (invite) => {
                            interaction.reply(
                                `Here's the link: ${invite.code}  🥳`
                            );
                        });
                    break;
            }
        } catch (e) {
            console.log(Date(), e);
        }
    } else if (interaction.isButton()) {
        try {
            player.setInteraction(interaction);

            if (!player.state.get(interaction.guildId))
                return interaction.update({
                    content: "Interaction expired!",
                    embeds: [],
                    components: [],
                });

            switch (interaction.customId) {
                case "pause":
                    player.pauseSong(true);
                    break;
                case "resume":
                    player.resumeSong(true);
                    break;
                case "next":
                    player.playNextSong(true);
                    break;
                case "list":
                    player.displayQueue(true);
                    break;
                case "clear":
                    player.clearQueue(true);
                    break;
                case "leave":
                    player.destroy(true);
                    break;
            }
        } catch (e) {
            console.log(Date(), e);
        }
    }
});

client.login(process.env.CLIENT_TOKEN);
