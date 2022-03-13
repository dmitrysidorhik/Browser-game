const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

ctx.rect(20, 40, 50, 50);
ctx.fillStyle = "#FF0000";
ctx.fill();

ctx.beginPath();
ctx.arc(240, 260, 20, 0, 2 * Math.PI);
ctx.fillStyle = 'green';
ctx.fill();
ctx.closePath();