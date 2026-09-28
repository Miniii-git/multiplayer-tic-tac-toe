//socket.on("bbbbbb", function(){})   socket.emit("bbbbbb")
//socket.on("aaaaaa", function(done){})   socket.emit("aaaaaa" , callbackfunction)
console.log("script.js loaded");

let playerId = localStorage.getItem("playerId");
if (playerId === null) {
  playerId = crypto.randomUUID();
  localStorage.setItem("playerId", playerId);
}
let username = localStorage.getItem("username");
let countryCode = localStorage.getItem("countryCode");
let myPlayer = "";
let opponentUsername = "";
let opponentCountryCode = "";
let socket;
let currentPlayer = "X";
let gameOver = false;

//▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲

const profileSetupScreen = document.getElementById("profileSetupScreen");
const usernameInput = document.getElementById("usernameInput");
const countrySelect = document.getElementById("countrySelect");
const saveProfileButton = document.getElementById("saveProfileButton");

const lobbyScreen = document.querySelector("#lobbyScreen");
const playButton = document.querySelector("#playButton");

const waitingScreen = document.querySelector("#waitingScreen");
const cancelSearch = document.querySelector("#cancelSearch");

const matchFoundScreen = document.querySelector("#matchFoundScreen");
const opponentName = document.querySelector("#opponentName");
const myUsername = document.querySelector("#myUsername");
const mySymbol = document.querySelector("#mySymbol");
const opponentSymbol = document.querySelector("#opponentSymbol");
const countdown = document.querySelector("#countdown");

const gameScreen = document.querySelector("#gameScreen");
const cells = document.querySelectorAll(".cell");
const message = document.querySelector("#message");
const restart = document.querySelector("#restart");
const notification = document.querySelector("#notification");
const leaveGame = document.querySelector("#leaveGame");

//▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲

if (username === null || countryCode === null) {
  profileSetupScreen.style.display = "block";
  lobbyScreen.style.display = "none";
} else {
  profileSetupScreen.style.display = "none";
  lobbyScreen.style.display = "block";
}

//▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲

function setupSocketListeners() {
  socket.on("player", function (player) {
    myPlayer = player;
    myUsername.textContent = countryCodeToFlag(countryCode) + " " + username;
    mySymbol.textContent = myPlayer;

    if (myPlayer === "X") {
      opponentSymbol.textContent = "O";
    } else {
      opponentSymbol.textContent = "X";
    }
    console.log("You are player:", myPlayer);
  });
  //→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→

  socket.on("opponentInfo", function (data) {
    opponentUsername = data.username;
    opponentCountryCode = data.countryCode;

    opponentName.textContent =
      countryCodeToFlag(opponentCountryCode) + " " + opponentUsername;

    console.log("Opponent username:", opponentUsername);
    console.log("Opponent country:", opponentCountryCode);
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
    waitingScreen.style.display = "none";
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

function countryCodeToFlag(countryCode) {
  return countryCode.toUpperCase().replace(/./g, function (character) {
    return String.fromCodePoint(127397 + character.charCodeAt());
  });
}

const countryCodes = [
  "AF",
  "AL",
  "DZ",
  "AD",
  "AO",
  "AG",
  "AR",
  "AM",
  "AU",
  "AT",
  "AZ",
  "BS",
  "BH",
  "BD",
  "BB",
  "BY",
  "BE",
  "BZ",
  "BJ",
  "BT",
  "BO",
  "BA",
  "BW",
  "BR",
  "BN",
  "BG",
  "BF",
  "BI",
  "CV",
  "KH",
  "CM",
  "CA",
  "CF",
  "TD",
  "CL",
  "CN",
  "CO",
  "KM",
  "CG",
  "CD",
  "CR",
  "CI",
  "HR",
  "CU",
  "CY",
  "CZ",
  "DK",
  "DJ",
  "DM",
  "DO",
  "EC",
  "EG",
  "SV",
  "GQ",
  "ER",
  "EE",
  "SZ",
  "ET",
  "FJ",
  "FI",
  "FR",
  "GA",
  "GM",
  "GE",
  "DE",
  "GH",
  "GR",
  "GD",
  "GT",
  "GN",
  "GW",
  "GY",
  "HT",
  "HN",
  "HU",
  "IS",
  "IN",
  "ID",
  "IR",
  "IQ",
  "IE",
  "IL",
  "IT",
  "JM",
  "JP",
  "JO",
  "KZ",
  "KE",
  "KI",
  "KP",
  "KR",
  "KW",
  "KG",
  "LA",
  "LV",
  "LB",
  "LS",
  "LR",
  "LY",
  "LI",
  "LT",
  "LU",
  "MG",
  "MW",
  "MY",
  "MV",
  "ML",
  "MT",
  "MH",
  "MR",
  "MU",
  "MX",
  "FM",
  "MD",
  "MC",
  "MN",
  "ME",
  "MA",
  "MZ",
  "MM",
  "NA",
  "NR",
  "NP",
  "NL",
  "NZ",
  "NI",
  "NE",
  "NG",
  "MK",
  "NO",
  "OM",
  "PK",
  "PW",
  "PS",
  "PA",
  "PG",
  "PY",
  "PE",
  "PH",
  "PL",
  "PT",
  "QA",
  "RO",
  "RU",
  "RW",
  "KN",
  "LC",
  "VC",
  "WS",
  "SM",
  "ST",
  "SA",
  "SN",
  "RS",
  "SC",
  "SL",
  "SG",
  "SK",
  "SI",
  "SB",
  "SO",
  "ZA",
  "SS",
  "ES",
  "LK",
  "SD",
  "SR",
  "SE",
  "CH",
  "SY",
  "TW",
  "TJ",
  "TZ",
  "TH",
  "TL",
  "TG",
  "TO",
  "TT",
  "TN",
  "TR",
  "TM",
  "TV",
  "UG",
  "UA",
  "AE",
  "GB",
  "US",
  "UY",
  "UZ",
  "VU",
  "VA",
  "VE",
  "VN",
  "YE",
  "ZM",
  "ZW",
];

const regionNames = new Intl.DisplayNames(["en"], {
  type: "region",
});

countryCodes.forEach(function (countryCode) {
  const option = document.createElement("option");

  const countryName = regionNames.of(countryCode);
  const flag = countryCodeToFlag(countryCode);

  option.value = countryCode;
  option.textContent = flag + " " + countryName;

  countrySelect.appendChild(option);
});

//▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼

saveProfileButton.addEventListener("click", function () {
  const enteredUsername = usernameInput.value.trim();
  const selectedCountryCode = countrySelect.value;

  if (enteredUsername === "" || selectedCountryCode === "") {
    return;
  }

  username = enteredUsername;
  countryCode = selectedCountryCode;

  localStorage.setItem("username", username);
  localStorage.setItem("countryCode", countryCode);

  profileSetupScreen.style.display = "none";
  lobbyScreen.style.display = "block";
});

//••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

playButton.addEventListener("click", function () {
  console.log("Play clicked");
  socket = io({
    auth: {
      playerId: playerId,
      username: username,
      countryCode: countryCode,
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
