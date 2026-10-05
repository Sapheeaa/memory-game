// --- ХЕДЕР --- //
const headerElement = document.createElement("header");

const navElements = document.createElement("nav");
navElements.classList.add("nav");

const newGameBtn = document.createElement("button");
newGameBtn.classList.add("btn-new-game", "btn");
newGameBtn.textContent = "New Game";

const titleElement = document.createElement("h1");
titleElement.classList.add("game-title");
titleElement.textContent = "Memory Game";

const lidersBtn = document.createElement("button");
lidersBtn.classList.add("btn", "btn-leaders");
lidersBtn.textContent = "Liders";

navElements.appendChild(newGameBtn);
navElements.appendChild(titleElement);
navElements.appendChild(lidersBtn);

headerElement.appendChild(navElements);
document.body.prepend(headerElement);

// --- СЧЕТЧИКИ И СЕТКА --- //
const mainElement = document.createElement("main");
mainElement.classList.add("game-container");

const movesElement = document.createElement("div");
movesElement.classList.add("moves");

const movesСount = document.createElement("span");
movesСount.id = "moves-count";
movesСount.textContent = "0";

const pairsСount = document.createElement("span");
pairsСount.id = "pairs-count";
pairsСount.textContent = "0 / 8";

movesElement.appendChild(movesСount);
movesElement.appendChild(pairsСount);
mainElement.appendChild(movesElement);

const cardsGrid = document.createElement("div");
cardsGrid.classList.add("cards-grid");
mainElement.appendChild(cardsGrid);

document.body.appendChild(mainElement);

// --- ПРОСТОЕ МОДАЛЬНОЕ ОКНО --- //
const modal = document.createElement("div");
modal.classList.add("modal");

const modalOverlay = document.createElement("div");
modalOverlay.classList.add("modal-overlay");

const modalContent = document.createElement("div");
modalContent.classList.add("modal-content");

const modalTitle = document.createElement("h2");
modalTitle.textContent = "Congratulations!";

const modalText = document.createElement("p");
modalText.id = "modal-text";

const modalButtons = document.createElement("div");
modalButtons.classList.add("modal-buttons");

const modalNewGameBtn = document.createElement("button");
modalNewGameBtn.classList.add("btn", "btn-reset");
modalNewGameBtn.textContent = "Restart";

const modalCloseGameBtn = document.createElement("button");
modalCloseGameBtn.classList.add("btn", "btn-close");
modalCloseGameBtn.textContent = "Close";

modalButtons.appendChild(modalNewGameBtn);
modalButtons.appendChild(modalCloseGameBtn);

modalContent.appendChild(modalTitle);
modalContent.appendChild(modalText);
modalContent.appendChild(modalButtons);

modalOverlay.appendChild(modalContent);
modal.appendChild(modalOverlay);
document.body.appendChild(modal);

function openModal() {
  modalText.textContent = `You matched all pairs in ${moves} moves!`;
  modal.classList.add("modal-open");
  document.body.style.overflow = "hidden"; // Исправлено (добавлен .body)
}

function closeModal() {
  modal.classList.remove("modal-open");
  document.body.style.overflow = "";
}

modalCloseGameBtn.addEventListener("click", closeModal);

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && modal.classList.contains("modal-open")) {
    closeModal();
  }
});

// --- ИГРОВАЯ ЛОГИКА --- //
let unmatchTimer = null;
let globalCardsData = [];

let firstCard = null;
let secondCard = null;
let moves = 0;
let matchedPairs = 0;
let hasFlippedCard = false;
let lockBoard = false;

function resetGame() {
  if (unmatchTimer) {
    clearTimeout(unmatchTimer);
    unmatchTimer = null;
  }

  firstCard = null;
  secondCard = null;
  moves = 0;
  matchedPairs = 0;
  hasFlippedCard = false;
  lockBoard = false;

  movesСount.textContent = moves;
  pairsСount.textContent = `${matchedPairs} / 8`;
  closeModal();
  initGame();
}

function isMatch() {
  if (firstCard.dataset.id === secondCard.dataset.id) {
    match();
  } else {
    unmatch();
  }
}

function match() {
  hasFlippedCard = false;
  lockBoard = false;
  firstCard = null;
  secondCard = null;
  matchedPairs++;
  moves++;
  movesСount.textContent = `${moves}`;
  pairsСount.textContent = `${matchedPairs} / 8`;
  if (matchedPairs === 8) {
    setTimeout(function () {
      openModal();
    }, 500);
  }
}

function unmatch() {
  lockBoard = true;
  unmatchTimer = setTimeout(function () {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
    moves++;
    movesСount.textContent = `${moves}`;
    unmatchTimer = null;
  }, 700);
}

function initGame() {
  while (cardsGrid.firstChild) {
    cardsGrid.removeChild(cardsGrid.firstChild);
  }
  const duplicatedData = globalCardsData.concat(globalCardsData);
  const ShuffledData = duplicatedData.sort(function () {
    return Math.random() - 0.5;
  });

  ShuffledData.forEach(function (cardData) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.id = cardData.id;

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");

    const frontImage = document.createElement("img");
    frontImage.src = cardData.image;
    frontImage.alt = cardData.name;
    cardFront.appendChild(frontImage);

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");

    const backImage = document.createElement("img");
    backImage.src = "dino.jpg";
    backImage.alt = "dino";
    cardBack.appendChild(backImage);

    cardElement.appendChild(cardFront);
    cardElement.appendChild(cardBack);
    cardsGrid.appendChild(cardElement);

    cardElement.addEventListener("click", function () {
      if (lockBoard) return;
      if (cardElement.classList.contains("flipped")) return;

      cardElement.classList.toggle("flipped");

      if (hasFlippedCard === false) {
        hasFlippedCard = true;
        firstCard = cardElement;
        return;
      }

      secondCard = cardElement;
      isMatch();
    });
  });
}

// Загружаем данные и запускаем игру первый раз
fetch("cards.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    globalCardsData = data;
    initGame();
  })
  .catch(function (error) {
    console.error("Ошибка при загрузке cards.json:", error);
  });

// Привязываем кнопки рестарта
newGameBtn.addEventListener("click", resetGame);
modalNewGameBtn.addEventListener("click", resetGame);
