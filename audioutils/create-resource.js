const { FFmpeg, opus } = require("prism-media");
const { createAudioResource, StreamType } = require("@discordjs/voice");
const Innertube = require("youtubei.js");

let YoutubeFactory = (function () {
    var instance;

    async function createInstance() {
        console.log("Instance called!");
        return await new Innertube();
    }

    return {
        getInstance: async function () {
            if (!instance) {
                instance = await createInstance();
            }
            return instance;
        },
    };
})();

module.exports = async function createResource(res) {
    try {
        let id = res.link.split("v=")[1].trim();
        let youtube = await YoutubeFactory.getInstance();
        let stream = youtube.download(id, { type: "audio" });

        if (
            isNaN(res.bass) ||
            isNaN(res.treble) ||
            isNaN(res.volume) ||
            (res.bass === "0" && res.treble === "0" && res.volume === "0")
        ) {
            console.log(`Started Playing: ${res.link}`);
            stream.on("error", (e) => console.log(Date(), e.message));
            return createAudioResource(stream);
        }

        let ffmped_args = [
            "-analyzeduration",
            "0",
            "-loglevel",
            "0",
            "-f",
            "s16le",
            "-ar",
            "48000",
            "-ac",
            "2",
        ];

        if (res.bass !== "0") {
            ffmped_args.push("-af");
            let valstr = "";
            valstr = `bass=g=${res.bass},asubboost,dynaudnorm`;
            if (res.treble !== "0") {
                valstr += `,treble=g=${res.treble}`;
            }
            if (res.volume !== "0") {
                valstr += `,volume=${res.volume}`;
            }
            ffmped_args.push(valstr);
        } else if (res.treble !== "0") {
            ffmped_args.push("-af");
            let valstr = `treble=g=${res.treble}`;
            if (res.volume !== "0") {
                valstr += `,volume=${res.volume}`;
            }
            ffmped_args.push(valstr);
        } else if (res.volume !== "0") {
            ffmped_args.push("-af");
            ffmped_args.push(`volume=${res.volume}`);
        }

        let transcoder = new FFmpeg({
            args: ffmped_args,
        });

        let opusEncoder = new opus.Encoder({
            rate: 48000,
            channels: 2,
            frameSize: 960,
        });

        console.log(`Started Playing(ffmpeg enabled): ${res.link}`);

        const output = stream.pipe(transcoder);
        const outputStream = output.pipe(opusEncoder);

        outputStream.on("close", () => {
            console.log("Main stream closed");
            transcoder.destroy();
            opusEncoder.destroy();
            stream.destroy();
            stream.removeAllListeners();
            output.destroy();
            output.removeAllListeners();
            outputStream.destroy();
            outputStream.removeAllListeners();
        });
        outputStream.on("error", (e) => {
            console.log(Date(), e.message);
            transcoder.destroy();
            opusEncoder.destroy();
            stream.destroy();
            stream.removeAllListeners();
            output.destroy();
            output.removeAllListeners();
            outputStream.destroy();
            outputStream.removeAllListeners();
        });

        return createAudioResource(outputStream, {
            inputType: StreamType.Opus,
        });
    } catch (e) {
        console.log(e.message);
    }
};
