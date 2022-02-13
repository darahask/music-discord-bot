const { FFmpeg, opus } = require("prism-media");
const play = require("play-dl");
const { createAudioResource } = require("@discordjs/voice");

const values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

module.exports = async function createResource(res) {
    let { stream, type } = await play.stream(res.link, {
        discordPlayerCompatibility: true,
    });

    if (!values.includes(res.bass) && !values.includes(res.treble)) {
        console.log("Started Playing!");
        stream.on("close", () => {
            console.log("Main stream closed");
            stream.destroy();
            stream.removeAllListeners();
        });
        stream.on("error", (e) => {
            console.log(Date(), e);
            stream.destroy();
            stream.removeAllListeners();
        });
        let resource = createAudioResource(stream, { type: type });
        resource.playStream.on("close", () => {
            console.log("Player stream closed");
            stream.destroy();
            resource.playStream.destroy();
            resource.playStream.removeAllListeners();
        });
        resource.playStream.on("error", (e) => {
            console.log(Date(), e);
            stream.destroy();
            stream.removeAllListeners()
            resource.playStream.destroy();
            resource.playStream.removeAllListeners();
        });
        return resource;
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

    ffmped_args.push("-af");
    if (values.includes(res.bass)) {
        let valstr = "";
        valstr = `bass=g=${res.bass},asubboost`;
        if (values.includes(res.treble)) {
            valstr += `,treble=g=${res.treble}`;
        }
        ffmped_args.push(valstr);
    } else {
        ffmped_args.push(`treble=g=${res.treble}`);
    }

    let transcoder = new FFmpeg({
        args: ffmped_args,
    });
    let opusEncoder = new opus.Encoder({
        rate: 48000,
        channels: 2,
        frameSize: 960,
    });

    console.log("Started Playing...");
    const output = stream.pipe(transcoder);
    const outputStream = output.pipe(opusEncoder);
    stream.on("error", (e) => outputStream.emit("error", e));
    output.on("error", (e) => outputStream.emit("error", e));

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
        console.log(Date(), e);
        transcoder.destroy();
        opusEncoder.destroy();
        stream.destroy();
        stream.removeAllListeners();
        output.destroy();
        output.removeAllListeners();
        outputStream.destroy();
        outputStream.removeAllListeners();
    });

    let resource = createAudioResource(outputStream, { type: type });
    resource.playStream.on("close", () => {
        console.log("Player stream closed");
        resource.playStream.destroy();
        resource.playStream.removeAllListeners();
    });
    resource.playStream.on("error", (e) => {
        console.log(Date(), e);
        resource.playStream.destroy();
        resource.playStream.removeAllListeners();
    });
    return resource;
};
