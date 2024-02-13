
const gridContent = document.querySelector(".grid-content");
const flagsLeft = document.querySelector("#flagsLeft");
const result = document.querySelector("#result");
let bombCell = 20;
let gridCells = [];
let isGameOver = false;
const rows = 10;
let flags = 0;

function gridGameBoard() {
  flagsLeft.textContent = bombCell;

  const bombArray = Array(bombCell).fill("bomb");
  const emptyArray = Array((rows * rows) - bombCell).fill("valid");
  const concatArray = emptyArray.concat(bombArray);
  const randomArray = concatArray.sort(() => Math.random() - 0.5);

  for (let i = 0; i < rows * rows; i++) {
    const gridCell = document.createElement("div");
    gridCell.id = "cell-" + i;
    gridCell.classList.add(randomArray[i]);
    gridContent.appendChild(gridCell);
    gridCells.push(gridCell);

    gridCell.addEventListener('click', () => click(gridCell));
    gridCell.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      addFlag(gridCell);
    });
  }

  for (let i = 0; i < gridCells.length; i++) {
    let count = 0;
    const isLeftEdge = (i % rows === 0);
    const isRightEdge = (i % rows === rows - 1);

    if (gridCells[i].classList.contains('valid')) {
      if (i > 0 && !isLeftEdge && gridCells[i - 1].classList.contains("bomb")) count++;
      if (i > 9 && !isRightEdge && gridCells[i + 1 - rows].classList.contains("bomb")) count++;
      if (i > 10 && gridCells[i - rows].classList.contains("bomb")) count++;
      if (i > 11 && !isLeftEdge && gridCells[i - rows - 1].classList.contains("bomb")) count++;
      if (i < 99 && !isRightEdge && gridCells[i + 1].classList.contains("bomb")) count++;
      if (i < 90 && !isLeftEdge && gridCells[i - 1 + rows].classList.contains("bomb")) count++;
      if (i < 88 && !isRightEdge && gridCells[i + 1 + rows].classList.contains("bomb")) count++;
      if (i < 89 && gridCells[i + rows].classList.contains("bomb")) count++;
      gridCells[i].setAttribute('data-count', count);
    }
  }
}
gridGameBoard();

function addFlag(gridCell) {
  if (isGameOver) return;
  if (!gridCell.classList.contains('checked') && (flags < bombCell)) {
    if (!gridCell.classList.contains('flag')) {
      gridCell.classList.add('flag');
      flags++;
      gridCell.innerHTML = '🚩';
      flagsLeft.textContent = bombCell - flags;
      checkForWin();
    } else {
      gridCell.classList.remove("flag");
      flags--;
      gridCell.innerHTML = '';
      flagsLeft.textContent = bombCell - flags;
      checkForWin();
    }
  }
}

function click(gridCell) {
  if (isGameOver || gridCell.classList.contains("checked") || gridCell.classList.contains("flag")) return;

  if (gridCell.classList.contains("bomb")) {
    gameOver();
  } else {
    let count = gridCell.getAttribute("data-count");
    if (count != 0) {
      if (count === '1') gridCell.classList.add("one");
      if (count === '2') gridCell.classList.add("two");
      if (count === '3') gridCell.classList.add("three");
      if (count === '4') gridCell.classList.add("four");
      gridCell.textContent = count;
      return;
    }
    checkEmptyCell(gridCell);
  }
  gridCell.classList.add("checked");
}

function checkEmptyCell(gridCell) {
  let currentId = parseInt(gridCell.id.split('-')[1]);
  const isLeftEdge = (currentId % rows === 0);
  const isRightEdge = (currentId % rows === rows - 1);

  setTimeout(function () {
    const adjacentCells = [];

    if (!isLeftEdge) adjacentCells.push(currentId - 1);
    if (!isRightEdge) adjacentCells.push(currentId + 1);
    if (currentId > rows - 1) adjacentCells.push(currentId - rows);
    if (currentId < rows * (rows - 1)) adjacentCells.push(currentId + rows);
    if (!isLeftEdge && currentId > rows - 1) adjacentCells.push(currentId - 1 - rows);
    if (!isLeftEdge && currentId < rows * (rows - 1)) adjacentCells.push(currentId - 1 + rows);
    if (!isRightEdge && currentId > rows - 1) adjacentCells.push(currentId + 1 - rows);
    if (!isRightEdge && currentId < rows * (rows - 1)) adjacentCells.push(currentId + 1 + rows);

    adjacentCells.forEach(newId => {
      const newCell = document.getElementById(`cell-${newId}`);
      if (newCell && !newCell.classList.contains('checked') && !newCell.classList.contains('flag')) {
        click(newCell);
      }
    });
  }, 10);
}

function checkForWin() {
  let matches = 0;
  for (let i = 0; i < gridCells.length; i++) {
    if (gridCells[i].classList.contains("flag") && gridCells[i].classList.contains("bomb")) {
      matches++;
    }
    if (matches === bombCell) {
      result.textContent = "You Win!!";
      isGameOver = true;
    }
  }
}

function gameOver() {
  result.textContent = "Boom! Game Over";
  isGameOver = true;

  gridCells.forEach(function (gridCell) {
    if (gridCell.classList.contains("bomb")) {
      gridCell.textContent = "💣";
      gridCell.classList.remove("bomb");
      gridCell.classList.add("checked");
    }
  });
}
