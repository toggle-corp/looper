let index = 0;
const timeSamples = [
    0, 10, 15, 30, 50, 100, 120, 124,
];

const raf = (cb) => {
    if (index >= timeSamples.length) {
        index = 0;
        return -1;
    }
    const oldIndex = index;
    index += 1;
    cb(timeSamples[oldIndex]);
    return oldIndex;
};

global.requestAnimationFrame = raf;
