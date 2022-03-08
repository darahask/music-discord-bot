const { FFmpeg } = require("prism-media");
const { createAudioResource, StreamType } = require("@discordjs/voice");
const Innertube = require("youtubei.js");

let YoutubeFactory = (function () {
    let instance;

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

function isValidSeek(str) {
    let isValid1 = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(
        str
    );
    let isValid2 = /^[0-5]?[0-9]$/.test(str);

    return isValid1 || isValid2;
}

module.exports = async function createResource(res) {
    try {
        let id = res.link.split("v=")[1].trim();
        let youtube = await YoutubeFactory.getInstance();
        let stream = youtube.download(id, { type: "audio" });

        let ffmpeg_args = [
            "-acodec",
            "libopus",
            "-f",
            "opus",
        ];

        if (isValidSeek(res.seek)) {
            ffmpeg_args.unshift("-ss", res.seek);
        }

        if (res.bass !== "0" && !isNaN(res.bass)) {
            ffmpeg_args.push("-af");
            let valstr = "";
            valstr = `bass=g=${res.bass},asubboost,dynaudnorm`;
            if (res.treble !== "0" && !isNaN(res.treble)) {
                valstr += `,treble=g=${res.treble}`;
            }
            if (res.volume !== "0" && !isNaN(res.volume)) {
                valstr += `,volume=${res.volume}`;
            }
            ffmpeg_args.push(valstr);
        } else if (res.treble !== "0" && !isNaN(res.treble)) {
            ffmpeg_args.push("-af");
            let valstr = `treble=g=${res.treble}`;
            if (res.volume !== "0") {
                valstr += `,volume=${res.volume}`;
            }
            ffmpeg_args.push(valstr);
        } else if (res.volume !== "0" && !isNaN(res.volume)) {
            ffmpeg_args.push("-af");
            ffmpeg_args.push(`volume=${res.volume}`);
        }

        let transcoder = new FFmpeg({
            args: ffmpeg_args,
        });

        console.log(`Started Playing: ${res.link}`);

        stream.on("error", (e) => console.log(Date(), e.message));
        const output = stream.pipe(transcoder);
        output.on("close", () => {
            console.log("Main stream closed");
            transcoder.destroy();
            stream.destroy();
            output.destroy();
        });
        output.on("error", (e) => {
            console.log(Date(), e.message);
            transcoder.destroy();
            stream.destroy();
            output.destroy();
        });

        return createAudioResource(output, { inputType: StreamType.OggOpus });
    } catch (e) {
        console.log(e.message);
    }
};
