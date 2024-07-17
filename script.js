// Gameboard module
const GameBoard = (function () {
  const size = 3 * 3;
  let board = new Array(size).fill("-");

  const getBoard = () => board;

  const printBoard = () => {
    console.log(board.slice(0, 3).join(" "));
    console.log(board.slice(3, 6).join(" "));
    console.log(board.slice(6, 9).join(" "));
  };

  const clearBoard = () => {
    board = new Array(size).fill("-");
    return board;
  };

  const addMark = (spot, mark) => (board[spot] = mark);

  return {
    getBoard,
    printBoard,
    clearBoard,
    addMark,
  };
})();

// Player factory function
function createPlayer(name, mark) {
  let score = 0; // Track how many rounds player has won as a score
  this.name = name;
  this.mark = mark;
  const getName = () => name;
  const getMark = () => mark;
  const getScore = () => score;
  const increaseScore = () => score++;

  return { getName, getMark, getScore, increaseScore };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
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

  const board = GameBoard;
  let player1 = createPlayer(playerOneName, "X");
  let player2 = createPlayer(playerTwoName, "O");
  let players = [player1, player2];

  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

  const switchActivePlayer = () =>
    (activePlayer = activePlayer === players[0] ? players[1] : players[0]);

  const checkWinner = (player) => {
    let mark = player.getMark();
    let t = board.getBoard().map((curr, i) => {
      return curr === mark ? "+" : "-";
    });
    for (const pair of Object.entries(WinningCombos)) {
      if (pair[1].toString() === t.toString()) {
        return true;
      }
    }
    return false;
  };

  const gameOver = () => {
    activePlayer.increaseScore();
    console.log(
      `Winner is ${activePlayer.getName()} with a score of ${activePlayer.getScore()}!! `
    );
    board.clearBoard();
  };

  const printNewRound = () => {
    board.printBoard();
    console.log(`${activePlayer.getName()}'s turn`);
  };

  const playRound = (spot) => {
    let mark = activePlayer.getMark();
    if (board.getBoard()[spot] === "-") {
      board.addMark(spot, mark);

      let won = checkWinner(activePlayer);

      if (won) gameOver();

      switchActivePlayer();
      printNewRound();
    } else {
      console.log("Square already has a mark there");
    }
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
  };
}

const game = GameController("Bob", "Joe");

game.playRound(0);
game.playRound(3);
game.playRound(3);
game.playRound(4);
game.playRound(6);
game.playRound(8);
