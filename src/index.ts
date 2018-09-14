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
    private fps: RequiredTimerProps['fps'];
    private timePerFrame: number;
    private renderFunction: RequiredTimerProps['render'];
    private updateFunction: RequiredTimerProps['update'];
    private requestAnimationFrame: RequiredTimerProps['requestAnimationFrame'];

    private lastTime?: number;
    private acc: number;

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

    private requestNextFrame = () => {
        this.requestAnimationFrame(this.handleNewFrame);
    }

    private handleNewFrame = (currentTime: number) => {
        this.renderFunction();
        this.tick(currentTime);
        this.requestNextFrame();
    }

    // NOTE: ignoring small deviations that may accumulate
    private accumulate = (dt: number) => {
        this.acc += dt;
        if (isAlmostZero(this.acc - this.timePerFrame)) {
            this.acc = this.timePerFrame;
        }
    }

    private tick = (currentTime: number) => {
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
