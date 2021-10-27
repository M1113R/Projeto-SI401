let boardParams = {
  columns: 3,
  rows: 3,
  bombs: 1,
  mode: "normal",
  level: "normal",
  board: [],
  bombsPositions: [],
  finalTime: 0,
  gameResult: "defeat",
  startDateTime: new Date(),
}

let history = [];

let gameOver = false;

let clicks = 0;

const AROUND_CELL_OPERATORS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function timeFormat(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const [minuteLeft, minuteRight] = String(minutes).padStart(2, "0").split("");
  const [secondLeft, secondRight] = String(seconds).padStart(2, "0").split("");
  return minuteLeft + minuteRight + ":" + secondLeft + secondRight;
}

function handleBombInput() {
  const size = document.querySelector("#game-size").value;
  const bombInput = document.querySelector("#game-bombs");
  bombInput.setAttribute("max", size);
  bombInput.value = size;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function verifyIfPositionIsABomb(position) {
  return boardParams.bombsPositions.join("").includes(position.toString());
}

function cheat() {
  const ele = document.getElementsByClassName("bomb");
  for (let i = 0; i < ele.length; ++i) {
    const bomb = ele[i];
    bomb.innerHTML = "💣";
  }
  setTimeout(() => {
    for (let i = 0; i < ele.length; ++i) {
      const bomb = ele[i];
      bomb.innerHTML = "";
    }
  }, 5000); //alterar para ser proporcional ao numero de bombas e do tabuleiro
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
      const printableValue = "";
      $cell.innerHTML = printableValue;
      $cell.id = `${x}-${y}`;
      if (boardParams.board[x][y] === "💣") $cell.classList.add("bomb");

      $cell.addEventListener("click", function printValue() {
        const element = document.getElementById(`${x}-${y}`);
        element.innerHTML = boardParams.board[x][y];
        if (element.textContent === "💣") {
          gameOver = true;
          alert("Game Over");
          saveHistory("defeat");
        } else {
          if (element.classList.contains('opened')) return;
          element.classList.add('opened');
          checkSquare();
        }
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
    board: [],
    bombsPositions: [],
    finalTime: 0,
    gameResult: "defeat",
    startDateTime: new Date(),
  };

  clicks = 0;
  gameOver = false;

  const board = document.querySelector(".board");
  board.innerHTML = "";

  const timer = document.querySelector(".time-display");
  timer.innerHTML = "";

  const cellsOpened = document.querySelector(".opened-cells");
  cellsOpened.innerHTML = "";
}

function startGame() {
  clearBoard();
  const size = document.querySelector("#game-size").value;
  const bombs = document.querySelector("#game-bombs").value;
  //const level = document.querySelector("#game-level").value;
  const mode = document.querySelector("#game-mode").value;

  boardParams.rows = size;
  boardParams.columns = size;
  boardParams.bombs = bombs;
  boardParams.mode = mode;
  boardParams.level = "normal";

  if (mode === "normal") {
    startTimeCount();
  } else if (mode === "rivotril") {
    startRivotrilCount();
  }

  generateNewBoard();
}

function startTimeCount() {
  const timer = document.querySelector(".time-display");
  let time = 0;
  let interval = setInterval(() => {
    if (gameOver) {
      clearInterval(interval);
      console.log(time)
      console.log(boardParams.finalTime)
      time = 0;
      return;
    }
    time++;
    boardParams.finalTime = time;
    timer.innerHTML = "Tempo: " + timeFormat(time);
  }, 1000);
}

function startRivotrilCount() {
  const timer = document.querySelector(".time-display");
  let remaningTime = boardParams.rows * 10; //10 segundos para cada linha
  let totalTime = 0;
  let interval = setInterval(() => {
    if (gameOver) {
      clearInterval(interval);
      return;
    } else if (remaningTime === 0) {
      clearInterval(interval);
      alert("Game Over");
      gameOver = true;
      saveHistory("defeat");
      return;
    }
    remaningTime = remaningTime - 1;
    totalTime++;
    boardParams.finalTime = totalTime;
    timer.innerHTML = "Tempo: " + timeFormat(remaningTime);
  }, 1000);
}

function checkSquare() {
  clicks++;
  const cellsOpened = document.querySelector(".opened-cells");
  cellsOpened.innerHTML = "Células Abertas: " + clicks;
  const squares = boardParams.columns * boardParams.rows;
  if (clicks === (squares - boardParams.bombs)) {
    gameOver = true;
    alert("WIN!!!");
    saveHistory("win");
  }
}

function saveHistory(condition) {
  boardParams.gameResult = condition;
  let game = boardParams;
  game.player = "Fischer";
  console.log(boardParams.finalTime)
  delete game.bombsPositions;
  delete game.board;
  history.push(game);
  printGameInHistory(game);
  console.table(history);
}

function printGameInHistory(game) {
  const list = document.querySelector(".list-body");

  const row = list.insertRow(history.length - 1);
  row.insertCell(0).innerHTML = game.player;
  row.insertCell(1).innerHTML = game.rows;
  row.insertCell(2).innerHTML = game.bombs;
  row.insertCell(3).innerHTML = game.mode;
  row.insertCell(4).innerHTML = timeFormat(boardParams.finalTime);
  row.insertCell(5).innerHTML = game.gameResult === "win" ? "Vitória" : "Derrota";
  row.insertCell(6).innerHTML = new Intl.DateTimeFormat('pt-BR', {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(game.startDateTime);
}

