//socket.on("bbbbbb", function(){})   socket.emit("bbbbbb")
//socket.on("aaaaaa", function(done){})   socket.emit("aaaaaa" , callbackfunction)

console.log("script.js loaded");

let playerId = localStorage.getItem("playerId");
if (playerId === null) {
  playerId = crypto.randomUUID();
  localStorage.setItem("playerId", playerId);
}

let myPlayer = "";

// const socket = io({
//   auth: {
//     playerId: playerId,
//   },
// });
let socket;

const lobbyScreen = document.querySelector("#lobbyScreen");
const playButton = document.querySelector("#playButton");

const waitingScreen = document.querySelector("#waitingScreen");
const cancelSearch = document.querySelector("#cancelSearch");

const matchFoundScreen = document.querySelector("#matchFoundScreen");
const countdown = document.querySelector("#countdown");

const gameScreen = document.querySelector("#gameScreen");
const cells = document.querySelectorAll(".cell");
const message = document.querySelector("#message");
const restart = document.querySelector("#restart");
const notification = document.querySelector("#notification");
const leaveGame = document.querySelector("#leaveGame");

let currentPlayer = "X";
let gameOver = false;

//▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲

function setupSocketListeners() {
  socket.on("player", function (player) {
    myPlayer = player;
    console.log("You are player:", myPlayer);
  });
  //→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→

  socket.on("updateBoard", function (data) {
    console.log("Board update:", data);
    cells[data.index].textContent = data.player;
    checkWinner();
  });
  //→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→

  socket.on("changeTurn", function (nextPlayer) {
    if (gameOver) {
      return;
    }
    currentPlayer = nextPlayer;
    message.textContent = "Player " + currentPlayer + "'s turn";
  });
  //→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→

  socket.on("resetBoard", function () {
    cells.forEach(function (cell) {
      cell.textContent = "";
    });
    currentPlayer = "X";
    gameOver = false;
    message.textContent = "Player X's turn";
  });
  //→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→

  socket.on("syncBoard", function (board) {
    cells.forEach(function (cell, index) {
      cell.textContent = board[index];
    });
  });
  //→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→

  socket.on("gameFull", function () {
    message.textContent = "Game is full";
  });
  //→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→

  socket.on("gameWinner", function (winner) {
    gameOver = true;
    message.textContent = "Player " + winner + " wins!";
  });
  //→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→

  socket.on("gameDraw", function () {
    gameOver = true;
    message.textContent = "It's a draw!";
  });
  //→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→

  socket.on("playerDisconnected", function () {
    notification.textContent = "Other player disconnected";
  });
  //→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→

  socket.on("playerConnected", function () {
    notification.textContent = "";
  });
  //→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→

  socket.on("opponentLeft", function () {
    notification.textContent = "Opponent left the game";
    gameOver = true;
  });
  //→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→

  socket.on("matchFound", function () {
    gameOver = false;
    notification.textContent = "";

    waitingScreen.style.display = "none";
    matchFoundScreen.style.display = "block";

    let timeLeft = 3;

    countdown.textContent = timeLeft;

    const countdownInterval = setInterval(function () {
      timeLeft--;
      if (timeLeft === 0) {
        clearInterval(countdownInterval);
        return;
      }
      countdown.textContent = timeLeft;
    }, 1500);
  });
  //→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→

  socket.on("startGame", function () {
    matchFoundScreen.style.display = "none";
    gameScreen.style.display = "block";
  });
}
//▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼

cells.forEach(function (cell) {
  cell.addEventListener("click", function () {
    // Don't allow clicking an occupied cell
    if (cell.textContent !== "" || gameOver) {
      return;
    }

    if (myPlayer !== currentPlayer) {
      return;
    }

    const index = Array.from(cells).indexOf(cell);

    socket.emit("move", {
      index: index,
    });
  });
});

//▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let combination of winningCombinations) {
    const a = combination[0];
    const b = combination[1];
    const c = combination[2];

    if (
      cells[a].textContent !== "" &&
      cells[a].textContent === cells[b].textContent &&
      cells[a].textContent === cells[c].textContent
    ) {
      message.textContent = "Player " + currentPlayer + " wins!";
      gameOver = true;
      return;
    }
  }

  // Check for a draw
  let isDraw = true;

  cells.forEach(function (cell) {
    if (cell.textContent === "") {
      isDraw = false;
    }
  });

  if (isDraw) {
    message.textContent = "It's a draw!";
    gameOver = true;
  }
}

//▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼

playButton.addEventListener("click", function () {
  console.log("Play clicked");
  socket = io({
    auth: {
      playerId: playerId,
    },
  });
  setupSocketListeners();
  lobbyScreen.style.display = "none";
  waitingScreen.style.display = "block";
});

//••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

restart.addEventListener("click", function () {
  socket.emit("restartGame");
});
//••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

leaveGame.addEventListener("click", function () {
  //hamrah emit yek tabe callback ham mifrestim ---> hamun done() mishe yani
  socket.emit("leaveGame", function () {
    socket.disconnect();
    socket = undefined;
    gameScreen.style.display = "none";
    lobbyScreen.style.display = "block";
  });
});

//••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

cancelSearch.addEventListener("click", function () {
  socket.emit("cancelSearch", function () {
    socket.disconnect();
    socket = undefined;

    waitingScreen.style.display = "none";
    lobbyScreen.style.display = "block";
  });
});
