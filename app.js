const worldSize = 500;
const foodCount = 50;
const poisonCount = 50;
const playerRadius = 25;
const foodPoisonRadius = 3;
const sensors = 8;
const sensorsLenght = 100;

let points = 0;
let foodArray = [];
let poisonArray = [];

let player = new Player(worldSize / 2, worldSize / 2, playerRadius, sensors, sensorsLenght);

let controls = new Controls();

function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function calculateAngle(x1,y1,x2,y2)
{
  return Math.atan2(y2 - y1, x2 - x1);
}

function calculatePointFromStartPointLengthAndAngle(x1, y1, angleInRadians, length) {
  // Calculate the new point
  var x2 = x1 + length * Math.cos(angleInRadians);
  var y2 = y1 + length * Math.sin(angleInRadians);
  return { x: x2, y: y2 };
}

function createNewFood(index, array) {
  let x = Math.random() * worldSize;
  let y = Math.random() * worldSize;
  if (calculateDistance(player.x, player.y, x, y) < sensorsLenght) {
    createNewFood(index, array);
  } else {
    array[index].x = x;
    array[index].y = y;
  }
}

function valueToRGBA(value) {
  // Ensure the value is within the range -1 to 1
  value = Math.max(-1, Math.min(1, value));

  // Map the value from [-1, 1] to [0, 1]
  var normalizedValue = (value + 1) / 2;

  // Calculate the red, green, and alpha components
  var green = Math.round(255 * normalizedValue);
  var red = Math.round(255 * (1 - normalizedValue));
  var blue = 0;
  var alpha =  Math.abs(value); // Alpha is 1 at -1 and 1, and 0 at 0

  // Return the RGBA color string
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function createFoodPoison() {
  for (let i = 0; i < foodCount; i++) {
    let x = Math.random() * worldSize;
    let y = Math.random() * worldSize;
    //not create food or poison inside Player
    if (
      calculateDistance(worldSize / 2, worldSize / 2, x, y) <
      sensorsLenght/2+playerRadius/2
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
      sensorsLenght/2+playerRadius/2
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
  pointsDiv.innerHTML = "Points: " + player.points;
  requestAnimationFrame(animate);
}

animate();
