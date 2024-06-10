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
    this.velocity = [0, 0];
    this.damping = 0.1;
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
        food: [],
        poison: [],
        value: 0,
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
    ctx.fillText(food.length + "-" + poison.length, point.x, point.y);
  }

  calculateWedgeValues() {
    for (let i = 0; i < this.wedges.length; i++) {
      this.wedges[i].food = [];
      this.wedges[i].poison = [];
    }

    for (let i = 0; i < foodArray.length; i++) {
      let distance = calculateDistance(
        player.x,
        player.y,
        foodArray[i].x,
        foodArray[i].y
      );
      if (distance < this.sensorsLenght) {
        //check the angle to this point
        let angle = calculateAngle(
          player.x,
          player.y,
          foodArray[i].x,
          foodArray[i].y
        );
        //console.log(angle);

        for (let i = 0; i < this.wedges.length; i++) {
          if (i == this.wedges.length - 1) {
            if (
              (angle > 0 && angle > this.wedges[i].startAngle) ||
              (angle < 0 && angle <= this.wedges[i].endAngle)
            ) {
              this.wedges[i].food.push(distance);
            }
          } else {
            if (
              angle > this.wedges[i].startAngle &&
              angle <= this.wedges[i].endAngle
            ) {
              this.wedges[i].food.push(distance);
            }
          }
        }
      }
    }

    for (let i = 0; i < poisonArray.length; i++) {
      let distance = calculateDistance(
        player.x,
        player.y,
        poisonArray[i].x,
        poisonArray[i].y
      );
      if (distance < this.sensorsLenght) {
        //check the angle to this point
        let angle = calculateAngle(
          player.x,
          player.y,
          poisonArray[i].x,
          poisonArray[i].y
        );
        //console.log(angle);

        for (let i = 0; i < this.wedges.length; i++) {
          if (i == this.wedges.length - 1) {
            if (
              (angle > 0 && angle > this.wedges[i].startAngle) ||
              (angle < 0 && angle <= this.wedges[i].endAngle)
            ) {
              this.wedges[i].poison.push(distance);
            }
          } else {
            if (
              angle > this.wedges[i].startAngle &&
              angle <= this.wedges[i].endAngle
            ) {
              this.wedges[i].poison.push(distance);
            }
          }
        }
      }
    }

    //calculate value and the color

    for (let i = 0; i < this.wedges.length; i++) {
      this.wedges[i].value = 0;
      for (let ii = 0; ii < this.wedges[i].food.length; ii++) {
        this.wedges[i].value += this.normalizePosition(
          this.sensorsLenght,
          this.radius,
          this.wedges[i].food[ii]
        );
      }
      for (let ii = 0; ii < this.wedges[i].poison.length; ii++) {
        this.wedges[i].value -=
          this.normalizePosition(
            this.sensorsLenght,
            this.radius,
            this.wedges[i].poison[ii]
          ) * 2;
      }
      this.wedges[i].color = valueToRGBA(this.wedges[i].value);
    }

    //MOVE BASED ON VALUES
    //what wedge has the highest value and is bigger than 0?
    let wedge = Math.floor(Math.random() * 9);
    let value = -1000;
    let x = 0;
    let y = 0;
    for (let i = 0; i < this.wedges.length; i++) {
        if (value < this.wedges[i].value) {
          value = this.wedges[i].value;
          wedge = i;
        }
    }
    if ((wedge == 0)) {
      y = -1;
      x = -1;
    }
    if ((wedge == 1)) {
      y = -1;
    }
    if ((wedge == 2)) {
      x = 1;
      y = -1;
    }
    if ((wedge == 3)) {
      x = 1;      
    }
    if ((wedge == 4)) {
      x = 1;
      y = 1;
    }
    if ((wedge == 5)) {
      y = 1;
    }
    if ((wedge == 6)) {
      x = -1;
      y = 1;
    }
    if ((wedge == 7)) {
      x = -1;
    }
    
    let updateVecor = [x,y];

    this.updateVelocityUsingDamping(updateVecor);
    this.normalizeVelocityToMaxSpeed();
    this.x += this.velocity[0];
    this.y += this.velocity[1];

    if (this.x > canvas.width) {
      this.x = 0;
    }
    if (this.x < 0) {
      this.x = canvas.width;
    }
    if (this.y > canvas.height) {
      this.y = 0;
    }
    if (this.y < 0) {
      this.y = canvas.height;
    }




  }

  updateVelocityUsingDamping(updateVecor) {
    this.velocity[0] = this.velocity[0] + updateVecor[0]* this.damping ;
    this.velocity[1] = this.velocity[1] + updateVecor[1]* this.damping ;
  }


  normalizeVelocityToMaxSpeed() {
    let magnitude = Math.sqrt(
      this.velocity[0] * this.velocity[0] + this.velocity[1] * this.velocity[1]
    );
    if (magnitude > this.maxSpeed) {
      this.velocity[0] = (this.velocity[0] / magnitude) * this.maxSpeed;
      this.velocity[1] = (this.velocity[1] / magnitude) * this.maxSpeed;
    }
  }



  normalizePosition(start, end, position) {
    // Ensure start and end are not the same to avoid division by zero
    if (start === end) {
      throw new Error("Start and end values cannot be the same.");
    }

    // Calculate the normalized value
    var normalized = (position - start) / (end - start);

    // Clamp the value between 0 and 1
    normalized = Math.max(0, Math.min(1, normalized));

    return normalized;
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
