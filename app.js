const worldSize = 800;
const foodCount = 50;
const poisonCount = 50;
const playerRadius = 25;
const foodPoisonRadius = 3;
let foodArray = [];
let poisonArray = [];

function createFoodPoison() {
  for (let i = 0; i < foodCount; i++) {
    let x = Math.random() * worldSize;
    let y = Math.random() * worldSize;
    foodArray.push({ x, y });
  }

  for (let i = 0; i < poisonCount; i++) {
    let x = Math.random() * worldSize;
    let y = Math.random() * worldSize;
    poisonArray.push({ x, y });
  }
}

createFoodPoison();


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

ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(worldSize/2, worldSize/2, playerRadius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();


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
  ctx.arc(poisonArray[i].x, poisonArray[i].y, foodPoisonRadius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
}