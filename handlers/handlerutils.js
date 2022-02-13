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

module.exports = { getResourceQueue, getaudioFilters };
