
const winEl = document.getElementById('win');
const lossEl = document.getElementById('loss');
const drowEl = document.getElementById('drow');
const timeEl = document.getElementById('time');
const movesEl = document.getElementById('moves');
const statusText = document.getElementById('statusText');
const currentPlayerEl = document.getElementById('currentPlayer');

const boardContainer = document.getElementById('board');
const resetBtn = document.getElementById('resetBtn');
const gameBtn = document.getElementById('gameBtn');

let boardState = Array(9).fill(null);
let currentPlayer = 'X';
let started = false;
let moves = 0;
let timer = null;
let seconds = 0;

const WINNING = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// create cells
function createBoard() {
    boardContainer.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const d = document.createElement('div');
        d.className = 'cell';
        d.dataset.index = i;
        d.setAttribute('role', 'button');
        d.setAttribute('aria-label', 'cell ' + i);
        boardContainer.appendChild(d);
    }
}

createBoard();

function startTimer() {
    if (timer) return;
    seconds = 0;
    timeEl.textContent = formatTime(seconds);
    timer = setInterval(() => {
        seconds++;
        timeEl.textContent = formatTime(seconds);
    }, 1000);
}
function stopTimer() {
    clearInterval(timer); timer = null;
}
function formatTime(s) {
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return mm + ' : ' + ss;
}

function updateUI() {
    currentPlayerEl.textContent = currentPlayer;
    movesEl.textContent = moves;
}

function checkWinner() {
    for (const combo of WINNING) {
        const [a, b, c] = combo;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return { winner: boardState[a], combo };
        }
    }
    if (boardState.every(Boolean)) return { winner: null }; // draw
    return null; // game continues
}

// handle clicks using delegation
boardContainer.addEventListener('click', (e) => {
    const cell = e.target.closest('.cell');
    if (!cell) return;
    const idx = Number(cell.dataset.index);
    if (boardState[idx] || (checkWinner() && checkWinner().winner !== undefined)) return; // already taken or game ended

    if (!started) { started = true; startTimer(); }

    boardState[idx] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    moves++;

    // check winner/draw
    const result = checkWinner();
    if (result) {
        if (result.winner) {
            // highlight combo
            result.combo.forEach(i => {
                const el = boardContainer.querySelector('[data-index="' + i + '"]');
                el.classList.add('win');
            });
            statusText.textContent = `Player ${result.winner} wins!`;
            if (result.winner === 'X') winEl.textContent = Number(winEl.textContent) + 1;
            else lossEl.textContent = Number(lossEl.textContent) + 1;
            stopTimer();
            // disable remaining cells visually
            boardContainer.querySelectorAll('.cell').forEach(c => c.classList.add('disabled'));
        } else {
            statusText.textContent = 'It\'s a draw!';
            drowEl.textContent = Number(drowEl.textContent) + 1;
            stopTimer();
        }
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusText.textContent = `Player ${currentPlayer} to move`;
    }
    updateUI();
});

resetBtn.addEventListener('click', () => {
    // reset board only
    boardState = Array(9).fill(null);
    boardContainer.querySelectorAll('.cell').forEach(c => {
        c.textContent = '';
        c.className = 'cell';
    });
    currentPlayer = 'X';
    moves = 0;
    started = false;
    stopTimer();
    seconds = 0;
    timeEl.textContent = formatTime(seconds);
    statusText.textContent = 'Board reset. X to move.';
    updateUI();
});

gameBtn.addEventListener('click', () => {
    // full reset including scores
    if (!confirm('Reset entire game and scores?')) return;
    resetBtn.click();
    winEl.textContent = '0';
    lossEl.textContent = '0';
    drowEl.textContent = '0';
    statusText.textContent = 'New game — ready.';
});

// init UI
statusText.textContent = 'Ready — click a box to start';
currentPlayerEl.textContent = currentPlayer;
timeEl.textContent = formatTime(0);
updateUI();