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

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let score = 0;

const bricks = [];

const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
const buttonPlaceholder = document.getElementById('liveButtonPlaceholder');



const initVariable = () => {
    dx = 2;
    dy = -2;
    coordX = canvas.width / 2;
    coordY = canvas.height - 30;
    score = 0;
    rightPressed = false;
    leftPressed = false;
    paddleX = (canvas.width - paddleWidth) / 2;
    drawBlocks();
}

const drawBlocks = () => {
    for (let i = 0; i < brickColumnCount; i++) {
        bricks[i] = [];
        for (let j = 0; j < brickRowCount; j++) {
            bricks[i][j] = { x: 0, y: 0, status: 1 };
        }
    }
}

const drawScore = () => {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#ffbc12';
    ctx.fillText(`Score: ${score}`, 8, 20);
}

const drawBricks = () => {
    for (let i = 0; i < brickColumnCount; i++) {
        for (let j = 0; j < brickRowCount; j++) {
            if (bricks[i][j].status === 0) {
                continue;
            }
            const brickX = (i * (brickWidth + brickPadding)) + brickOffsetLeft;
            const brickY = (j * (brickHeight + brickPadding)) + brickOffsetTop;
            bricks[i][j].x = brickX;
            bricks[i][j].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#17e3be";
            ctx.fill();
            ctx.closePath();
        }
    }
};

const collisionDetection = () => {
    for (let i = 0; i < brickColumnCount; i++) {
        for (let j = 0; j < brickRowCount; j++) {
            const brick = bricks[i][j];
            if (brick.status === 0) {
                continue;
            }
            if (coordX > brick.x &&
                coordX < brick.x + brickWidth &&
                coordY > brick.y &&
                coordY < brick.y + brickHeight
            ) {
                dy = -dy;
                brick.status = 0;
                score++;
                if (score === brickRowCount * brickColumnCount) {
                    alert('YOU WIN, CONGRATULATIONS!', 'success');
                    clearInterval(interval);
                }
            }
        }
    }
};

function drawBall() {
    ctx.beginPath();
    ctx.arc(coordX, coordY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

function changeColor() {
    ballColor = ctx.fillStyle = "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

    if (coordX + dx > canvas.width - ballRadius || coordX + dx < ballRadius) {
        dx = -dx;
        changeColor();
    }
    if (coordY + dy < ballRadius) {
        dy = -dy;
        changeColor();
    }
    if (coordY + dy > canvas.height - ballRadius) {
        if (coordX > paddleX && coordX < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            alert("GAME OVER", "danger");
            clearInterval(interval);
            alertPlaceholder.addEventListener("close.bs.alert", function () {
                restartGame = 1;
                alert("RESTART GAME???", "warning");
                goOn();
            });
            // let restartGame = 1;

            if (restartGame) {
                initVariable();
                interval = setInterval(draw, 10);
                // alertInfo("GAME START", "info");
                // alertDom.remove();
            } else {
                clearInterval(interval);

            }
        }
    }
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 5;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 5;
    }
    coordX += dx;
    coordY += dy;
}

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
const keyUpHandler = e => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    }
    if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
};

const alert = (message, type) => {
    const wrapper = document.createElement('div');
    if (type === "danger") {
        wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
    }
    if (type === "info") {
        wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message; '</div>'
    }
    if (type === "warning") {
        wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message; '</div>'
    }
    alertPlaceholder.append(wrapper);
};

const goOn = () => {
    const wrapper = document.createElement('div');       
    wrapper.innerHTML = '<div class="d-grid gap-2 d-md-flex justify-content-center"><button class="btn btn-success" type="button">Continue</button><button class="btn btn-secondary" type="button" onclick="window.close()";>Stop</button></div>'
    alertPlaceholder.append(wrapper);
};



document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

drawBlocks();

let interval = setInterval(draw, 10);

alert("GAME START", "info");

let alertInfoDom = document.querySelector(".alert-info");
let alertDangerDom = document.querySelector(".alert-danger");
let alertwarningDom = document.querySelector(".alert-warning");

setTimeout(() => alertInfoDom.remove(), 1000);

