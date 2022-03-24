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
        changeCoordStartLine();        
        ctx.fillStyle = "#0095DD";
        ctx.fill();
    }
    if ((coordX >= canvas.width * 0.65) && (coordY >= canvas.height * 0.35)) {        
        changeCoordMiddleLine();        
        ctx.fillStyle = "#AA95AD";
        ctx.fill();
    }
    if ((coordY >= 30) && (coordY < canvas.height * 0.35)) {
        changeCoordEndLine();
        ctx.fillStyle = "#BA15AD";
        ctx.fill();        
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

function changeCoordStartLine() {
    coordX += dx;
    coordY += dy;
}

function changeCoordMiddleLine() {
    dx = 0;
    coordX += dx;
    coordY += dy;
}

function changeCoordEndLine() {
    dx = -2;
    coordX += dx;
    coordY += dy;
}

let timerId = setInterval(draw, 10);

