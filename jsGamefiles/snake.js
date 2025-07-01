// --- Your original game variables ---
var s;
var scl = 20;
var food;
var count = 1;
var touch = 1;
var prevX = [];
var prevY = [];
var currentScore = 0;

const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzY_vWm4sLQjJnwFoKEP32hiWdDY8ins5acTErD0mFCo5ZiNAw273gMsCfDBw3qdo71vA/exec';

function setup() {
  // Create canvas inside the #game-area div
  let canvas = createCanvas(600, 600);
  canvas.parent('game-area');

  s = new Snake();
  frameRate(10);
  pickLocation();

  updateScoreDisplay();
  fetchLeaderboard();

  // Refresh leaderboard button
  document.getElementById('refresh-leaderboard').addEventListener('click', fetchLeaderboard);
}

function pickLocation() {
  var col = floor(width / scl);
  var rows = floor(height / scl);
  food = createVector(floor(random(col)), floor(random(rows)));
  food.mult(scl);
}

function foodTouch() {
  return s.x === food.x && s.y === food.y;
}

function gameOver() {
  let playerName = prompt("Game Over! Enter your name to save your score:");
  if (!playerName) playerName = "Anonymous";

  let data = new URLSearchParams();
  data.append('name', playerName);
  data.append('score', prevX.length);

  fetch(GOOGLE_SHEET_URL, {
    method: 'POST',
    body: data
  })
  .then(res => res.json())
  .then(json => {
    alert('Score saved!');
    fetchLeaderboard();
  })
  .catch(err => {
    alert('Error saving score: ' + err);
  });

  document.location.reload();
}

function feed() {
  prevX.push(s.x);
  prevY.push(s.y);

  if (prevX.length > touch + 1) {
    prevX.shift();
    prevY.shift();
  }
}

function draw() {
  background(51);
  s.update();

  fill(255, 0, 100);
  rect(food.x, food.y, scl, scl);

  if (foodTouch()) {
    pickLocation();
    touch++;
  }

  feed();
  s.showIt();

  if ((prevX.includes(s.x)) && (prevY.includes(s.y))) {
    let c = 0;
    for (let t = 3; t < prevX.length; t++) {
      if (prevX[t] === s.x && prevY[t] === s.y) {
        c++;
      }
      if (c > 1) gameOver();
    }
  }

  currentScore = touch;
  updateScoreDisplay();
}

function updateScoreDisplay() {
  document.getElementById('current-score').textContent = currentScore;
}

function fetchLeaderboard() {
  fetch(GOOGLE_SHEET_URL)
    .then(res => res.json())
    .then(data => {
      // Sort scores descending
      data.sort((a, b) => b.score - a.score);

      let list = document.getElementById('leaderboard-list');
      list.innerHTML = '';

      data.forEach((item, index) => {
        let li = document.createElement('li');
        li.textContent = `${item.name} — ${item.score}`;
        list.appendChild(li);
      });
    })
    .catch(err => {
      console.error('Error fetching leaderboard:', err);
    });
}


// --- Snake class ---

class Snake {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.xSpeed = 1;
    this.ySpeed = 0;

    this.dir = function (x, y) {
      this.xSpeed = x;
      this.ySpeed = y;
    }

    this.getDir = function() {
      return {
        xSpeed: this.xSpeed,
        ySpeed: this.ySpeed
      };
    }

    this.update = function () {
      this.x = this.x + (this.xSpeed * scl);
      this.y = this.y + (this.ySpeed * scl);

      if (this.x >= 600) this.x = 0;
      if (this.y >= 600) this.y = 0;
      if (this.y < 0) this.y = 600;
      if (this.x < 0) this.x = 600;
    };

    this.showIt = function () {
      fill(252);
      rect(this.x, this.y, scl, scl);
      for (var m = 0; m < touch; m++) {
        rect(prevX[m], prevY[m], scl, scl);
      }
    };
  }
}

function keyPressed() {
  var direction = s.getDir();

  if (keyCode === UP_ARROW && direction.ySpeed !== 1) {
    s.dir(0, -1);
  } else if (keyCode === DOWN_ARROW && direction.ySpeed !== -1) {
    s.dir(0, 1);
  } else if (keyCode === RIGHT_ARROW && direction.xSpeed !== -1) {
    s.dir(1, 0);
  } else if (keyCode === LEFT_ARROW && direction.xSpeed !== 1) {
    s.dir(-1, 0);
  }
}
