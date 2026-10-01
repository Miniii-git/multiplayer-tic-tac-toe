//جموعه ابزارهایی که یک سرویس در اختیار برنامه‌نویس می‌گذارد تا بتواند از آن سرویس داخل برنامه‌اش استفاده کند  = SDK Software Development Kit

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBWJht0noHEfdmAY1lC-nZ03hXYYzKe20s",
  authDomain: "multiplayer-tic-tac-toe-2fb02.firebaseapp.com",
  projectId: "multiplayer-tic-tac-toe-2fb02",
  storageBucket: "multiplayer-tic-tac-toe-2fb02.firebasestorage.app",
  messagingSenderId: "811345451279",
  appId: "1:811345451279:web:5438de71766dd04fb9c67a",
};

const firebaseApp = initializeApp(firebaseConfig); // فایربیس را با تنظیمات پروژه‌ی من راه‌اندازی کن

const auth = getAuth(firebaseApp); // را بده FirebaseApp مربوط به همین Authentication سیستم
const db = getFirestore(firebaseApp); // را بده FirebaseApp مربوط به همین Firestore دیتا بیس

const googleProvider = new GoogleAuthProvider();

//▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲

//socket.on("bbbbbb", function(){})   socket.emit("bbbbbb")
//socket.on("aaaaaa", function(done){})   socket.emit("aaaaaa" , callbackfunction)
console.log("script.js loaded");

let username = "";
let countryCode = "";
let myPlayer = "";
let opponentUsername = "";
let opponentCountryCode = "";
let socket;
let currentPlayer = "X";
let gameOver = false;
let isCreatingAccount = false;

//▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲

const profileSetupScreen = document.getElementById("profileSetupScreen");
const usernameInput = document.getElementById("usernameInput");
const countrySelect = document.getElementById("countrySelect");
const saveProfileButton = document.getElementById("saveProfileButton");
const countryDropdownButton = document.querySelector("#countryDropdownButton");
const selectedCountryContent = document.querySelector(
  "#selectedCountryContent",
);
const countryDropdownMenu = document.querySelector("#countryDropdownMenu");
const countrySearchInput = document.querySelector("#countrySearchInput");
const countryOptions = document.querySelector("#countryOptions");

const lobbyScreen = document.querySelector("#lobbyScreen");
const playButton = document.querySelector("#playButton");
const logoutButton = document.querySelector("#logoutButton");

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
const gameMyUsername = document.querySelector("#gameMyUsername");
const gameMySymbol = document.querySelector("#gameMySymbol");
const gameOpponentUsername = document.querySelector("#gameOpponentUsername");
const gameOpponentSymbol = document.querySelector("#gameOpponentSymbol");
const gameMyFlag = document.querySelector("#gameMyFlag");
const gameOpponentFlag = document.querySelector("#gameOpponentFlag");

const authScreen = document.getElementById("authScreen");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const signUpButton = document.getElementById("signUpButton");
const loginButton = document.getElementById("loginButton");
const googleLoginButton = document.getElementById("googleLoginButton");
const authMessage = document.getElementById("authMessage");

const registerScreen = document.querySelector("#registerScreen");
const createAccountButton = document.querySelector("#createAccountButton");
const backToLoginButton = document.querySelector("#backToLoginButton");
const registerEmailInput = document.querySelector("#registerEmailInput");
const registerPasswordInput = document.querySelector("#registerPasswordInput");
const registerUsernameInput = document.querySelector("#registerUsernameInput");
const registerCountrySelect = document.querySelector("#registerCountrySelect");
const registerMessage = document.querySelector("#registerMessage");

const registerCountryDropdownButton = document.querySelector(
  "#registerCountryDropdownButton",
);
const registerSelectedCountryContent = document.querySelector(
  "#registerSelectedCountryContent",
);
const registerCountryDropdownMenu = document.querySelector(
  "#registerCountryDropdownMenu",
);
const registerCountrySearchInput = document.querySelector(
  "#registerCountrySearchInput",
);
const registerCountryOptions = document.querySelector(
  "#registerCountryOptions",
);

//▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲

function setupSocketListeners() {
  socket.on("player", function (player) {
    myPlayer = player;

    // Match Found screen
    myUsername.innerHTML = `<img
    src="flags/${countryCode.toLowerCase()}.svg"
    class="playerFlag"
    alt="${countryCode}"><span>${username}</span>`;

    mySymbol.textContent = myPlayer;

    // Game screen
    gameMyUsername.textContent = username;
    gameMyFlag.src = "flags/" + countryCode.toLowerCase() + ".svg";
    gameMyFlag.alt = countryCode;
    gameMySymbol.textContent = myPlayer;

    if (myPlayer === "X") {
      opponentSymbol.textContent = "O";
      gameOpponentSymbol.textContent = "O";
    } else {
      opponentSymbol.textContent = "X";
      gameOpponentSymbol.textContent = "X";
    }

    console.log("You are player:", myPlayer);
  });
  //→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→

  socket.on("opponentInfo", function (data) {
    opponentUsername = data.username;
    opponentCountryCode = data.countryCode;

    // Match Found screen
    opponentName.innerHTML = `<img src="flags/${opponentCountryCode.toLowerCase()}.svg" class="playerFlag"
    alt="${opponentCountryCode}"><span>${opponentUsername}</span>`;

    // Game screen
    gameOpponentUsername.textContent = opponentUsername;

    gameOpponentFlag.src =
      "flags/" + opponentCountryCode.toLowerCase() + ".svg";

    gameOpponentFlag.alt = opponentCountryCode;

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

countryCodes.forEach(function (code) {
  const countryName = regionNames.of(code);
  const option = document.createElement("button");
  option.type = "button";
  option.classList.add("countryOption");
  option.dataset.code = code;
  option.dataset.name = countryName.toLowerCase();
  option.innerHTML = `
    <img
      src="flags/${code.toLowerCase()}.svg"
      alt="${countryName}"
      class="countryOptionFlag"
    >

    <span>${countryName}</span>
  `;
  option.addEventListener("click", function () {
    countrySelect.value = code;
    selectedCountryContent.innerHTML = `
      <img
        src="flags/${code.toLowerCase()}.svg"
        alt="${countryName}"
        class="selectedCountryFlag"
      >

      <span>${countryName}</span>
    `;
    countryDropdownMenu.classList.remove("open");
    countrySearchInput.value = "";
    filterCountries("");
  });
  countryOptions.appendChild(option);
});

countryCodes.forEach(function (code) {
  const countryName = regionNames.of(code);
  const option = document.createElement("button");
  option.type = "button";
  option.classList.add("countryOption");
  option.dataset.code = code;
  option.dataset.name = countryName.toLowerCase();
  option.innerHTML = `
    <img
      src="flags/${code.toLowerCase()}.svg"
      alt="${countryName}"
      class="countryOptionFlag"
    >

    <span>${countryName}</span>
  `;
  option.addEventListener("click", function () {
    registerCountrySelect.value = code;
    registerSelectedCountryContent.innerHTML = `
      <img
        src="flags/${code.toLowerCase()}.svg"
        alt="${countryName}"
        class="selectedCountryFlag"
      >

      <span>${countryName}</span>
    `;
    registerCountryDropdownMenu.classList.remove("open");
    registerCountrySearchInput.value = "";
    filterRegisterCountries("");
  });
  registerCountryOptions.appendChild(option);
});

registerCountryDropdownButton.addEventListener("click", function () {
  registerCountryDropdownMenu.classList.toggle("open");
  if (registerCountryDropdownMenu.classList.contains("open")) {
    registerCountrySearchInput.focus();
  }
});

registerCountrySearchInput.addEventListener("input", function () {
  filterRegisterCountries(registerCountrySearchInput.value);
});

function filterRegisterCountries(searchText) {
  const search = searchText.toLowerCase().trim();

  const options = registerCountryOptions.querySelectorAll(".countryOption");

  options.forEach(function (option) {
    const countryName = option.dataset.name;
    const countryCode = option.dataset.code.toLowerCase();

    if (countryName.includes(search) || countryCode.includes(search)) {
      option.style.display = "flex";
    } else {
      option.style.display = "none";
    }
  });
}

countryDropdownButton.addEventListener("click", function () {
  countryDropdownMenu.classList.toggle("open");

  if (countryDropdownMenu.classList.contains("open")) {
    countrySearchInput.focus();
  }
});

countrySearchInput.addEventListener("input", function () {
  filterCountries(countrySearchInput.value);
});

function filterCountries(searchText) {
  const search = searchText.toLowerCase().trim();

  const options = countryOptions.querySelectorAll(".countryOption");

  options.forEach(function (option) {
    const countryName = option.dataset.name;
    const countryCode = option.dataset.code.toLowerCase();

    if (countryName.includes(search) || countryCode.includes(search)) {
      option.style.display = "flex";
    } else {
      option.style.display = "none";
    }
  });
}

document.addEventListener("click", function (event) {
  if (!event.target.closest(".countryDropdown")) {
    countryDropdownMenu.classList.remove("open");
  }

  if (!event.target.closest(".registerCountryDropdown")) {
    registerCountryDropdownMenu.classList.remove("open");
  }
});

//▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼

saveProfileButton.addEventListener("click", async function () {
  const enteredUsername = usernameInput.value.trim();
  const selectedCountryCode = countrySelect.value;
  if (enteredUsername === "" || selectedCountryCode === "") {
    return;
  }
  const user = auth.currentUser;
  if (user === null) {
    return;
  }
  const userDocRef = doc(db, "users", user.uid);
  await setDoc(userDocRef, {
    username: enteredUsername,
    countryCode: selectedCountryCode,
  });
  username = enteredUsername;
  countryCode = selectedCountryCode;
  console.log("Profile saved to Firestore");
  profileSetupScreen.style.display = "none";
  lobbyScreen.style.display = "block";
});

//••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

createAccountButton.addEventListener("click", async function () {
  const email = registerEmailInput.value.trim();
  const password = registerPasswordInput.value;
  const enteredUsername = registerUsernameInput.value.trim();
  const selectedCountryCode = registerCountrySelect.value;
  registerMessage.textContent = "";
  // Check all fields
  if (
    email === "" ||
    password === "" ||
    enteredUsername === "" ||
    selectedCountryCode === ""
  ) {
    registerMessage.textContent = "Please complete all fields.";
    return;
  }
  try {
    // Create Firebase account
    isCreatingAccount = true;
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    // Create Firestore profile
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      username: enteredUsername,
      countryCode: selectedCountryCode,
    });
    // Save locally for the game
    username = enteredUsername;
    countryCode = selectedCountryCode;
    isCreatingAccount = false;
    console.log("Account and profile created:", user.uid);
    registerScreen.style.display = "none";
    profileSetupScreen.style.display = "none";
    authScreen.style.display = "none";
    lobbyScreen.style.display = "block";
    document.body.classList.remove("auth-loading");
  } catch (error) {
    isCreatingAccount = false;
    console.log("Create account error:", error);
    registerMessage.textContent = getAuthErrorMessage(error);
  }
});

//••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

playButton.addEventListener("click", async function () {
  console.log("Play clicked");
  const user = auth.currentUser;
  if (user === null) {
    return;
  }
  const idToken = await user.getIdToken();
  socket = io({
    auth: {
      token: idToken,
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

//••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

signUpButton.addEventListener("click", function () {
  authScreen.style.display = "none";
  registerScreen.style.display = "block";

  authMessage.textContent = "";
});

backToLoginButton.addEventListener("click", function () {
  registerScreen.style.display = "none";
  authScreen.style.display = "block";

  registerMessage.textContent = "";
});

//••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

logoutButton.addEventListener("click", function () {
  signOut(auth)
    .then(function () {
      console.log("User logged out");
    })
    .catch(function (error) {
      console.log("Logout error:", error);
    });
});

//••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

loginButton.addEventListener("click", function () {
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (email === "" || password === "") {
    authMessage.textContent = "Please enter your email and password.";
    return;
  }
  signInWithEmailAndPassword(auth, email, password)
    .then(function (userCredential) {
      console.log("User logged in:", userCredential.user.uid);
      authMessage.textContent = "";
    })
    .catch(function (error) {
      console.log("Login error:", error);
      authMessage.textContent = getAuthErrorMessage(error);
    });
});

//••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

googleLoginButton.addEventListener("click", function () {
  signInWithPopup(auth, googleProvider)
    .then(function (result) {
      console.log("Google login successful:", result.user.uid);
      authMessage.textContent = "";
    })
    .catch(function (error) {
      console.log("Google login error:", error);
      authMessage.textContent = error.message;
    });
});

//▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼

onAuthStateChanged(auth, async function (user) {
  if (user) {
    console.log("User is logged in:", user.uid);
    if (isCreatingAccount) {
      console.log("Account creation in progress...");
      return;
    }
    authScreen.style.display = "none";
    registerScreen.style.display = "none";

    const userDocRef = doc(db, "users", user.uid);
    // را میسازد Document هنوز چیزی از دیتابیس نمی‌خواند. فقط آدرس
    //  باشد user/a12asfd45fd ادرس میشود a12asfd45fd باشد UID مثلاً اگر
    const userDocSnap = await getDoc(userDocRef);
    // اینجا واقعاً می‌رویم  فایرستور و می‌گوییم داکیومنت این آدرس را بخوان.

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      username = userData.username;
      countryCode = userData.countryCode;
      console.log("Profile loaded:", userData);
      profileSetupScreen.style.display = "none";
      lobbyScreen.style.display = "block";
      document.body.classList.remove("auth-loading");
    } else {
      console.log("No profile found");
      profileSetupScreen.style.display = "block";
      lobbyScreen.style.display = "none";
      document.body.classList.remove("auth-loading");
    }
  } else {
    console.log("User is logged out");
    authScreen.style.display = "block";
    registerScreen.style.display = "none";
    profileSetupScreen.style.display = "none";
    lobbyScreen.style.display = "none";
    document.body.classList.remove("auth-loading");
  }
});

//-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-

function getAuthErrorMessage(error) {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "This email is already registered.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/weak-password":
      return "Password must be at least 6 characters.";

    case "auth/invalid-credential":
      return "Incorrect email or password.";

    case "auth/user-disabled":
      return "This account has been disabled.";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    case "auth/network-request-failed":
      return "Network error. Please check your connection.";

    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";

    default:
      return "Something went wrong. Please try again.";
  }
}
