const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const restartBtn = document.getElementById('restartBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const pauseBtn = document.getElementById('pauseBtn');
const gameOverDiv = document.getElementById('gameOver');
const finalScoreEl = document.getElementById('finalScore');
const touchButtons = document.querySelectorAll('[data-dir]');
const timerEl = document.getElementById('timer'); 

const CELL = 20;                 // size of a single grid cell (px)
const CANVAS_SIZE = 400;         // canvas is CANVAS_SIZE x CANVAS_SIZE px
const COLS = CANVAS_SIZE / CELL; // number of columns (and rows)
const MOVE_INTERVAL = 200;       // milliseconds between snake moves (smaller => faster)

// ensure canvas rendering size is set explicitly for crisp drawing
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

let snake = [];            // array of parts: {x, y} (head at index 0)
let direction = { x: 0, y: 0 };   // current direction vector (unit steps)
let nextDirection = null;  // queued direction to apply at next move
let food = null;           // food position {x, y}
let score = 0;
let highScore = 0;
let running = false;       // is the game loop running?
let lastMoveTime = 0;      // timestamp of last logical move
let rafId = null;          // requestAnimationFrame id

let timer = 0;             // elapsed seconds
let timerInterval = null;  // handle for setInterval

function randomCell() {
  return {
    x: Math.floor(Math.random() * COLS) * CELL,
    y: Math.floor(Math.random() * COLS) * CELL,
  };
}

function positionsEqual(a, b) {
  return a.x === b.x && a.y === b.y;
}

function isOnSnake(pos) {
  return snake.some(part => positionsEqual(part, pos));
}

/* Format seconds into MM:SS */
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/* Timer helpers */
function startTimer() {
  // start counting seconds (do nothing if already running)
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    timer++;
    if (timerEl) timerEl.textContent = formatTime(timer);
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

/* Start timer only if snake is moving (direction non-zero) */
function startTimerIfSnakeMoving() {
  if ((direction.x !== 0 || direction.y !== 0) && !timerInterval) {
    startTimer();
  }
}

/* Place food in a cell that isn't occupied by the snake */
function placeFood() {
  let candidate;
  do {
    candidate = randomCell();
  } while (isOnSnake(candidate));
  food = candidate;
}

function initGame() {
  const start = { x: Math.floor(COLS / 2) * CELL, y: Math.floor(COLS / 2) * CELL };
  snake = [start];
  direction = { x: 0, y: 0 };
  nextDirection = null;
  score = 0;
  scoreEl.textContent = score;
  highScore = Number(localStorage.getItem('snakeHigh') || 0);
  highScoreEl.textContent = highScore;
  placeFood();
  hideGameOver();

  // Reset timer display and state (timer should not start until movement)
  timer = 0;
  if (timerEl) timerEl.textContent = formatTime(timer);
  stopTimer();

  lastMoveTime = performance.now();
  // start the loop if not already running
  if (!running) startGame();
}

function startGame() {
  running = true;
  pauseBtn.textContent = 'Pause';
  // Do NOT start the timer here automatically.
  // Timer will be started only once the snake actually moves.
  // However, if the snake already has a movement direction (resume), ensure timer resumes.
  startTimerIfSnakeMoving();

  // set lastMoveTime so movement timing starts fresh
  lastMoveTime = performance.now();
  rafId = requestAnimationFrame(loop);
}

function stopGame() {
  running = false;
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  // stop visual loop and pause timer
  stopTimer();
}

function onGameOver() {
  stopGame();
  finalScoreEl.textContent = score;
  gameOverDiv.classList.remove('hidden');

  // update and persist high score
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('snakeHigh', String(highScore));
    highScoreEl.textContent = highScore;
  }
}

function hideGameOver() {
  gameOverDiv.classList.add('hidden');
}

function applyDirection() {
  if (!nextDirection) return;
  const nd = nextDirection;

  // Prevent reversing into yourself: ignore if new direction is the exact opposite
  if ((nd.x === -direction.x && nd.y === -direction.y) && (direction.x !== 0 || direction.y !== 0)) {
    nextDirection = null;
    return;
  }

  // If previously stationary and now receiving a movement, start the timer
  const wasStationary = (direction.x === 0 && direction.y === 0);
  direction = nd;
  nextDirection = null;

  if (wasStationary && (direction.x !== 0 || direction.y !== 0)) {
    // Snake just started moving — start the timer now
    startTimer();
  }
}

function update() {
  // if not moving yet (direction 0), skip movement logic
  if (direction.x === 0 && direction.y === 0) return;

  const head = snake[0];
  const newHead = { x: head.x + direction.x * CELL, y: head.y + direction.y * CELL };

  // wall collision
  if (newHead.x < 0 || newHead.y < 0 || newHead.x >= CANVAS_SIZE || newHead.y >= CANVAS_SIZE) {
    onGameOver();
    return;
  }

  // self collision
  if (isOnSnake(newHead)) {
    onGameOver();
    return;
  }

  // add new head
  snake.unshift(newHead);

  // eating
  if (positionsEqual(newHead, food)) {
    score += 1;
    scoreEl.textContent = score;
    placeFood();
  } else {
    // normal move - remove tail
    snake.pop();
  }
}

function draw() {
  // clear canvas
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // background
  ctx.fillStyle = '#071016';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // draw food
  ctx.fillStyle = '#ff5a5f';
  ctx.fillRect(food.x + 2, food.y + 2, CELL - 4, CELL - 4);

  // draw snake - head distinct
  for (let i = 0; i < snake.length; i++) {
    const p = snake[i];
    if (i === 0) {
      ctx.fillStyle = '#6af58a'; // head
      ctx.fillRect(p.x + 1, p.y + 1, CELL - 2, CELL - 2);
    } else {
      ctx.fillStyle = '#2ec06a'; // body
      ctx.fillRect(p.x + 2, p.y + 2, CELL - 4, CELL - 4);
    }
  }
}

function loop(timestamp) {
  if (!running) return;

  // Apply queued direction before movement step so controls feel responsive.
  applyDirection();

  const elapsed = timestamp - lastMoveTime;
  if (elapsed >= MOVE_INTERVAL) {
    update();
    lastMoveTime = timestamp;
  }

  // draw every frame to keep UI responsive
  draw();

  rafId = requestAnimationFrame(loop);
}

// Keyboard controls (arrows + WASD)
window.addEventListener('keydown', (e) => {
  // space key unpauses/resumes, but do not start the timer unless movement begins
  if (!running && e.key === ' ') {
    startGame();
    return;
  }

  switch (e.key) {
    case 'ArrowUp': case 'w': case 'W': nextDirection = { x: 0, y: -1 }; break;
    case 'ArrowDown': case 's': case 'S': nextDirection = { x: 0, y: 1 }; break;
    case 'ArrowLeft': case 'a': case 'A': nextDirection = { x: -1, y: 0 }; break;
    case 'ArrowRight': case 'd': case 'D': nextDirection = { x: 1, y: 0 }; break;
  }
});

// Touch / on-screen controls (mobile)
touchButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const dir = btn.dataset.dir;
    switch (dir) {
      case 'UP': nextDirection = { x: 0, y: -1 }; break;
      case 'DOWN': nextDirection = { x: 0, y: 1 }; break;
      case 'LEFT': nextDirection = { x: -1, y: 0 }; break;
      case 'RIGHT': nextDirection = { x: 1, y: 0 }; break;
    }
  });
});

pauseBtn.addEventListener('click', () => {
  if (running) {
    stopGame();
    pauseBtn.textContent = 'Resume';
  } else {
    startGame();
  }
});

function restartGame() {
  stopGame();
  initGame();
}
restartBtn.addEventListener('click', restartGame);
playAgainBtn.addEventListener('click', restartGame);

initGame();
