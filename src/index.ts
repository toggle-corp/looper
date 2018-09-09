export interface TimerProps {
    fps: number;
    render(): void;
    update(dt: number): void;
    requestAnimationFrame?(callback: TimerProps['update']): number;
};

// FIXME: don't use Required<TimerProps>
type RequiredTimerProps = Required<TimerProps>

const epsilon = 1 / 1000;
const inverseEplison = 1000; // ms

const isAlmostZero = (foo: number) => (
    Math.abs(foo) <= epsilon
)

class Timer {
    fps: RequiredTimerProps['fps'];
    timePerFrame: number;
    renderFunction: RequiredTimerProps['render'];
    updateFunction: RequiredTimerProps['update'];
    requestAnimationFrame: RequiredTimerProps['requestAnimationFrame'];

    nextFrameRequest?: number;
    lastTime?: number;
    acc: number;

    constructor(props: TimerProps) {
        this.renderFunction = props.render;
        this.updateFunction = props.update;
        this.fps = props.fps;
        this.requestAnimationFrame = props.requestAnimationFrame || window.requestAnimationFrame;

        this.timePerFrame = 1 / this.fps * 1000;
        this.acc= 0;
    }

    start = () => {
        this.acc = 0;
        this.requestNextFrame();
    }

    requestNextFrame = () => {
        this.nextFrameRequest = this.requestAnimationFrame(this.handleNewFrame);
    }

    handleNewFrame = (currentTime: number) => {
        this.renderFunction();
        this.tick(currentTime);
        this.requestNextFrame();
    }

    // NOTE: ignoring small deviations that may accumulate
    accumulate = (dt: number) => {
        this.acc += dt;
        if (isAlmostZero(this.acc - this.timePerFrame)) {
            this.acc = this.timePerFrame;
        }
    }

    tick = (currentTime: number) => {
        if (this.lastTime === undefined) {
            this.lastTime = currentTime;
            return;
        }

        // NOTE: capping updates on large dt
        let dt = Math.min(currentTime - this.lastTime, inverseEplison);
        this.accumulate(dt);

        while(this.acc >= this.timePerFrame) {
            this.updateFunction(this.timePerFrame);
            this.accumulate(-this.timePerFrame);
        }
        this.lastTime = currentTime;
    }
}

export default Timer;
