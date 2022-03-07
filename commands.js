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
                description: "Enter URL or Name or Index",
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
        name: "volume",
        description: "Increases volume of the queue",
        options: [
            {
                name: "volume",
                type: 3,
                description: "Enter any value starting from 1, for original volume set to 0",
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
                    "Enter any value from 1 to 50, for no bass set it back to 0",
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
                    "Enter any value from 1 to 50, for no treble set it back to 0",
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

module.exports = commands;
