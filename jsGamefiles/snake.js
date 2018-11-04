var s;
var scl = 20;
var food;
var count = 1;
var touch = 1;
var prevX = [];
var prevY = [];




function setup() {
  createCanvas(600, 600)
  s = new Snake();
  frameRate(10);
  //food  = createVector(random(width), random(height));
  pickLocation();
  // console.log(food);
}

function pickLocation() {
  var col = floor(width / scl);
  var rows = floor(height / scl);
  food = createVector(floor(random(col)), floor(random(rows)));

  // console.log(food);
food.mult(scl);
}

function foodTouch() {

  if (s.x == food.x && s.y == food.y) {
    return 1;
  } else {
    return 0;
  }
}



function gameOver() {
  alert("Your game is over and score is : "+ prevX.length);
  document.location.reload();

}

function feed() {
  prevX.push(s.x);
  prevY.push(s.y);

  if (prevX.length > touch + 1) {
    prevX.shift(); //pop
    prevY.shift(); //pop  for MCBC game
  }
}


function draw() {
  var c = 0;
  background(51)
  s.update();

  fill(255, 0, 100);
  rect(food.x, food.y, scl, scl);
  var z = foodTouch();
  if (z == 1) {
    pickLocation();
    touch = touch + 1;
  }
  feed();
  s.showIt();

  if ((prevX.includes(s.x)) && (prevY.includes(s.y))) {
    for (var t = 3; t < prevX.length; t++) {
      if (prevX[t] == s.x) {
        if (prevY[t] == s.y) {
          //console.log(prevX[t] + " " + s.x + " " + prevY[t] + " " + s.y);

          c = c + 1
          //console.log(c);
        }


        if (c > 1) {
          gameOver()
        }
      }

    }

  }

}


function keyPressed() {
  var direction = s.getDir();
    
  if (keyCode === UP_ARROW) {
    if(direction.ySpeed != 1){
    s.dir(0, -1);
    }
  } else if (keyCode === DOWN_ARROW) {
    if(direction.ySpeed != -1){
    s.dir(0, 1);
    }
  } else if (keyCode === RIGHT_ARROW) {
    if(direction.xSpeed !=-1){
    s.dir(1, 0);
    }
  } else if (keyCode === LEFT_ARROW) {
    if(direction.xSpeed !=1){
    s.dir(-1, 0);
    }
  }

}