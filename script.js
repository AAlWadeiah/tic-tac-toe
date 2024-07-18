// Constants
const BOARD_SIZE = 3 * 3;

// DOM elements at the top to make sure they are initialized before being used in code
const ticTacToeBoard = document.querySelector(".game-board");
const gameForm = document.querySelector("#start-game-form");

// Gameboard module
const GameBoard = (function () {
  let board = new Array(BOARD_SIZE).fill("-");

  const getBoard = () => board;

  const printBoard = () => {
    console.log(board.slice(0, 3).join(" "));
    console.log(board.slice(3, 6).join(" "));
    console.log(board.slice(6, 9).join(" "));
  };

  const clearBoard = () => {
    board = new Array(BOARD_SIZE).fill("-");
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
    // loop through winning combos
    // check if the player's mark is at the same index as the '+'
    // if all three '+' match with the marks, then return true
    let mark = player.getMark();
    let t = board.getBoard().map((curr, i) => {
      return curr === mark ? "+" : "-";
    });

    for (const pair of Object.entries(WinningCombos)) {
      let winMarkCounter = 0;
      let combo = pair[1];
      for (let i = 0; i < combo.length; i++) {
        if (t[i] === "+" && t[i] === combo[i]) winMarkCounter++;
        if (winMarkCounter == 3) return true;
      }
    }
    return false;
  };

  const checkTie = () => {
    if (board.getBoard().some((cells) => cells === "-")) {
      return false;
    }
    return true;
  };

  const gameOver = (player = null) => {
    if (player) {
      activePlayer.increaseScore();
      DisplayController.drawGameOver(
        `${activePlayer.getName()} Won!!`,
        `They have a score of ${activePlayer.getScore()}`
      );

      DisplayController.drawScore(
        players[0].getName(),
        players[0].getScore(),
        players[1].getName(),
        players[1].getScore()
      );
    } else {
      DisplayController.drawGameOver("It's a tie ...", "No one scores :(");
    }
  };

  const printNewRound = (isGameOver = false) => {
    if (isGameOver) {
      board.clearBoard();
    }
    DisplayController.drawBoard(GameBoard.getBoard());
    DisplayController.drawTurn(activePlayer.getName());
    DisplayController.drawScore(
      players[0].getName(),
      players[0].getScore(),
      players[1].getName(),
      players[1].getScore()
    );
  };

  const playRound = (spot) => {
    let mark = activePlayer.getMark();
    if (board.getBoard()[spot] === "-") {
      board.addMark(spot, mark);

      if (checkWinner(activePlayer)) {
        gameOver(activePlayer);
      } else if (checkTie()) {
        gameOver();
      }

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

const DisplayController = (function (visualBoard) {
  const playerOneScoreCard = document.querySelector(".player1-score");
  const playerTwoScoreCard = document.querySelector(".player2-score");
  const turnCard = document.querySelector(".turn-card");
  const gameOverModal = document.querySelector("#game-over-modal");
  const continueBtn = document.querySelector("#continue-btn");

  const drawBoard = (boardArr) => {
    // generate cells and populate them based on values in GameBoard.getBoard()
    visualBoard.innerHTML = "";

    for (let i = 0; i < BOARD_SIZE; i++) {
      let newCell = document.createElement("div");
      newCell.classList.toggle("cell");
      newCell.dataset.index = i;
      if (i == 1 || i == 4 || i == 7) newCell.classList.toggle("mid-col");
      if (i == 3 || i == 4 || i == 5) newCell.classList.toggle("mid-row");

      let cellVal = boardArr[i];
      if (cellVal === "X") newCell.innerText = "X";
      else if (cellVal === "O") newCell.innerText = "O";

      visualBoard.appendChild(newCell);
    }
  };

  const drawScore = (
    playerOneName,
    playerOneScore,
    playerTwoName,
    playerTwoScore
  ) => {
    // update score card
    playerOneScoreCard.innerText = `${playerOneName}: ${playerOneScore}`;
    playerTwoScoreCard.innerText = `${playerTwoName}: ${playerTwoScore}`;
  };

  const drawTurn = (activePlayerName) => {
    turnCard.innerText = `${activePlayerName}'s turn`;
  };

  function openModal(modal) {
    if (modal == null) return;
    modal.classList.add("active");
    overlay.classList.add("active");
  }

  function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove("active");
    overlay.classList.remove("active");
  }

  const drawGameOver = (title, scoreMsg) => {
    const modalTitle = document.querySelector(
      "#game-over-modal > .modal-header > .title"
    );
    modalTitle.innerText = title;
    const modalScoreMsg = document.querySelector(
      "#game-over-modal > .modal-body > .score"
    );
    modalScoreMsg.innerText = scoreMsg;

    openModal(gameOverModal);

    continueBtn.addEventListener("click", (e) => {
      closeModal(gameOverModal);
      GameBoard.clearBoard();
      drawBoard(GameBoard.getBoard());
    });
  };

  return {
    drawBoard,
    drawTurn,
    drawScore,
    drawGameOver,
  };
})(ticTacToeBoard);

gameForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const p1Name = document.querySelector("#p1-name");
  const p2Name = document.querySelector("#p2-name");

  const game = GameController(p1Name.value, p2Name.value);

  const init = document.querySelector("#game-init");
  init.style.display = "none";

  const gameWidgets = document.querySelector("#game-widgets");
  gameWidgets.style.display = "block";

  ticTacToeBoard.addEventListener("click", (e) => {
    game.playRound(e.target.dataset.index);
  });
});
