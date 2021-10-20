let boardParams = {
  columns: 3,
  rows: 3,
  bombs: 1,
  mode: "normal",
  level: "normal",
  board: [],
  bombsPositions: [],
}

const AROUND_CELL_OPERATORS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function verifyIfPositionIsABomb(position) {
  return boardParams.bombsPositions.join("").includes(position.toString());
}

function generateNewBoard() {
  for (let y = 0; y < boardParams.rows; y++) {
    boardParams.board.push([]);
    for (let x = 0; x < boardParams.columns; x++) {
      boardParams.board[y][x] = 0;
    }
  }

  generateBombsPositionsAndInsert();
  updateBoardNumbers();

  const board = document.querySelector(".board");

  for (let x = 0; x < boardParams.rows; x++) {

    const $row = document.createElement('DIV');
    $row.classList.add('row');

    for (let y = 0; y < boardParams.rows; y++) {
      const $cell = document.createElement('SPAN');
      //const printableValue = boardParams.board[x][y];
      const printableValue = "";
      $cell.innerHTML = printableValue;
      $cell.id = `${x}-${y}`;
      if (printableValue === "💣") $cell.classList.add('bomb');
      $cell.addEventListener("click", function printValue() {
        const element = document.getElementById(`${x}-${y}`);
        element.innerHTML = boardParams.board[x][y];
        if (element.textContent === "💣") alert("Game Over");
      });
      $row.appendChild($cell);
    }

    board.appendChild($row);
  }
}



function generateBombsPositionsAndInsert() {
  boardParams.bombsPositions = [];
  while (boardParams.bombsPositions.length < boardParams.bombs) {
    const y = getRandomInt(0, boardParams.rows);
    const x = getRandomInt(0, boardParams.columns);
    if (!verifyIfPositionIsABomb([x, y])) boardParams.bombsPositions.push([x, y]);
  }

  for (let i = 0; i < boardParams.bombsPositions.length; i++) {
    const y = boardParams.bombsPositions[i][0];
    const x = boardParams.bombsPositions[i][1];
    boardParams.board[y][x] = "💣";
  }
}

function updateBoardNumbers() {
  for (let i = 0; i < boardParams.bombsPositions.length; i++) {
    for (let j = 0; j < AROUND_CELL_OPERATORS.length; j++) {
      const minePosition = boardParams.bombsPositions[i];
      const around = AROUND_CELL_OPERATORS[j];
      const boardY = minePosition[0] + around[0];
      const boardX = minePosition[1] + around[1];

      if (boardY >= 0 && boardY < boardParams.rows &&
        boardX >= 0 && boardX < boardParams.columns &&
        typeof boardParams.board[boardY][boardX] === 'number') {
        boardParams.board[boardY][boardX]++;
      }
    }
  }
}

function clearBoard() {
  boardParams = {
    columns: 3,
    rows: 3,
    bombs: 1,
    mode: "normal",
    level: "normal",
    board: []
  }

  const board = document.querySelector(".board");

  board.innerHTML = "";
}

function getInitialSetup() {
  clearBoard();
  const size = document.querySelector("#game-size").value;
  const bombs = document.querySelector("#game-bombs").value;
  const level = document.querySelector("#game-level").value;
  const mode = document.querySelector("#game-mode").value;

  boardParams.rows = size;
  boardParams.columns = size;
  boardParams.bombs = bombs;
  boardParams.mode = mode;
  boardParams.level = level;

  generateNewBoard();
}

