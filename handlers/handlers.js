const { AudioPlayerStatus } = require("@discordjs/voice");
const createUrlList = require("../scripts/audio-list");
const createResource = require("../scripts/create-resource");
const {
    getResourceQueue,
    getaudioFilters,
    getNewPlayer,
    getPlayerButtons,
} = require("./handlerutils");

// command handlers
async function playSong(params) {
    const { interaction, playerObj, resourceQueue, audioFilters } = params;

    if (!interaction.member.voice.channel)
        return interaction.reply("Please join a voice channel 😅");

    let queue = getResourceQueue(resourceQueue, interaction.guild.id);
    let song = interaction.options.getString("song");
    let player = playerObj.get(interaction.guild.id);

    if (song) {
        await interaction.reply("Please while i am fetching songs 😁");
        let a = getaudioFilters(audioFilters, interaction.guild.id);
        let res = await createUrlList(song.trim(), a.bass, a.treble);
        queue = [...queue, ...res];

        if (player) {
            if (player.audioPlayer.state.status === AudioPlayerStatus.Playing) {
                resourceQueue.set(interaction.guild.id, queue);
                return interaction.editReply(
                    "Player is already playing, Added to queue 👍"
                );
            }
            let s = queue.shift();
            player.audioPlayer.play(await createResource(s));
            resourceQueue.set(interaction.guild.id, queue);
            await interaction.editReply({
                content: "Started playing songs 😁",
                components: [...getPlayerButtons()],
            });
        } else {
            let s = queue.shift();
            let temp = getNewPlayer({ interaction, resourceQueue, playerObj });
            temp.audioPlayer.play(await createResource(s));
            resourceQueue.set(interaction.guild.id, queue);
            await interaction.editReply({
                content: "Started playing songs 😁",
                components: [...getPlayerButtons()],
            });
        }
    } else {
        if (player) {
            if (player.audioPlayer.state.status === AudioPlayerStatus.Playing)
                return interaction.reply("Player is already playing 😅");
            if (queue.length !== 0) {
                let s = queue.shift();
                player.audioPlayer.play(await createResource(s));
                resourceQueue.set(interaction.guild.id, queue);
                await interaction.reply({
                    content: "Started playing songs 😁",
                    components: [...getPlayerButtons()],
                });
            } else {
                await interaction.reply("Song queue is empty 😅");
            }
        } else {
            if (queue.length !== 0) {
                let s = queue.shift();
                let temp = getNewPlayer({
                    interaction,
                    resourceQueue,
                    playerObj,
                });
                temp.audioPlayer.play(await createResource(s));
                resourceQueue.set(interaction.guild.id, queue);
                await interaction.reply({
                    content: "Started playing songs 😁",
                    components: [...getPlayerButtons()],
                });
            } else {
                await interaction.reply("Song queue is empty 😅");
            }
        }
    }
}

async function addSong(params) {
    const { interaction, resourceQueue, audioFilters } = params;

    let queue = getResourceQueue(resourceQueue, interaction.guild.id);
    let song = interaction.options.getString("song");

    if (!song) {
        interaction.reply("Please enter song name or song url 🥺");
        return;
    }

    await interaction.reply("Please while i am fetching songs 😁");
    let a = getaudioFilters(audioFilters, interaction.guild.id);
    let res = await createUrlList(song.trim(), a.bass, a.treble);

    resourceQueue.set(interaction.guild.id, [...queue, ...res]);
    await interaction.editReply("Added to queue 👍");
}

async function nextSong(params) {
    const { interaction, playerObj, resourceQueue } = params;

    let song_list = getResourceQueue(resourceQueue, interaction.guild.id);
    if (song_list.length !== 0) {
        let player = playerObj.get(interaction.guild.id).audioPlayer;
        player.stop();
        await interaction.reply("Current song skipped 🖖");
    } else {
        await interaction.reply("Finished Playing songs 😊");
    }
}

async function nextSongButton(params) {
    const { interaction, playerObj, resourceQueue } = params;

    let song_list = getResourceQueue(resourceQueue, interaction.guildId);
    if (song_list.length !== 0) {
        let player = playerObj.get(interaction.guildId).audioPlayer;
        player.stop();
        await interaction.update("Current song skipped 🖖");
    } else {
        await interaction.update("Finished Playing songs 😊");
    }
}

function bass(params) {
    let { interaction, audioFilters } = params;

    let args = interaction.options.getString("bass");
    if (!args) {
        interaction.reply("Please enter a value 🥺");
        return;
    }
    let a = getaudioFilters(audioFilters, interaction.guild.id);
    audioFilters.set(interaction.guild.id, { ...a, bass: args.trim() });
    interaction.reply("Bass set succesfully!");
}

function treble(params) {
    let { interaction, audioFilters } = params;

    let args = interaction.options.getString("treble");
    if (!args) {
        interaction.reply("Please enter a value 🥺");
        return;
    }
    let a = getaudioFilters(audioFilters, interaction.guild.id);
    audioFilters.set(interaction.guild.id, { ...a, treble: args.trim() });
    interaction.reply("Treble set succesfully!");
}

async function leave(params) {
    let { interaction, playerObj, resourceQueue } = params;
    if (!interaction.isButton())
        await interaction.reply("🥺😢😭, I am leaving the channel 😤");
    else
        await interaction.update({
            content: "🥺😢😭, I am leaving the channel 😤",
            components: [],
        });

    let p = playerObj.get(interaction.guild.id);
    if (p && p.audioPlayer) p.audioPlayer.stop();
    if (p && p.connection) p.connection.destroy();

    resourceQueue.set(interaction.guild.id, []);
    playerObj.set(interaction.guild.id, null);
}

async function getWatchLink(interaction, client) {
    if (!interaction.member.voice.channel)
        return interaction.reply("Please join a voice channel 😅");

    let voicechannel = interaction.member.voice.channel.id;
    let option = interaction.options.getString("party-together");

    client.discordTogether
        .createTogetherCode(voicechannel, option)
        .then(async (invite) => {
            interaction.reply(`Here's the link: ${invite.code}  🥳`);
        });
}

module.exports = {
    playSong,
    addSong,
    nextSong,
    nextSongButton,
    bass,
    treble,
    leave,
    getWatchLink,
};
