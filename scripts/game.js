let boardParams = {
  columns: 3,
  rows: 3,
  bombs: 1,
  mode: "normal",
  level: "normal",
  board: [],
  bombsPositions: [],
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function isAlreadyAMine(minePosition) {
  return boardParams.bombsPositions.join("").includes(minePosition.toString());
}

function generateNewBoard() {
  for (let y = 0; y < boardParams.rows; y++) {
    boardParams.board.push([]);
    for (let x = 0; x < boardParams.columns; x++) {
      boardParams.board[y][x] = 0;
    }
  }

  generateBombsPositionsAndInsert();

  console.table(boardParams.board);

  const board = document.querySelector(".board");

  for (let x = 0; x < boardParams.rows; x++) {

    const $row = document.createElement('DIV');
    $row.classList.add('row');

    for (let y = 0; y < boardParams.rows; y++) {
      const $cell = document.createElement('SPAN');
      $cell.innerHTML = boardParams.board[x][y];
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

    //if (isAlreadyAMine([y, x])) {
    boardParams.bombsPositions.push([y, x]);
    //}
  }

  for (let i = 0; i < boardParams.bombsPositions.length; i++) {
    const y = boardParams.bombsPositions[i][0];
    const x = boardParams.bombsPositions[i][1];
    boardParams.board[y][x] = "B";
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

