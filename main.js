document.addEventListener("DOMContentLoaded", () => {
  const cells = [...document.querySelectorAll(".cell")];
  const puzzle = document.querySelector(".puzzle");
  const shuffleButton = document.getElementById("shuffle-button");
  const winMessage = document.getElementById("win-message");

  const hrElement = document.getElementById("hr");
  const minElement = document.getElementById("min");
  const secElement = document.getElementById("sec");
  const countElement = document.getElementById("count");

  let timer = false;
  let hour = 0;
  let minute = 0;
  let second = 0;
  let count = 0;
  let stopwatchStarted = false;

  const gridSize = 4;

  const isAdjacent = (index1, index2) => {
    const [row1, col1] = [Math.floor(index1 / gridSize), index1 % gridSize];
    const [row2, col2] = [Math.floor(index2 / gridSize), index2 % gridSize];
    return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
  };

  const swapCells = (cell1, cell2) => {
    [cell1.innerHTML, cell2.innerHTML] = [cell2.innerHTML, cell1.innerHTML];
    cell1.classList.toggle("empty");
    cell2.classList.toggle("empty");
  };

  const isSolved = () =>
    cells
      .slice(0, -1)
      .every((cell, i) => cell.innerHTML === (i + 1).toString());

  const shufflePuzzle = () => {
    winMessage.classList.add("hidden");

    // Reset the stopwatch
    timer = false;
    stopwatchStarted = false;
    hour = 0;
    minute = 0;
    second = 0;
    count = 0;

    // Update the stopwatch display
    hrElement.innerHTML = "00";
    minElement.innerHTML = "00";
    secElement.innerHTML = "00";
    countElement.innerHTML = "00";

    // Shuffle the puzzle
    let numbers = [...Array(gridSize * gridSize).keys()];
    do {
      numbers = numbers.sort(() => Math.random() - 0.5);
    } while (!isSolvable(numbers));

    cells.forEach((cell, i) => {
      cell.innerHTML = numbers[i] || "";
      cell.classList.toggle("empty", numbers[i] === 0);
    });
  };

  const isSolvable = (numbers) => {
    let inversions = 0;
    numbers.forEach((num, i) => {
      if (num === 0) return;
      for (let j = i + 1; j < numbers.length; j++) {
        if (numbers[j] && numbers[i] > numbers[j]) inversions++;
      }
    });
    const emptyRow = Math.floor(numbers.indexOf(0) / gridSize);
    return gridSize % 2 === 0
      ? (inversions + emptyRow) % 2 === 0
      : inversions % 2 === 0;
  };

  puzzle.addEventListener("click", (e) => {
    if (!stopwatchStarted) {
      stopwatchStarted = true;
      timer = true;
      stopWatch();
    }

    const cell = e.target;
    if (!cell.classList.contains("empty")) {
      const emptyCell = cells.find((cell) => cell.classList.contains("empty"));
      const cellIndex = cells.indexOf(cell);
      const emptyIndex = cells.indexOf(emptyCell);

      if (isAdjacent(cellIndex, emptyIndex)) {
        swapCells(cell, emptyCell);
        if (isSolved()) {
          winMessage.classList.remove("hidden");
          timer = false;
        }
      }
    }
  });

  shuffleButton.addEventListener("click", shufflePuzzle);

  function stopWatch() {
    if (timer) {
      count++;
      if (count === 100) {
        second++;
        count = 0;
      }
      if (second === 60) {
        minute++;
        second = 0;
      }
      if (minute === 60) {
        hour++;
        minute = 0;
      }

      hrElement.innerHTML = hour < 10 ? "0" + hour : hour;
      minElement.innerHTML = minute < 10 ? "0" + minute : minute;
      secElement.innerHTML = second < 10 ? "0" + second : second;
      countElement.innerHTML = count < 10 ? "0" + count : count;
      setTimeout(stopWatch, 10);
    }
  }
});
