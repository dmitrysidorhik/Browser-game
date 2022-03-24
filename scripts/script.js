const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let dx = 2;
let dy = -2;
let coordX = canvas.width / 2;
let coordY = canvas.height - 30;

function drawBall() {
    ctx.beginPath();
    ctx.arc(coordX, coordY, 10, 0, Math.PI * 2);
    ctx.fill();
    if (coordX < canvas.width * 0.65) {
        changeCoord_1();
        ctx.fillStyle = "#0095DD";
        ctx.fill();
    }
    if ((coordX >= canvas.width * 0.65) && (coordY >= canvas.height * 0.35)) {
        changeCoord_2();
        ctx.fillStyle = "#AA95AD";
        ctx.fill();
    }
    if ((coordY >= 30) && (coordY < canvas.height * 0.35)) {
        changeCoord_3();
        ctx.fillStyle = "#BA15AD";
        ctx.fill();
        console.log(coordX);
        console.log(coordY);
    }
    if (coordY === 28 && coordX === 230) {
        ctx.closePath();
        clearInterval(timerId);
        return;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
}

function changeCoord_1() {
    coordX += dx;
    coordY += dy;
}

function changeCoord_2() {
    dx = 0;
    coordX += dx;
    coordY += dy;
}

function changeCoord_3() {
    dx = -2;
    coordX += dx;
    coordY += dy;
}

let timerId = setInterval(draw, 10);

