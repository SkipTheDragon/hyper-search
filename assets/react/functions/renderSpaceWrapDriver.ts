// @ts-nocheck

export default (canvas: { current: HTMLCanvasElement }, searchBox: { current: HTMLInputElement }) => {
    var c = canvas.current;
    var ctx = c.getContext('2d');

    var stars: { x: number; y: number; r: number; o: number; m: number; }[] = [];

    var speed = 0.5;
    var maxSpeed = 200;
    let decreaseInterval: number | undefined;

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    draw();
    createStars();
    eventListeners();

    searchBox.current.oninput = (e) => {
        //@ts-ignore
        if (e.target.value.length === 0) {
            speed = 0.000000000000000000000000005;
        }

        if ((e as InputEvent).inputType === "deleteContentBackward") {
            // @ts-ignore
            decreaseInterval = setInterval(function () {
                if (speed > 0.1) {
                    decreaseSpeed();
                } else {
                    clearInterval(decreaseInterval);
                    speed = .1;
                }
            }, 100);
            return;
        }

        clearInterval(decreaseInterval);

        if (speed < maxSpeed) {
            speed += (speed);
        }
    }

    function eventListeners() {
        for (let wc = 0; wc <= searchBox.current.value.length; wc++) {
            speed += (speed / 10);
        }

    }

    function decreaseSpeed() {
        speed -= (speed / 100);
    }

    function draw() {

        drawBg();
        drawStars();
        moveStars();
        drawSpeed();


        window.requestAnimationFrame(draw);
    }

    function drawBg() {
        ctx.rect(0, 0, c.width, c.height);
        ctx.fillStyle = 'rgb(10, 15, 30)';
        ctx.fill();
    }

    function createStars() {
        for (let i = 0; i < 1000; i++) {
            stars.push({
                x: Math.random() * 3000,
                y: Math.random() * 3000,
                r: Math.random() * 2,
                o: Math.random(),
                m: Math.random()
            });
        }
    }

    function drawStars() {
        for (let i = 0; i < stars.length; i++) {

            // Draw trail

            if (speed > 100) {
                var alpha = (speed - 100) / 100;

                ctx.beginPath();
                ctx.rect((stars[i].x - stars[i].r), stars[i].y, (stars[i].r * 2), 150);
                ctx.fillStyle = 'rgba(100, 150, 200, ' + alpha + ')';
                ctx.closePath();
                ctx.fill();
            }

            // Draw normal stars
            ctx.beginPath();
            ctx.arc(stars[i].x, stars[i].y, stars[i].r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, ' + stars[i].o + ')';
            ctx.closePath();
            ctx.fill();
        }
    }

    function moveStars() {
        for (let i = 0; i < stars.length; i++) {

            if (stars[i].y + .1 > c.height) {
                stars[i].y = -(Math.random() * 1000);
            } else {
                stars[i].y += (speed + stars[i].m);
            }

            // if(stars[i].x + .1 > c.width){
            // 	stars[i].x = -(Math.random() * 1000);
            // } else {
            // 	stars[i].x += speed + 0.15;
            // }
        }
    }


    function drawSpeed() {
        var speedHeight = (speed / maxSpeed) * 100;

        ctx.beginPath();
        ctx.rect(50, 50, 10, 100);
        ctx.fillStyle = 'rgba(255, 255, 255, .2)'
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.rect(50, 150 - speedHeight, 10, speedHeight);
        ctx.fillStyle = 'rgb(100, 220, 180)';
        ctx.closePath();
        ctx.fill();
    }
}
