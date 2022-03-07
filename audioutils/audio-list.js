const play = require("play-dl");

function validURL(str) {
    var pattern = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
            "(\\#[-a-z\\d_]*)?$",
        "i"
    ); // fragment locator
    return !!pattern.test(str);
}

async function createResourceList(args, bass, treble, volume) {
    try {
        let resourceQueue = [];

        if (validURL(args)) {
            if (args.includes("spotify")) {
                if (play.is_expired()) {
                    await play.refreshToken();
                }
                let sp_data = await play.spotify(args);
                if (sp_data.type === "track") {
                    let yt_info = await play.search(sp_data.name, { limit: 1 });
                    let audioResource = {
                        name: sp_data.name,
                        link: yt_info[0].url,
                        bass: bass,
                        treble: treble,
                        volume,
                    };
                    resourceQueue.push(audioResource);
                } else {
                    let tracks = await sp_data.all_tracks();
                    for (var i = 0; i < tracks.length; i++) {
                        let yt_info = await play.search(tracks[i].name, {
                            limit: 1,
                        });
                        let audioResource = {
                            name: tracks[i].name,
                            link: yt_info[0].url,
                            bass: bass,
                            treble: treble,
                            volume,
                        };
                        resourceQueue.push(audioResource);
                    }
                }
            } else {
                if (play.yt_validate(args) === "playlist") {
                    let tracks = await play.playlist_info(args, {
                        incomplete: true,
                    });
                    tracks = await tracks.all_videos();
                    for (var i = 0; i < tracks.length; i++) {
                        let audioResource = {
                            name: tracks[i].title,
                            link: tracks[i].url,
                            bass: bass,
                            treble: treble,
                            volume,
                        };
                        resourceQueue.push(audioResource);
                    }
                } else {
                    let yt_info = await play.video_basic_info(args);
                    let audioResource = {
                        name: yt_info.video_details.title,
                        link: args,
                        bass: bass,
                        treble: treble,
                        volume,
                    };
                    resourceQueue.push(audioResource);
                }
            }
        } else {
            let yt_info = await play.search(args, { limit: 1 });
            let audioResource = {
                name: yt_info[0].title,
                link: yt_info[0].url,
                bass: bass,
                treble: treble,
                volume,
            };
            resourceQueue.push(audioResource);
        }
        return resourceQueue;
    } catch (e) {
        console.log(e);
        return [
            {
                name: "Take Five",
                link: "https://www.youtube.com/watch?v=vmDDOFXSgAs",
                bass: "0",
                treble: "0",
                volume: "0",
            },
        ];
    }
}

module.exports = createResourceList;
