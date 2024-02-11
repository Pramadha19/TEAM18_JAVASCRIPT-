
const gridContent = document.querySelector(".grid-content");
const flagsLeft = document.querySelector("#flagsLeft");
let bombCell = 20;

  function gridGameBoard(rows, cols) {

    flagsLeft.innerHTML = bombCell;

    const bombArray = Array(bombCell).fill("bomb");
    const emptyArray = Array((rows * cols) - bombCell).fill("valid");
    const concatArray = emptyArray.concat(bombArray);
    const randomArray = concatArray.sort(() => Math.random() - 0.5);
    console.log(randomArray);
    
    

    for (let i = 0; i < rows * cols; i++) {
      const gridCell = document.createElement("div");
      gridCell.id = "cell-"+ i;
      gridCell.classList.add(randomArray[i]);
      gridContent.appendChild(gridCell);
    }
  }
  gridGameBoard(10, 10);
