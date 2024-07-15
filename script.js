// Gameboard module
const gameBoard = (function () {
  const size = 3 * 3;
  const board = new Array(size).fill("-");
  const WinningCombos = {
    winCombo1: ["+", "+", "+", "-", "-", "-", "-", "-", "-"],
    winCombo2: ["-", "-", "-", "+", "+", "+", "-", "-", "-"],
    winCombo3: ["-", "-", "-", "-", "-", "-", "+", "+", "+"],
    winCombo4: ["+", "-", "-", "+", "-", "-", "+", "-", "-"],
    winCombo5: ["-", "+", "-", "-", "+", "-", "-", "+", "-"],
    winCombo6: ["-", "-", "+", "-", "-", "+", "-", "-", "+"],
    winCombo7: ["+", "-", "-", "-", "+", "-", "-", "-", "+"],
    winCombo8: ["-", "-", "+", "-", "+", "-", "+", "-", "-"],
  };

  const getBoard = () => board;

  const printBoard = () => {
    console.log(board.slice(0, 3));
    console.log(board.slice(3, 6));
    console.log(board.slice(6, 9));
  };

  const play = (mark, spot) => {
    if (board[spot] === "-") {
      board[spot] = mark;
    } else {
      console.log("Square already has a mark there");
    }
  };

  const checkWinner = (mark) => {
    let t = board.map((curr, i) => {
      return curr === mark ? "+" : "-";
    });
    console.log(t);
    for (const pair of Object.entries(WinningCombos)) {
      if (pair[1].toString() === t.toString()) {
        console.log(`Winner is ${mark}!!`);
        return true;
      }
    }
  };

  return {
    getBoard,
    printBoard,
    play,
    checkWinner,
  };
})();

gameBoard.printBoard();

gameBoard.play("X", 0);
gameBoard.play("O", 3);
gameBoard.play("X", 4);
gameBoard.play("O", 6);
gameBoard.play("X", 8);

gameBoard.printBoard();
gameBoard.checkWinner("X");
