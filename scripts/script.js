const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let dx = 2;
let dy = -2;
let coordX = canvas.width / 2;
let coordY = canvas.height - 30;

const ballRadius = 10;

function drawBall() {
    ctx.beginPath();
    ctx.arc(coordX, coordY, ballRadius, 0, Math.PI * 2);
    ctx.fill();    
    coordX += dx;
    coordY += dy;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    if (coordX + dx > canvas.width - ballRadius || coordX + dx < ballRadius) {
        dx = -dx;
        console.log("dx " + dx);
        console.log("dy " + dy);
        ctx.fillStyle = "#" + Math.floor(Math.random()*16777215).toString(16);
    }
    if (coordY + dy > canvas.height - ballRadius || coordY + dy < ballRadius) {
        dy = -dy;
        console.log("dx " + dx);
        console.log("dy " + dy);
        ctx.fillStyle = "#" + Math.floor(Math.random()*16777215).toString(16);
    }
}

let timerId = setInterval(draw, 10);

