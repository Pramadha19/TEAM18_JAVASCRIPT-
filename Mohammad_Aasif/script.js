
const gridContent = document.querySelector(".grid-content");
const bombCell = 20;

  function gridGameBoard(rows, cols) {
    for (let i = 0; i < rows * cols; i++) {
      const gridCell = document.createElement("div");
      gridCell.id = "cell-"+ i;
      
      gridContent.appendChild(gridCell);
    }
  }
  gridGameBoard(10, 10);
