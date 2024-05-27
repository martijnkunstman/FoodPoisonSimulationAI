
const worldSize = 800;
const foodCount = 50;
const poisonCount = 50;
const playerRadius = 25;
const foodPoisonRadius = 3;
const sensors = 5;
const sensorsLenght = 50;

let points = 0;
let foodArray = [];
let poisonArray = [];

let player = new Player(worldSize / 2, worldSize / 2, playerRadius, sensors);

let controls = new Controls();

function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function createFoodPoison() {

  for (let i = 0; i < foodCount; i++) {
    let x = Math.random() * worldSize;
    let y = Math.random() * worldSize;
   //not create food or poison inside Player
    if (
      calculateDistance(worldSize / 2, worldSize / 2, x, y) <
      playerRadius * 2
    ) {
      i--;
      continue;
    }
    foodArray.push({ x, y });
  }

  for (let i = 0; i < poisonCount; i++) {
    let x = Math.random() * worldSize;
    let y = Math.random() * worldSize;
    if (
      calculateDistance(worldSize / 2, worldSize / 2, x, y) <
      playerRadius * 4
    ) {
      i--;
      continue;
    }
    poisonArray.push({ x, y });
  }
}

createFoodPoison();

//create a div element that displays the points
var pointsDiv = document.createElement("div");
document.body.appendChild(pointsDiv);
pointsDiv.innerHTML = "Points: " + points;

//create a canvas element and add it to the body
var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
//create a 2d context for the canvas
var ctx = canvas.getContext("2d");
//set the canvas dimensions
canvas.width = worldSize;
canvas.height = worldSize;
//set the canvas background color
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

function drawPlayer() {
  player.draw();
}

function drawFoodPoison() {
  for (let i = 0; i < foodArray.length; i++) {
    let x = Math.random() * worldSize;
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(foodArray[i].x, foodArray[i].y, foodPoisonRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }

  for (let i = 0; i < poisonArray.length; i++) {
    let x = Math.random() * worldSize;
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(
      poisonArray[i].x,
      poisonArray[i].y,
      foodPoisonRadius,
      0,
      2 * Math.PI
    );
    ctx.stroke();
    ctx.fill();
  }
}

function animate() {
  ctx.clearRect(0, 0, worldSize, worldSize);
  drawPlayer();
  drawFoodPoison();
  //console.log(controls);
  if (controls.up) {
    player.y -= 1;
  }
  if (controls.down) {
    player.y += 1;
  }
  if (controls.left) {
    player.x -= 1;
  }
  if (controls.right) {
    player.x += 1;
  }
  requestAnimationFrame(animate);
}

animate();
