import Star from "./Star";
import {MutableRefObject} from "react";

export default class StarsScene {
    private vel: number;
    private readonly radius: number;
    private alpha: number;
    private readonly starsCounter: number;
    private readonly stars: Star[] = [];
    private readonly canvas: any;
    private readonly context: any;
    private center: any;

    constructor(
        canvasRef : HTMLCanvasElement|null,
        args = {
            vel: 1,
            radius: 1,
            stars: 200
        }
    ) {

        if (!(canvasRef instanceof HTMLCanvasElement)) {
            throw new Error("Canvas is not an instance of HTMLCanvasElement, cannot render searching animation.");
        }

        this.vel = args.vel;
        this.radius = args.radius;
        this.alpha = 0.5;
        this.starsCounter = args.stars;
        this.center = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };

        this.canvas = canvasRef;
        this.context = canvasRef.getContext("2d");
        this.context.lineCap = "round";

        this.start();
        this.resize();

        window.addEventListener("resize", this.resize.bind(this));
    }

    start() {
        const _scope = this;
        const starArgs = {
            center: {x: this.center.x, y: this.center.y},
            radius: this.radius,
            context: this.context,
            canvas: this.canvas
        };
        for (let i = 0; i < this.starsCounter; i++) {
            setTimeout(function () {
                _scope.stars.push(new Star(
                    starArgs.center,
                    starArgs.radius,
                    starArgs.context,
                    starArgs.canvas
                ));
            }, i * 30);
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.center.x = this.canvas.width / 2;
        this.center.y = this.canvas.height / 2;
    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));
        this.render();
    }

    render() {
        // this.context.fillStyle = 'rgba(1, 4, 35, 0.8)';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.strokeStyle = "white";
        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];
            star.update();
            if (star.isDead()) {
                this.stars.splice(i, 1);
                i--;
                this.stars.push(new Star(
                    {x: this.center.x, y: this.center.y},
                    this.radius,
                    this.context,
                    this.canvas
                ));
            }
        }
    }
}
