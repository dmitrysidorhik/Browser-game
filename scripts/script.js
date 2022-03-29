const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let dx = 2;
let dy = -2;
let coordX = canvas.width / 2;
let coordY = canvas.height - 30;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

const initialColor = '#0095DD';
let ballColor = initialColor;
let paddleColor = initialColor;

const ballRadius = 10;
let rightPressed = false;
let leftPressed = false;

function drawBall() {
    ctx.beginPath();
    ctx.arc(coordX, coordY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    coordX += dx;
    coordY += dy;
    ctx.closePath();
}

function changeColor() {
    ballColor = ctx.fillStyle = "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    if (coordX + dx > canvas.width - ballRadius || coordX + dx < ballRadius) {
        dx = -dx;
        changeColor();
    }
    if (coordY + dy > canvas.height - ballRadius || coordY + dy < ballRadius) {
        dy = -dy;
        changeColor();
    }
    if (rightPressed) {
        console.log("rightPressed " + rightPressed);
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
        rightPressed = false;
    }

    if (leftPressed) {
        console.log("leftPressed " + leftPressed);
        paddleX -= 7;
        if (paddleX < 0) {
            paddleX = 0;
        }
        leftPressed = false;
    }
}

setInterval(draw, 10);

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = paddleColor;
    ctx.fill();
    ctx.closePath();
}

const keyDownHandler = e => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    }
    if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
};
// const keyUpHandler = e => {
//     if (e.key === 'Right' || e.key === 'ArrowRight') {
//         rightPressed = true;
//     }
//     if (e.key === 'Left' || e.key === 'ArrowLeft') {
//         leftPressed = true;
//     }
// };

document.addEventListener('keydown', keyDownHandler, false);
//document.addEventListener('keyup', keyUpHandler, false);