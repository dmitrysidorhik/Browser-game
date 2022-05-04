////////////////////-------INITIALIZATION---VARIABLE-----//////////////////////////////////

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

const brickRowCount = 2;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let countClassElem = 0;

let score = 0;
let gameCountWin = 0;
let gameCountLose = 0;

const bricks = [];

const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
const buttonPlaceholder = document.getElementById('liveButtonPlaceholder');

const wrapper = document.createElement('div');
const wrapperBtn = document.createElement('div');

let alertInfoDom = document.querySelector(".alert-info");
let alertDangerDom = document.querySelector(".alert-danger");
let alertWarningDom = document.querySelector(".alert-warning");
let buttonSecondaryDom = document.querySelector(".btn-secondary");
let buttonSuccessDom = document.querySelector(".btn-success");

let lives = 3;
let start = false;

////////////////////-------INITIALIZATION---VARIABLE---END--//////////////////////////////////

////////////////////---------------------FUNCTION-----------//////////////////////////////////

const initVariable = () => {
    dx = 2;
    dy = -2;
    coordX = canvas.width / 2;
    coordY = canvas.height - 30;
    score = 0;
    lives = 3;
    rightPressed = false;
    leftPressed = false;
    paddleX = (canvas.width - paddleWidth) / 2;
    drawBlocks();
    interval = setInterval(draw, 10);
}

const drawBlocks = () => {
    for (let i = 0; i < brickColumnCount; i++) {
        bricks[i] = [];
        for (let j = 0; j < brickRowCount; j++) {
            bricks[i][j] = { x: 0, y: 0, status: 1 };
        }
    }
}

const drawInfo = (message, coord) => {
    const { x, y } = coord;
    ctx.font = '16px Arial';
    ctx.fillStyle = '#ffbc12';
    ctx.fillText(message, x, y);
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
                    alert("YOU WIN, CONGRATULATIONS!", "success");
                    gameCountWin++;
                    clearInterval(interval);
                    alertPlaceholder.addEventListener("close.bs.alert", goOn, false);
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
    drawInfo(`Score: ${score}`, { x: 8, y: 20 });
    drawInfo(`Lives: ${lives}`, { x: canvas.width - 65, y: 20 });
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
            lives--;
            if (!lives) {
                alert("GAME OVER", "danger");
                gameCountLose++;
                clearInterval(interval);
            } else {
                coordX = canvas.width / 2;
                coordY = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
            alertPlaceholder.addEventListener("close.bs.alert", goOn, false);
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

////////////////////-------CONTROL--------//////////////////////////////////

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

const mouseMoveHandler = e => {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
};
////////////////////-------CONTROL--END---------//////////////////////////////////



const alert = (message, type) => {
    if (type === "danger") {
        wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message +
            '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
    }
    if (type === "success") {
        wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message +
            '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
    }
    if (type === "info") {
        wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message;
        '</div>'
    }
    if (type === "warning") {
        wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message;
        '</div>'
    }
    alertPlaceholder.append(wrapper);
};

const goOn = () => {
    alertPlaceholder.removeEventListener("close.bs.alert", goOn, false);
    alert("RESTART GAME???", "warning");
    wrapperBtn.innerHTML = '<div class="d-grid gap-2 d-md-flex justify-content-center">' +
        '<button class="btn btn-success" type="button" onclick="doRestart()">Continue</button>' +
        '<button class="btn btn-secondary" type="button" onclick="window.close()";>Stop</button></div>'
    buttonPlaceholder.append(wrapperBtn);
};

const doRestart = () => {
    doStart();
    // alert(`GAME START!!! WIN: ${gameCountWin} LOSE: ${gameCountLose} `, "info");
    // setTimeout(() => document.getElementsByClassName('alert-info')[0].style = "display: none", 1000);
    document.getElementsByClassName('btn-success')[0].style = "display: none";
    document.getElementsByClassName('btn-secondary')[0].style = "display: none";
    initVariable();
};



const doStart = () => {
    if (!start) {
        alert("GAME START!!!", "info");
    }
    else {
        alert(`GAME START!!! WIN: ${gameCountWin} LOSE: ${gameCountLose} `, "info");
    }
    setTimeout(() => document.getElementsByClassName('alert-info')[0].style = "display: none", 1000);

    // setTimeout(() => document.getElementsByClassName('alert-info')[0].style = "display: none", 1000);
    // document.getElementsByClassName('btn-success')[0].style = "display: none";
    // document.getElementsByClassName('btn-secondary')[0].style = "display: none";
    // initVariable();

    start = true;

};
doStart();
//alert(`GAME START!!! WIN: ${gameCountWin} LOSE: ${gameCountLose} `, "info");
// setTimeout(() => document.getElementsByClassName('alert-info')[0].style = "display: none", 1000);

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

drawBlocks();

let interval = setInterval(draw, 10);