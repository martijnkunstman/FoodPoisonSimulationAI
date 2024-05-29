class Player {
  constructor(x, y, radius, sensors, sensorsLenght) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.controls = new Controls();
    this.sensors = sensors;
    this.moveAngle = 0;
    this.speed = 0;
    this.maxSpeed = 2;
    this.points = 0;
    this.wedges = [];
    this.sensorsLenght = sensorsLenght;
    this.createWedges();
  }

  createWedges() {
    for (let i = 0; i < this.sensors; i++) {
      const startAngle = (i * 2 * Math.PI) / this.sensors - Math.PI;
      const endAngle = ((i + 1) * 2 * Math.PI) / this.sensors - Math.PI;
      const addAngle = (endAngle - startAngle) / 2;
      const color = `hsl(${(i * 360) / this.sensors}, 100%, 50%)`; // Generate different colors for each wedge

      this.wedges.push({
        startAngle: startAngle + addAngle,
        endAngle: endAngle + addAngle,
        color: color,
        food: 0,
        poinson: 0,
      });
    }

    this.wedges[this.sensors - 1].endAngle = this.wedges[0].startAngle;

    console.log(this.wedges);
  }

  drawWedge(
    centerX,
    centerY,
    radius,
    startAngle,
    endAngle,
    color,
    food,
    poison
  ) {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    let point = calculatePointFromStartPointLengthAndAngle(
      centerX,
      centerY,
      startAngle + Math.PI / this.sensors,
      this.sensorsLenght / 2
    );
    ctx.fillText(food, point.x, point.y);
  }

  calculateWedgeValues() {
    for (let i = 0; i < this.wedges.length; i++) {
      this.wedges[i].food = 0;
      this.wedges[i].poinson = 0;
    }

    for (let i = 0; i < foodArray.length; i++) {
      if (
        calculateDistance(player.x, player.y, foodArray[i].x, foodArray[i].y) <
        this.sensorsLenght
      ) {
        //check the angle to this point
        let angle = calculateAngle(
          player.x,
          player.y,
          foodArray[i].x,
          foodArray[i].y
        );
        //console.log(angle);

        for (let i = 0; i < this.wedges.length; i++) {
          //this.wedges[i].food++;
          if (i == this.wedges.length - 1) {
            if (
              (angle > 0 && angle > this.wedges[i].startAngle) ||
              (angle < 0 && angle <= this.wedges[i].endAngle)
            ) {
              this.wedges[i].food++;
            }
          } else {
            if (
              angle > this.wedges[i].startAngle &&
              angle <= this.wedges[i].endAngle
            ) {
              this.wedges[i].food++;
            }
          }
        }
      }
    }
  }

  update() {
    //check collision with food or poison
    for (let i = 0; i < foodArray.length; i++) {
      if (
        calculateDistance(foodArray[i].x, foodArray[i].y, player.x, player.y) <
        this.radius
      ) {
        createNewFood(i, foodArray);
        this.points++;
        //console.log(this.points);
      }
    }

    for (let i = 0; i < poisonArray.length; i++) {
      if (
        calculateDistance(
          poisonArray[i].x,
          poisonArray[i].y,
          player.x,
          player.y
        ) < this.radius
      ) {
        createNewFood(i, poisonArray);
        this.points--;
        //console.log(this.points);
      }
    }
    this.calculateWedgeValues();
  }

  draw() {
    this.update();
    //draw sensors
    // Loop to draw n wedges
    for (let i = 0; i < this.wedges.length; i++) {
      this.drawWedge(
        player.x,
        player.y,
        this.sensorsLenght,
        this.wedges[i].startAngle,
        this.wedges[i].endAngle,
        this.wedges[i].color,
        this.wedges[i].food,
        this.wedges[i].poison
      );
    }
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
  }
}
