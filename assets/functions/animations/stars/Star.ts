export default class Star {
    private x: number;
    private y: number;
    private lineWidth: number;
    private vel: { x: number; y: number };
    private readonly radius: number;
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;
    private x0: number;
    private y0: number;

    constructor(center: { x: number; y: number; },
                radius: number,
                context: CanvasRenderingContext2D,
                canvas: HTMLCanvasElement
    ) {
        this.context = context;
        this.canvas = canvas;
        this.radius = Math.random() * radius;
        this.x = center.x;
        this.y = center.y;
        this.x0 = this.x;
        this.y0 = this.y;
        this.lineWidth = 0;
        this.vel = {
            x: Math.random() * 10 - 5,
            y: Math.random() * 10 - 5
        }
    }

    update() {
        this.vel.x *= 1.05;
        this.vel.y *= 1.05;
        this.lineWidth += 0.035;
        this.x0 = this.x;
        this.y0 = this.y;
        this.x += this.vel.x;
        this.y += this.vel.y;
        this.draw();
    }

    draw() {
        this.context.beginPath();
        this.context.moveTo(this.x0, this.y0);
        this.context.lineTo(this.x, this.y);
        this.context.lineWidth = this.lineWidth;
        this.context.stroke();
    }

    isDead() {
        return (this.x < 0 || this.x > this.canvas.width || this.y < 0 || this.y > this.canvas.height);
    }
}
