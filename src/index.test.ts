import Timer, { TimerProps } from './index';

const createRequestAnimationFrame = (timeSamples: number[]) => {
    let index = 0;
    return (cb: TimerProps['update']) => {
        if (index >= timeSamples.length) {
            index = 0;
            return -1;
        }
        const oldIndex = index;
        index += 1;
        cb(timeSamples[oldIndex]);
        return oldIndex;
    };
}

const predictUpdateCount = (timeSamples: number[], fps: number) => {
    const first = timeSamples[0];
    const last = timeSamples[timeSamples.length - 1];
    // NOTE: should not use (last - first) / (1000 / fps)
    return Math.floor(fps * (last - first) / 1000);
}

const testTimer = (timeSamples: number[], fps: number) => {
    let updateCalled = 0;
    let renderCalled = 0;
    const timer = new Timer({
        fps,
        update: () => {
            // console.log('updatating', dt);
            updateCalled += 1;
        },
        render: () => {
            renderCalled+= 1;
        },
        requestAnimationFrame: createRequestAnimationFrame(timeSamples),
    });
    timer.start();
    expect(updateCalled).toBe(predictUpdateCount(timeSamples, fps));
    expect(renderCalled).toBe(timeSamples.length);
    // expect(updateCalled <= renderCalled).toBeTruthy();
}

test('frames should be skipped', () => {
    const timeSamples = [
        0, 2, 5, 10, 15, 20,
    ];
    const fps = 60;
    testTimer(timeSamples, fps);
});

test('frames should be skipped', () => {
    const timeSamples = [
        0, 100, 200, 270, 350
    ];
    const fps = 50;
    testTimer(timeSamples, fps);
});

test('frames should be skipped', () => {
    const timeSamples = [
        0, 50, 100, 115, 200
    ];
    const fps = 60;
    testTimer(timeSamples, fps);
});

test('should work', () => {
    const timeSamples = [
        0, 50, 100, 115, 200, 300, 301, 302, 303, 303, 310, 400, 500,
    ];
    const fps = 60;
    testTimer(timeSamples, fps);
});

test('should work for random samples', () => {
    const timeSamples = [0];
    for (let i = 0; i <= 2000; i += 1) {
        const randomValue = timeSamples[timeSamples.length - 1] + Math.round(Math.random() * 300);
        timeSamples.push(randomValue);
    }
    const fps = 60;
    testTimer(timeSamples, fps);
});
