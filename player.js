class Player {
  constructor(x, y, radius, sensors) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.controls = new Controls();
    this.sensors = sensors;
    this.moveAngle = 0;
    this.speed = 0;
    this.maxSpeed = 2;
    this.points = 0;
  }

  drawWedge(centerX, centerY, radius, startAngle, endAngle, color) {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.stroke();
  }

  update() {
    //check collision with food or poison
    for (let i = 0; i < foodArray.length; i++) {

      if (calculateDistance(foodArray[i].x, foodArray[i].y, player.x, player.y)<this.radius)
        {
          foodArray[i].x=0;
          foodArray[i].y=0;
          this.points++;
          console.log(this.points)
        }

    }
  }

  draw() {
    this.update();
    //draw sensors
    // Loop to draw n wedges
    let n = this.sensors;
    for (let i = 0; i < n; i++) {
      const startAngle = (i * 2 * Math.PI) / n;
      const endAngle = ((i + 1) * 2 * Math.PI) / n;
      const color = `hsl(${(i * 360) / n}, 100%, 50%)`; // Generate different colors for each wedge
      this.drawWedge(player.x, player.y, 100, startAngle, endAngle, color);
    }
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
  }
}
