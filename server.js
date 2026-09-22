const express = require("express");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
/*we create an application from Express*/
app.use(express.static(__dirname));
/*"use" our entire proj file  --> now app has access to all html css and js */

const myServer = http.createServer(app);
/*Here we create a real HTTP server and give the app to it.*/

const io = new Server(myServer);
/* create a Socket.IO server and connect it to my HTTP server  */

//▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲
//سوکت ایدی با ریکانکت عوض می‌شود، ولی  و پلیر آیدی قرار است هویت اصلی بازیکن را نگه دارند.

let playerX = null; // socket.id بازیکن X
let playerO = null; // socket.id بازیکن O
let playerXId = null;
let playerOId = null;

let waitingPlayer = null;
let roomCounter = 1;
let rooms = {};

let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;
let gameResult = null;

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

//▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲
function checkWinnerServer(board) {
  for (let combination of winningCombinations) {
    const a = combination[0];
    const b = combination[1];
    const c = combination[2];

    if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function checkDrawServer(board) {
  return board.every(function (cell) {
    return cell !== "";
  });
}
//▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲
// وقتی سرور کانکت میشه دستور هایی که اجرا میشن روی سرور انواع سوکت ها

io.on("connection", function (socket) {
  const playerId = socket.handshake.auth.playerId;

  let reconnectRoomId = null;
  let reconnectPlayer = "";

  for (let roomId in rooms) {
    const game = rooms[roomId];

    if (game.playerXId === playerId) {
      reconnectRoomId = roomId;
      reconnectPlayer = "X";
    }

    if (game.playerOId === playerId) {
      reconnectRoomId = roomId;
      reconnectPlayer = "O";
    }
  }

  if (reconnectRoomId !== null) {
    const game = rooms[reconnectRoomId];
    socket.join(reconnectRoomId);
    socket.roomId = reconnectRoomId;
    if (reconnectPlayer === "X") game.playerX = socket.id;
    if (reconnectPlayer === "O") game.playerO = socket.id;
    socket.emit("player", reconnectPlayer);
    socket.emit("syncBoard", game.board);
    socket.emit("changeTurn", game.currentPlayer);
    if (game.gameOver) {
      if (game.gameResult === "draw") {
        socket.emit("gameDraw");
      } else {
        socket.emit("gameWinner", game.gameResult);
      }
    }
    socket.to(reconnectRoomId).emit("playerConnected");
  }

  if (reconnectRoomId === null && waitingPlayer === null) {
    waitingPlayer = {
      socketId: socket.id,
      playerId: playerId,
    };
    console.log("Player is waiting:", waitingPlayer);
  } else if (reconnectRoomId === null) {
    const roomId = "room-" + roomCounter;
    roomCounter++;
    const firstSocket = io.sockets.sockets.get(waitingPlayer.socketId);
    firstSocket.join(roomId);
    socket.join(roomId);
    firstSocket.roomId = roomId;
    socket.roomId = roomId;
    console.log("First player room:", firstSocket.roomId);
    console.log("Second player room:", socket.roomId);

    rooms[roomId] = {
      playerX: waitingPlayer.socketId,
      playerO: socket.id,

      playerXId: waitingPlayer.playerId,
      playerOId: playerId,

      board: ["", "", "", "", "", "", "", "", ""],
      currentPlayer: "X",
      gameOver: false,
      gameResult: null,
    };

    firstSocket.emit("player", "X");
    socket.emit("player", "O");
    console.log("Opponent found!");

    io.to(roomId).emit("matchFound");

    setTimeout(function () {
      io.to(roomId).emit("startGame");
    }, 4500);

    waitingPlayer = null;

    io.to(roomId).emit("changeTurn", rooms[roomId].currentPlayer);
    io.to(roomId).emit("syncBoard", rooms[roomId].board);

    console.log("Created room:", roomId);
    console.log("Rooms:", rooms);
  }
  /*
  if (playerId === playerXId) {
    playerX = socket.id;
    socket.emit("player", "X");
    socket.broadcast.emit("playerConnected");
  } else if (playerId === playerOId) {
    playerO = socket.id;
    socket.emit("player", "O");
    socket.broadcast.emit("playerConnected");
  } else if (playerX === null) {
    playerX = socket.id;
    playerXId = playerId;
    socket.emit("player", "X");
  } else if (playerO === null) {
    playerO = socket.id;
    playerOId = playerId;
    socket.emit("player", "O");
  } else {
    socket.emit("gameFull"); // اینجا ترتیب مهم است: اول میگیم بازی پر است و بعد سرور را از ان قطع میکنیم.
    socket.disconnect();
    return;
  }
*/
  //→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→

  //socket.emit("changeTurn", currentPlayer);

  //→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→

  //socket.emit("syncBoard", board);

  //→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→

  /*if (gameOver) {
    if (gameResult === "draw") {
      socket.emit("gameDraw");
    } else {
      socket.emit("gameWinner", gameResult);
    }
  }*/
  //→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→

  socket.on("disconnect", function () {
    const roomId = socket.roomId;
    const game = rooms[roomId];
    if (!roomId) {
      if (waitingPlayer && waitingPlayer.socketId === socket.id) {
        waitingPlayer = null;
      }
      return;
    }
    if (!game) {
      return;
    }

    let disconnectedPlayer = "";
    if (socket.id === game.playerX) disconnectedPlayer = "X";
    if (socket.id === game.playerO) disconnectedPlayer = "O";
    console.log("Disconnected player:", disconnectedPlayer);

    if (disconnectedPlayer === "X") game.playerX = null;
    if (disconnectedPlayer === "O") game.playerO = null;
    console.log("Room after disconnect:", game);

    if (game.playerX === null && game.playerO === null) {
      console.log("Both players disconnected. Waiting 5 seconds:", roomId);
      setTimeout(function () {
        const currentGame = rooms[roomId];
        if (
          currentGame &&
          currentGame.playerX === null &&
          currentGame.playerO === null
        ) {
          delete rooms[roomId];
          console.log("Room deleted:", roomId);
        }
      }, 5000);
    }

    socket.to(roomId).emit("playerDisconnected");
    console.log("Player disconnected:", socket.id);
  });

  //→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→

  socket.on("move", function (data) {
    const roomId = socket.roomId;
    const game = rooms[roomId];

    if (!game) {
      return;
    }
    if (game.gameOver) {
      return;
    }
    if (!Number.isInteger(data.index) || data.index < 0 || data.index > 8) {
      return;
    }

    let player = "";
    if (socket.id === game.playerX) player = "X";
    if (socket.id === game.playerO) player = "O";

    if (player !== game.currentPlayer) {
      return; // کاربر در حالت عادی اصلاً نتواند خارج از نوبتش کلیک مؤثر انجام دهد.این هم قبلا در مروگر جلوگیری شده بود اما اکنون در سرور هم محافظت میشود
    }
    if (game.board[data.index] !== "") {
      return; //سرور برای اعتبار نهایی ( قبلا مرورگر هم انرا چک کرده ) اما حتی اگر به هر دلیلی ایونت اشتباه رسید، حرکت نامعتبر را رد میکند ( یک لایه محافظ دوم است.) .
    }
    game.board[data.index] = player;
    console.log("Move received:", data);

    io.to(roomId).emit("updateBoard", {
      index: data.index,
      player: player,
    });

    const winner = checkWinnerServer(game.board);
    if (winner !== null) {
      game.gameOver = true;
      game.gameResult = winner;
      io.to(roomId).emit("gameWinner", winner);
      return;
    }

    const isDraw = checkDrawServer(game.board);
    if (isDraw) {
      game.gameOver = true;
      game.gameResult = "draw";
      io.to(roomId).emit("gameDraw");
      return;
    }

    const nextPlayer = player === "X" ? "O" : "X";
    game.currentPlayer = nextPlayer;
    io.to(roomId).emit("changeTurn", nextPlayer);
  });
  //→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→

  socket.on("restartGame", function () {
    const roomId = socket.roomId;
    const game = rooms[roomId];
    if (!game) {
      return;
    }
    game.board = ["", "", "", "", "", "", "", "", ""];
    game.currentPlayer = "X";
    game.gameOver = false;
    game.gameResult = null;
    io.to(roomId).emit("resetBoard");
  });
  //→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→

  socket.on("leaveGame", function (done) {
    console.log("Leave game requested by:", socket.id);
    const roomId = socket.roomId;
    const game = rooms[roomId];
    if (!game) {
      done();
      return;
    }

    let leavingPlayer = "";
    if (socket.id === game.playerX) leavingPlayer = "X";
    if (socket.id === game.playerO) leavingPlayer = "O";

    let remainingOpponentSocketId = "";
    if (leavingPlayer === "X") {
      remainingOpponentSocketId = game.playerO;
    }
    if (leavingPlayer === "O") {
      remainingOpponentSocketId = game.playerX;
    }
    const remainingOpponentSocket = io.sockets.sockets.get(
      remainingOpponentSocketId,
    );

    if (leavingPlayer === "X") {
      game.playerX = null;
      game.playerXId = null;
    }
    if (leavingPlayer === "O") {
      game.playerO = null;
      game.playerOId = null;
    }

    socket.leave(roomId); // mokhalef---> socket.join(roomId);
    socket.roomId = null;
    io.to(roomId).emit("opponentLeft");

    if (remainingOpponentSocket) {
      remainingOpponentSocket.leave(roomId);
      remainingOpponentSocket.roomId = null;
    }

    console.log("Deleting room:", roomId);
    delete rooms[roomId];
    console.log("Rooms after leave:", rooms);

    done(); // `done` is a callback that the client sends to the server. The server, by executing done() In effect, it says: "I have finished exiting the game; you can disconnect now."
  });
  //→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→

  socket.on("cancelSearch", function (done) {
    console.log("Cancel search requested by:", socket.id);
    if (waitingPlayer && waitingPlayer.socketId === socket.id) {
      waitingPlayer = null;
      console.log("waitingPlayer", waitingPlayer);
      done();
    }
  });
});

//▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲

const PORT = process.env.PORT || 3000;

myServer.listen(PORT, function () {
  console.log("Server is running on port " + PORT);
});
