const puzzleBoard = document.getElementById("puzzle-board");
const movesDisplay = document.getElementById("moves");
const timeDisplay = document.getElementById("time");
const newGameButton = document.getElementById("new-game");

let puzzle = [];
let moves = 0;
let timer = 0;
let intervalId = null;

function initializePuzzle() {
    const numbers = [...Array(15).keys()].map(x => x + 1).concat(null);
    shuffle(numbers);

    puzzle = [];
    for (let i = 0; i < 4; i++) {
        puzzle.push(numbers.slice(i * 4, (i + 1) * 4));
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function renderPuzzle() {
    puzzleBoard.innerHTML = "";
    puzzle.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            if (cell === null) {
                tile.classList.add("empty");
            } else {
                tile.textContent = cell;
                tile.addEventListener("click", () => moveTile(rowIndex, colIndex));
            }
            puzzleBoard.appendChild(tile);
        });
    });
}

function moveTile(row, col) {
    const directions = [
        [1, 0], [-1, 0], [0, 1], [0, -1]
    ];

    for (let [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < 4 && newCol >= 0 && newCol < 4 && puzzle[newRow][newCol] === null) {
            [puzzle[row][col], puzzle[newRow][newCol]] = [puzzle[newRow][newCol], puzzle[row][col]];
            moves++;
            movesDisplay.textContent = moves;
            renderPuzzle();
            if (isSolved()) {
                clearInterval(intervalId);
                alert(`Congratulations! Puzzle solved in ${moves} moves and ${timer} seconds!`);
            }
            return;
        }
    }
    alert("You can only move tiles adjacent to the empty space.");
}

function isSolved() {
    const flat = puzzle.flat();
    for (let i = 0; i < 15; i++) {
        if (flat[i] !== i + 1) return false;
    }
    return flat[15] === null;
}

function startTimer() {
    intervalId = setInterval(() => {
        timer++;
        timeDisplay.textContent = `${timer}s`;
    }, 1000);
}

newGameButton.addEventListener("click", () => {
    initializePuzzle();
    renderPuzzle();
    moves = 0;
    timer = 0;
    movesDisplay.textContent = moves;
    timeDisplay.textContent = `${timer}s`;
    clearInterval(intervalId);
    startTimer();
});

// Initialize game
initializePuzzle();
renderPuzzle();
startTimer();
