document.addEventListener("DOMContentLoaded", () => {
  const cells = [...document.querySelectorAll(".cell")];
  const puzzle = document.querySelector(".puzzle");
  const shuffleButton = document.getElementById("shuffle-button");
  const winMessage = document.getElementById("win-message");

  const isAdjacent = (index1, index2) => {
    const [row1, col1] = [Math.floor(index1 / 4), index1 % 4];
    const [row2, col2] = [Math.floor(index2 / 4), index2 % 4];

    return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
  };

  const swapCells = (cell1, cell2) => {
    [cell1.innerHTML, cell2.innerHTML] = [cell2.innerHTML, cell1.innerHTML];
    cell1.classList.toggle("empty");
    cell2.classList.toggle("empty");
  };

  const getAdjancentIndices = (index) => {
    const [row, col] = [Math.floor(index / 4), index % 4];
    return [
      row > 0 ? index - 4 : null,
      row < 2 ? index + 4 : null,
      row > 0 ? index - 1 : null,
      row < 2 ? index + 1 : null,
    ].filter((n) => n !== null);
  };

  const isSolved = () =>
    cells
      .slice(0, -1)
      .every((cell, i) => cell.innerHTML === (i + 1).toString());

  timer = false;

  const shufflePuzzle = () => {
    winMessage.classList.add("hidden");

    timer = false;
    hour = 0;
    minute = 0;
    second = 0;
    count = 0;
    document.getElementById("hr").innerHTML = "00";
    document.getElementById("min").innerHTML = "00";
    document.getElementById("sec").innerHTML = "00";
    document.getElementById("count").innerHTML = "00";

    for (let i = 0; i < 100; i++) {
      const emptyCell = cells.find((cell) => cell.classList.contains("empty"));
      const emptyIndex = cells.indexOf(emptyCell);
      const neighbors = getAdjancentIndices(emptyIndex);
      const randomNeighbor =
        neighbors[Math.floor(Math.random() * neighbors.length)];
      swapCells(cells[randomNeighbor], emptyCell);
    }
  };

  puzzle.addEventListener("click", (e) => {
    timer = true;
    stopWatch();

    const cell = e.target;
    if (!cell.classList.contains("empty")) {
      const emptyCell = cells.find((cell) => cell.classList.contains("empty"));
      const cellIndex = cells.indexOf(cell);
      const emptyIndex = cells.indexOf(emptyCell);

      if (isAdjacent(cellIndex, emptyIndex)) {
        swapCells(cell, emptyCell);
        if (isSolved()) winMessage.classList.remove("hidden");
      }
    }
  });
  shuffleButton.addEventListener("click", shufflePuzzle);
});

function stopWatch() {
  if (timer) {
    count++;

    if (count == 100) {
      second++;
      count = 0;
    }

    if (second == 60) {
      minute++;
      second = 0;
    }

    if (minute == 60) {
      hour++;
      minute = 0;
      second = 0;
    }

    let hrString = hour;
    let minString = minute;
    let secString = second;
    let countString = count;

    if (hour < 10) {
      hrString = "0" + hrString;
    }

    if (minute < 10) {
      minString = "0" + minString;
    }

    if (second < 10) {
      secString = "0" + secString;
    }

    if (count < 10) {
      countString = "0" + countString;
    }

    document.getElementById("hr").innerHTML = hrString;
    document.getElementById("min").innerHTML = minString;
    document.getElementById("sec").innerHTML = secString;
    document.getElementById("count").innerHTML = countString;
    setTimeout(stopWatch, 10);
  }
}
