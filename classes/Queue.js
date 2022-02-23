const createResourceList = require("../audioutils/audio-list");

class Queue {
    constructor() {
        this.state = new Map();
        this.guildid = "";
    }

    setId(id) {
        this.guildid = id;
    }

    current() {
        let lstate = this.state.get(this.guildid);
        if (lstate) {
            if (lstate.index < lstate.queue.length)
                return lstate.queue[lstate.index];
        }
        return null;
    }

    async add(song) {
        let lstate = this.state.get(this.guildid);
        let list = await createResourceList(
            song.trim(),
            lstate ? lstate.bass ?? "0" : "0",
            lstate ? lstate.treble ?? "0" : "0"
        );
        if (lstate) {
            this.state.set(this.guildid, {
                ...lstate,
                queue: [...lstate.queue, ...list],
            });
        } else {
            this.state.set(this.guildid, { queue: [...list], index: 0 });
        }
    }

    next() {
        let lstate = this.state.get(this.guildid);
        if (lstate) {
            if (lstate.index + 1 < lstate.queue.length) {
                this.state.set(this.guildid, {
                    ...lstate,
                    index: lstate.index + 1,
                });
                return lstate.queue[lstate.index + 1];
            }
        }
        return null;
    }

    back() {
        let lstate = this.state.get(this.guildid);
        if (lstate) {
            if (lstate.index - 1 >= -1) {
                this.state.set(this.guildid, {
                    ...lstate,
                    index: lstate.index - 1,
                });
            }
        }
    }

    setBass(bassval) {
        let lstate = this.state.get(this.guildid);
        if (lstate) {
            let myqueue = lstate.queue.map((val) => ({
                ...val,
                bass: bassval,
            }));
            this.state.set(this.guildid, {
                ...lstate,
                queue: [...myqueue],
                bass: bassval,
            });
        } else {
            this.state.set(this.guildid, {
                bass: bassval,
                queue: [],
                index: 0,
            });
        }
    }

    setTreble(trebleval) {
        let lstate = this.state.get(this.guildid);
        if (lstate) {
            let myqueue = lstate.queue.map((val) => ({
                ...val,
                treble: trebleval,
            }));
            this.state.set(this.guildid, {
                ...lstate,
                queue: [...myqueue],
                treble: trebleval,
            });
        } else {
            this.state.set(this.guildid, {
                treble: trebleval,
                queue: [],
                index: 0,
            });
        }
    }

    getList() {
        let lstate = this.state.get(this.guildid);
        if (lstate) {
            return { queue: lstate.queue, index: lstate.index };
        } else {
            return { queue: [], index: 0 };
        }
    }

    getByIndex(ind) {
        let lstate = this.state.get(this.guildid);
        if (lstate) {
            if (ind < lstate.queue.length) {
                this.state.set(this.guildid, { ...lstate, index: ind });
                return lstate.queue[ind];
            }
        }
        return null;
    }

    destroy() {
        this.state.set(this.guildid, null);
    }
}

module.exports = Queue;
