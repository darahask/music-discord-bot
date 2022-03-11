const {
    joinVoiceChannel,
    createAudioPlayer,
    AudioPlayerStatus,
    VoiceConnectionStatus,
} = require("@discordjs/voice");
const createResource = require("../audioutils/create-resource");
const {
    getHelpEmbed,
    getListEmbed,
    getPlayerButtons,
    getSingleMessageEmbed,
} = require("../audioutils/message-embed");
const Queue = require("./Queue");

class Player {
    constructor() {
        this.interaction = {};
        this.queue = new Queue();
        this.state = new Map();
    }

    setInteraction(interaction) {
        this.interaction = interaction;
        this.queue.setId(interaction.guild.id);
    }

    async changeHandler(connection, player, oldState, newState) {
        if (
            oldState.status === AudioPlayerStatus.Playing &&
            newState.status === AudioPlayerStatus.Idle
        ) {
            if (connection.state.status === VoiceConnectionStatus.Ready) {
                console.log("Song changed!");
                let res = this.queue.next();
                if (res) {
                    this.interaction.channel.send({
                        embeds: [getSingleMessageEmbed("Playing", res.name)],
                    });
                    player.play(await createResource(res));
                    this.queue.resetSeek();
                } else {
                    this.interaction.channel.send("Finished Playing songs 😊");
                }
            }
        }
    }

    getNewPlayer() {
        let connection = joinVoiceChannel({
            channelId: this.interaction.member.voice.channel.id,
            guildId: this.interaction.guild.id,
            adapterCreator: this.interaction.guild.voiceAdapterCreator,
        });
        let player = createAudioPlayer();
        connection.subscribe(player);

        connection.on("stateChange", (_, newState) => {
            if (
                newState.status === VoiceConnectionStatus.Destroyed ||
                newState.status === VoiceConnectionStatus.Destroyed
            ) {
                console.log("Player Stopped!");
                player.stop();
            }
        });
        player.on("stateChange", (oldState, newState) =>
            this.changeHandler(connection, player, oldState, newState)
        );
        player.on("error", (error) => {
            console.log(error);
        });

        this.state.set(this.interaction.guild.id, { connection, player });
        return player;
    }

    async playSong() {
        if (!this.interaction.member.voice.channel)
            return this.interaction.reply("Please join a voice channel 😅");
        let id = this.interaction.guild.id;
        let voice = this.state.get(id);
        let song = this.interaction.options.getString("song");

        if (song && isNaN(song.trim())) {
            await this.interaction.reply("Please while i am fetching songs 😁");
            await this.queue.add(song);
            if (voice) {
                if (voice.player.state.status === AudioPlayerStatus.Playing) {
                    return this.interaction.editReply(
                        "Player is already playing, Added to queue 👍"
                    );
                }
                let res = this.queue.next();
                voice.player.play(await createResource(res));
                await this.interaction.editReply({
                    content: null,
                    embeds: [getSingleMessageEmbed("Playing", res.name)],
                    components: [...getPlayerButtons()],
                });
            } else {
                let player = this.getNewPlayer();
                let res = this.queue.next();
                player.play(await createResource(res));
                await this.interaction.editReply({
                    content: null,
                    embeds: [getSingleMessageEmbed("Playing", res.name)],
                    components: [...getPlayerButtons()],
                });
            }
        } else if (song) {
            let ind = parseInt(song) - 1;
            let res = this.queue.getByIndex(ind);
            if (voice) {
                if (res) {
                    voice.player.play(await createResource(res));
                    await this.interaction.reply({
                        content: null,
                        embeds: [getSingleMessageEmbed("Playing", res.name)],
                        components: [...getPlayerButtons()],
                    });
                } else {
                    await this.interaction.reply(
                        "Song queue is empty or wrong index 😅"
                    );
                }
            } else {
                if (res) {
                    let player = this.getNewPlayer();
                    player.play(await createResource(res));
                    await this.interaction.reply({
                        content: null,
                        embeds: [getSingleMessageEmbed("Playing", res.name)],
                        components: [...getPlayerButtons()],
                    });
                } else {
                    await this.interaction.reply(
                        "Song queue is empty or wrong index 😅"
                    );
                }
            }
        } else {
            let res = this.queue.next();
            if (voice) {
                if (voice.player.state.status === AudioPlayerStatus.Playing)
                    return this.interaction.reply(
                        "Player is already playing 😅"
                    );

                if (res) {
                    voice.player.play(await createResource(res));
                    await this.interaction.reply({
                        content: null,
                        embeds: [getSingleMessageEmbed("Playing", res.name)],
                        components: [...getPlayerButtons()],
                    });
                } else {
                    await this.interaction.reply("Song queue is empty 😅");
                }
            } else {
                if (res) {
                    let player = this.getNewPlayer();
                    player.play(await createResource(res));
                    await this.interaction.reply({
                        content: null,
                        embeds: [getSingleMessageEmbed("Playing", res.name)],
                        components: [...getPlayerButtons()],
                    });
                } else {
                    await this.interaction.reply("Song queue is empty 😅");
                }
            }
        }
    }

    async addSong() {
        let song = this.interaction.options.getString("song");
        if (!song) {
            this.interaction.reply("Please enter song name or song url 🥺");
            return;
        }
        await this.interaction.reply("Please while i am fetching songs 😁");
        await this.queue.add(song);
        await this.interaction.editReply("Added to queue 👍");
    }

    pauseSong(isButton = false) {
        if (isButton) {
            this.interaction.update({
                content: "Player paused!",
                embeds: [],
            });
        } else {
            this.interaction.reply("Player paused!");
        }
        let voice = this.state.get(this.interaction.guild.id);
        if (voice && voice.player) voice.player.pause();
    }

    resumeSong(isButton = false) {
        if (isButton) {
            this.interaction.update({
                content: "Player resumed!",
                embeds: [],
            });
        } else {
            this.interaction.reply("Player resumed!");
        }
        let voice = this.state.get(this.interaction.guild.id);
        if (voice && voice.player) voice.player.unpause();
    }

    playNextSong(isButton = false) {
        if (isButton) {
            this.interaction.update({
                content: "Song skipped 🖖",
                embeds: [],
            });
        } else {
            this.interaction.reply("Skipped song 🖖");
        }
        let voice = this.state.get(this.interaction.guild.id);
        if (voice && voice.player) voice.player.stop();
    }

    setBass() {
        let bass = this.interaction.options.getString("bass");
        if (!bass) {
            this.interaction.reply("Please enter a value 🥺");
            return;
        }
        this.interaction.reply("Bass set Succesfully!");
        let id = this.interaction.guild.id;
        let voice = this.state.get(id);
        this.queue.setBass(bass);

        if (voice && voice.player) {
            this.queue.back();
            voice.player.stop();
        }
    }

    setTreble() {
        let treble = this.interaction.options.getString("treble");
        if (!treble) {
            this.interaction.reply("Please enter a value 🥺");
            return;
        }
        this.interaction.reply("Treble set Succesfully!");
        let id = this.interaction.guild.id;
        let voice = this.state.get(id);
        this.queue.setTreble(treble);

        if (voice && voice.player) {
            this.queue.back();
            voice.player.stop();
        }
    }

    setVolume() {
        let volume = this.interaction.options.getString("volume");
        if (!volume) {
            this.interaction.reply("Please enter a value 🥺");
            return;
        }
        this.interaction.reply("volume set Succesfully!");
        let id = this.interaction.guild.id;
        let voice = this.state.get(id);
        this.queue.setVolume(volume);

        if (voice && voice.player) {
            this.queue.back();
            voice.player.stop();
        }
    }

    seek() {
        let seek = this.interaction.options.getString("seek");
        if (!seek) {
            this.interaction.reply("Please enter a value 🥺");
            return;
        }
        this.interaction.reply(`Seeking to ${seek}`);
        let id = this.interaction.guild.id;
        let voice = this.state.get(id);
        this.queue.seek(seek);

        if (voice && voice.player) {
            this.queue.back();
            voice.player.stop();
        }
    }

    displayQueue(isButton = false) {
        let { queue, index } = this.queue.getList();
        if (isButton) {
            this.interaction.update({
                content: null,
                embeds: [getListEmbed(queue, index)],
            });
        } else {
            this.interaction.reply({
                embeds: [getListEmbed(queue, index)],
            });
        }
    }

    clearQueue(isButton = false) {
        if (isButton) {
            this.interaction.update({
                content: "Queue Cleared 👍",
                embeds: [],
            });
        } else {
            this.interaction.reply("Queue Cleared 👍");
        }
        this.queue.destroy();
    }

    help() {
        this.interaction.reply({ embeds: [getHelpEmbed()] });
    }

    destroy(isButton = false) {
        if (isButton) {
            this.interaction.update({
                content: "🥺😢😭, I am leaving the channel 😤",
                embeds: [],
                components: [],
            });
        } else {
            this.interaction.reply("🥺😢😭, I am leaving the channel 😤");
        }
        let voice = this.state.get(this.interaction.guild.id);
        if (voice && voice.connection) voice.connection.destroy();
        this.queue.destroy();
        this.state.set(this.interaction.guild.id, null);
    }
}

module.exports = Player;
