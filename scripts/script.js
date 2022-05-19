////////////////////-------INITIALIZATION---VARIABLE-----//////////////////////////////////

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let dx;
let dy;
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
let countClassElem = 0;

let score = 0;
let fullScore = 0;
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

let lives = 5;
let level = 2;
let start = false;

let interval;

let statusBall = false;

let fullTime = new Date();
let fullTimeEnd;

let statusGame;

let imageBackgroundColor = document.getElementById("imageBackgroundColor");
let imageCanvas = canvas.getContext("2d");
////////////////////---------------------FUNCTION-----------//////////////////////////////////

const initVariable = () => {
    if (statusGame === "lose") {
        lives = 5;
        paddleX = (canvas.width - paddleWidth) / 2;
    }
    dx = 0;
    dy = 0;
    coordX = canvas.width / 2;
    coordY = canvas.height - 20;
    score = 0;
    rightPressed = false;
    leftPressed = false;
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

const drawInfo = (message, coord) => {
    const { x, y } = coord;
    ctx.font = '16px Arial';
    ctx.fillStyle = "#eeff00";
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
                fullScore++;
                if (score === brickRowCount * brickColumnCount) {
                    level++;
                    statusGame = "win";
                    clearInterval(interval);
                    doStart();
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
    imageCanvas.drawImage(imageBackgroundColor, 0, 0);
    drawBricks();
    drawBall();
    drawPaddle();
    drawInfo(`Score: ${score}`, { x: 8, y: 20 });
    drawInfo(`Lives: ${lives}`, { x: canvas.width - 65, y: 20 });

    collisionDetection();

    if (!statusBall) {
        coordX = paddleX + paddleWidth / 2;
    }
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
                statusGame = "lose";
            } else {
                statusBall = false;
                coordY = canvas.height - 20;
                coordX = paddleX + paddleWidth / 2;
                dx = 0;
                dy = 0;
            }
            alertPlaceholder.addEventListener("close.bs.alert", goOn, false);
        }
    }
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += (level + 3);
    } else if (leftPressed && paddleX > 0) {
        paddleX -= (level + 3);
    }
    if (statusBall) {
        coordX += dx;
        coordY += dy;
    }

}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#ffd000";
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
    if (e.key === 'Up' || e.key === 'ArrowUp') {
        if (!statusBall) {
            dx = level;
            dy = -level;
        }
        statusBall = true;
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
    if (relativeX > paddleWidth && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth;
    }
};


document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

canvas.addEventListener('click', handlerClickCanvas);

function handlerClickCanvas(e) {
    if (!statusBall) {
        dx = level;
        dy = -level;
    }
    statusBall = true;

}

////////////////////-------OUTPUT---------//////////////////////////////////

const alert = (message, type) => {
    if (type === "danger") {
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
    if (type === "dark") {
        wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message;
        '</div>'
    }
    alertPlaceholder.append(wrapper);
    document.getElementsByClassName('alertNew')[0].style = "padding: 0px 0px 0px 0px;";
    document.getElementsByClassName('alert')[0].style = "margin: 0px 0px 0px 0px";
};

////////////////////-------START/RESTART---------//////////////////////////////////

const goOn = () => {
    if (statusGame === "lose") {
        alert("RESTART GAME???", "warning");
        level = 2;
    }

    wrapperBtn.innerHTML = '<div class="d-grid gap-2 d-md-flex justify-content-md-center align-content-md-center">' +
        '<button class="btn btn-success" type="button" onclick="doRestart()">Continue</button>' +
        '<button class="btn btn-secondary" type="button" onclick="goStop()";>Stop</button></div>'
    buttonPlaceholder.append(wrapperBtn);
    document.getElementsByClassName('btnNew')[0].style = "padding: 0px 0px 0px 0px;";

};

const doRestart = () => {
    document.getElementsByClassName('btn-success')[0].style = "display: none";
    document.getElementsByClassName('btn-secondary')[0].style = "display: none";
    document.getElementsByClassName('btnNew')[0].style = "padding: 38px 0px 0px 0px;";

    doStart();
};

const doStart = () => {
    statusBall = false;

    if (!start) {
        alert(`NEW GAME!!! LEVEL: ${level - 1}`, "info");

    } else {
        alert(`LEVEL: ${level - 1} `, "info");
    }
    setTimeout(() => {
        document.getElementsByClassName('alert-info')[0].style = "display: none";
        document.getElementsByClassName('alertNew')[0].style = "padding: 58px 0px 0px 0px;";
    }, 1000);


    interval = setInterval(draw, 10);
    initVariable();
    start = true;
};

const goStop = () => {
    fullTimeEnd = new Date();
    alert("STOP", "dark");
    document.getElementsByClassName('btnNew')[0].style = "padding: 38px 0px 0px 0px;";

    document.getElementsByClassName('btn-success')[0].style = "display: none";
    document.getElementsByClassName('btn-secondary')[0].style = "display: none";

    drawInfo(`Full score: ${fullScore}`, { x: canvas.width / 2 - 40, y: canvas.height / 2 });
    drawInfo(`Full time: ${(fullTimeEnd - fullTime) / 1000} sec`, { x: canvas.width / 2 - 40, y: canvas.height / 2 + 20 });

};

////////////////////-------RUN---------//////////////////////////////////

doStart();