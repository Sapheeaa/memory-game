// хедер//
//1. Создаем главный тег <header>
const headerElement = document.createElement("header");

// 2. Создаем контейнер для навигации <div class="nav">
const navElements = document.createElement("nav");
navElements.classList.add("nav");

// 3. Создаем кнопку "New Game"
const newGameBtn = document.createElement("button");
newGameBtn.classList.add("btn-new-game", "btn");
newGameBtn.textContent = "New Game";

// 4. Создаем заголовок <h1 class="game-title">
const titleElement = document.createElement("h1");
titleElement.classList.add("game-title");
titleElement.textContent = "Memory Game";

// 5. Создаем кнопку "Leaders"
const lidersBtn = document.createElement("button");
lidersBtn.classList.add("btn", "btn-leaders");
lidersBtn.textContent = "Liders";

// 6. Собираем структуру: вкладываем кнопки и заголовок внутрь .nav
navElements.appendChild(newGameBtn);
navElements.appendChild(titleElement);
navElements.appendChild(lidersBtn);

// 7. Вкладываем .nav внутрь <header>
headerElement.appendChild(navElements);

// 8. Добавляем готовый header на страницу в тег <body>
document.body.prepend(headerElement);

// счетчики//
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

document.body.appendChild(mainElement);

// сеточка грид//
const cardsGrid = document.createElement("div");
cardsGrid.classList.add("cards-grid");
mainElement.appendChild(cardsGrid);

// --- МОДАЛЬНОЕ ОКНО ---
const modal = document.createElement("div");
modal.classList.add("modal");

const modalOverlay = document.createElement("div");
modalOverlay.classList.add("modal-overlay");
modalOverlay.id = "win-modal";

const modalContent = document.createElement("div");
modalContent.classList.add("modal-content");
//текст
const modalTitle = document.createElement("h2");
modalTitle.textContent = "Congratulations!";
const modalText = document.createElement("p");
modalText.textContent = "You matched all pairs! In which game have you already played?";
//кнопки
const modalButtons = document.createElement("div");
modalButtons.classList.add("modal-buttons");

const finalMovesCount = document.createElement("span");
finalMovesCount.id = "final-moves-count";
finalMovesCount.textContent = "0";

// 8. Кнопка Restart
const modalNewGameBtn = document.createElement("button");
modalNewGameBtn.classList.add("btn", "btn-reset");
modalNewGameBtn.id = "modalNewGameBtn";

// 9. Кнопка Close
const modalCloseGameBtn = document.createElement("button");
modalCloseGameBtn.classList.add("btn", "btn-close");
modalCloseGameBtn.id = "modalCloseGameBtn";
modalCloseGameBtn.textContent = "Close";

//собираем модальное окно
modalButtons.appendChild(finalMovesCount);
modalButtons.appendChild(modalNewGameBtn);
modalButtons.appendChild(modalCloseGameBtn);

modalContent.appendChild(modalTitle);
modalContent.appendChild(modalText);
modalContent.appendChild(modalButtons);

modalOverlay.appendChild(modalContent);
modal.appendChild(modalOverlay);

document.body.appendChild(modal);

function openModal() {
  modal.classList.add("modal-open");
  finalMovesCount.textContent = `${moves} steps`;
  document.body.style.overflow = "hidden"; //блокирует прокрутку страницы
}

function closeModal() {
  modal.classList.remove("modal-open");
  document.body.style.overflow = "";
}
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && modal.classList.contains("modal-open")) {
    closeModal();
  }
});

modalCloseGameBtn.addEventListener("click", closeModal);
//

let firstCard = null;
let secondCard = null;
let moves = 0;
let matchedPairs = 0;
let hasFlippedCard = false;
let lockBoard = false;

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
  //устанавливаем таймер блокировки
  setTimeout(function () {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
    moves++;
    movesСount.textContent = `${moves}`;
  }, 700);
}

// генерируем карточки.
fetch("cards.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    const duplicatedData = data.concat(data); //дублируем массив и объединяем, чтобы было 16 карточек
    console.log(duplicatedData);
    const ShuffledData = duplicatedData.sort(function () {
      return Math.random() - 0.5; //перемешиваем
    });
    //заполняем карточки
    ShuffledData.forEach(function (cardData) {
      const cardElement = document.createElement("div");
      cardElement.classList.add("card"); //Создаем основу карточки
      cardElement.dataset.id = cardData.id;
      const cardFront = document.createElement("div"); //Создаем лицевую сторону (картинка игры)
      cardFront.classList.add("card-front");

      const frontImage = document.createElement("img");
      frontImage.src = cardData.image;
      frontImage.alt = cardData.name;
      cardFront.appendChild(frontImage);
      //Создаем обратную сторону (рубашка с динозавром)

      const cardBack = document.createElement("div");
      cardBack.classList.add("card-back");

      const backImage = document.createElement("img");
      backImage.src = "dino.jpg";
      backImage.alt = "dino";

      cardBack.appendChild(backImage);
      //Собираем карточку воедино
      cardElement.appendChild(cardFront);
      cardElement.appendChild(cardBack);

      //вкладываем в сетку грид
      cardsGrid.appendChild(cardElement);

      cardElement.addEventListener("click", function () {
        if (lockBoard) return; //если доска заблокирована ничего не делаем (по умолчанию false)
        if (cardElement.classList.contains("flipped")) return; // если карточка уже открыта, ничего не делаем
        //
        cardElement.classList.toggle("flipped"); //во всех других случаях переворачиваем карту
        if (hasFlippedCard === false) {
          //если карта еще не была перевернута, присваеваем переменной перевернутость
          hasFlippedCard = true; //отныне она перевернута
          firstCard = cardElement;
          return;
        }
        secondCard = cardElement;
        isMatch();

        ///
      });
    });
  })
  .catch(function (error) {
    console.error("Ошибка при загрузке cards.json:", error);
  });
