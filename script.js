const board = document.getElementById("board");
const turnDisplay = document.getElementById("turn");
let currentPlayer = "black";
let boardState = [];

function initBoard() {
  board.innerHTML = "";
  boardState = [];

  for (let y = 0; y < 8; y++) {
    const row = [];
    for (let x = 0; x < 8; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.addEventListener("click", handleClick);
      board.appendChild(cell);
      row.push(null);
    }
    boardState.push(row);
  }

  // 初期配置
  setDisk(3, 3, "white");
  setDisk(4, 4, "white");
  setDisk(3, 4, "black");
  setDisk(4, 3, "black");
}

function setDisk(x, y, color) {
  const cell = document.querySelector(`.cell[data-x='${x}'][data-y='${y}']`);
  const disk = document.createElement("div");
  disk.className = `disk ${color}`;
  cell.innerHTML = "";
  cell.appendChild(disk);
  boardState[y][x] = color;
}

function handleClick(e) {
  const x = parseInt(e.currentTarget.dataset.x);
  const y = parseInt(e.currentTarget.dataset.y);
  if (!isValidMove(x, y, currentPlayer)) return;

  setDisk(x, y, currentPlayer);
  flipDisks(x, y, currentPlayer);
  currentPlayer = currentPlayer === "black" ? "white" : "black";
  turnDisplay.textContent = `ターン: ${currentPlayer === "black" ? "黒" : "白"}`;
}

function isValidMove(x, y, color) {
  if (boardState[y][x]) return false;
  return getFlippableDisks(x, y, color).length > 0;
}

function flipDisks(x, y, color) {
  const disks = getFlippableDisks(x, y, color);
  for (const [fx, fy] of disks) {
    setDisk(fx, fy, color);
  }
}

function getFlippableDisks(x, y, color) {
  const directions = [
    [0, 1], [1, 0], [0, -1], [-1, 0],
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ];
  const opponent = color === "black" ? "white" : "black";
  const flippable = [];

  for (const [dx, dy] of directions) {
    let nx = x + dx;
    let ny = y + dy;
    const line = [];

    while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && boardState[ny][nx] === opponent) {
      line.push([nx, ny]);
      nx += dx;
      ny += dy;
    }

    if (line.length && nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && boardState[ny][nx] === color) {
      flippable.push(...line);
    }
  }

  return flippable;
}

initBoard();
