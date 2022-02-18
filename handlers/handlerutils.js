const {
    joinVoiceChannel,
    createAudioPlayer,
    AudioPlayerStatus,
} = require("@discordjs/voice");
const { MessageActionRow, MessageButton } = require("discord.js");
const createResource = require("../scripts/create-resource");

//utility functions
function getResourceQueue(resourceQueue, id) {
    let x = resourceQueue.get(id);
    if (x) {
        return x;
    } else {
        return [];
    }
}

function getaudioFilters(audioFilters, id) {
    let x = audioFilters.get(id);
    if (x) {
        return x;
    } else {
        return { bass: "0", treble: "0" };
    }
}

function getNewPlayer(params) {
    let { interaction, resourceQueue, playerObj } = params;

    let temp = {
        connection: joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        }),
        audioPlayer: createAudioPlayer(),
    };
    temp.connection.subscribe(temp.audioPlayer);
    temp.audioPlayer.on("stateChange", async (oldState, newState) => {
        if (
            oldState.status === AudioPlayerStatus.Playing &&
            newState.status === AudioPlayerStatus.Idle
        ) {
            let song_list = getResourceQueue(
                resourceQueue,
                interaction.guild.id
            );
            if (song_list.length !== 0) {
                temp.audioPlayer.play(await createResource(song_list.shift()));
                resourceQueue.set(interaction.guild.id, song_list);
            } else {
                interaction.channel.send("Finished Playing songs 😊");
            }
        }
    });
    temp.audioPlayer.on("error", (error) => {
        console.log(error);
    });

    playerObj.set(interaction.guild.id, temp);
    return temp;
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
    getResourceQueue,
    getaudioFilters,
    getNewPlayer,
    getPlayerButtons,
};
