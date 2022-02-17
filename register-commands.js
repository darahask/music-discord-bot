require("dotenv").config();
const { REST } = require("@discordjs/rest");

const commands = [
    {
        name: "help",
        description: "lists all commands",
    },
    {
        name: "play",
        description: "Plays songs from youtube and spotify ",
        options: [
            {
                name: "song",
                type: 3,
                description: "Enter URL or Name",
            },
        ],
    },
    {
        name: "add",
        description: "Add songs to the queue",
        options: [
            {
                name: "song",
                type: 3,
                description: "Enter URL or Name",
                required: true,
            },
        ],
    },
    {
        name: "next",
        description: "Skip to the next song in the queue",
    },
    {
        name: "list",
        description: "See the music queue",
    },
    {
        name: "pause",
        description: "Pauses the song that is currently playing",
    },
    {
        name: "resume",
        description: "Resume playback of the current song",
    },
    {
        name: "clear",
        description: "Clears song queue",
    },
    {
        name: "leave",
        description: "Leave the voice channel",
    },
    {
        name: "bass",
        description: "Boosts the bass",
        options: [
            {
                name: "bass",
                type: 3,
                description:
                    "Enter any value from 1 to 12, for no bass set it back to 0",
                required: true,
            },
        ],
    },
    {
        name: "treble",
        description: "Increases the treble",
        options: [
            {
                name: "treble",
                type: 3,
                description:
                    "Enter any value from 1 to 12, for no treble set it back to 0",
                required: true,
            },
        ],
    },
    {
        name: "partytogether",
        description: "Creates a watch party link",
        options: [
            {
                choices: [
                    {
                        name: "Youtube",
                        value: "youtube",
                    },
                    {
                        name: "Betrayal",
                        value: "betrayal",
                    },
                    {
                        name: "Fishing",
                        value: "fishing",
                    },
                    {
                        name: "Wordsnack",
                        value: "wordsnack",
                    },
                    {
                        name: "Doodlecrew",
                        value: "doodlecrew",
                    },
                    {
                        name: "Sketchheads",
                        value: "sketchheads",
                    },
                ],
                name: "party-together",
                type: 3,
                description: "Select one of the choices displayed",
                required: true,
            },
        ],
    },
];
const application_id = process.env.APPLICATION_ID;
const token = process.env.CLIENT_TOKEN;
const URL = `/applications/${application_id}/commands`;
const rest = new REST({ version: "9" }).setToken(token);

(async () => {
    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(URL, { body: commands });

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
})();
