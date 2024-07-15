import '../scss/styles.scss';

const startGameElement = document.getElementById('button-start');
const generateNumberElement = document.getElementById('game-text');
const restartGameElement = document.getElementById('button-restart');
const scoreResult = document.getElementById('score-text');

const userBoard = document.getElementById('user-board');
const pcBoard = document.getElementById('pc-board');
const bingoBoard = document.getElementById('bingo-board');
const bingoSpans = bingoBoard.querySelectorAll('.bingo__number');

const gameNumberBoard = 15;
let numberBoard = [];
let randomUserNumber = [];
let randomPcNumber = [];

const generateBoardNumbers = () => {
  for (let i = 1; i <= 99; i++) {
    numberBoard.push(i);
  }
};

const cleanBoardFunction = () => {
  removeNumbersTable();
  numberBoard = [];
  randomUserNumber = [];
  randomPcNumber = [];
  userBoard.textContent = '';
  pcBoard.textContent = '';
  scoreResult.textContent = '';
};

const showRandomNumberSpan = () => {
  startGameElement.classList.add('d-none');
  generateNumberElement.classList.remove('d-none');
};

const showRestartGame = () => {
  restartGameElement.classList.remove('d-none');
  generateNumberElement.classList.add('d-none');
};

const generateRandomNumbers = targetArray => {
  while (targetArray.length !== gameNumberBoard) {
    let randomIndex = Math.floor(Math.random() * numberBoard.length);
    let randomNumber = numberBoard[randomIndex];

    if (!targetArray.includes(randomNumber)) {
      targetArray.push(randomNumber);
    }
  }
  targetArray.sort((a, b) => a - b);
};

const renderBoard = (boardElement, numbers, className) => {
  const fragment = document.createDocumentFragment();
  for (const number of numbers) {
    let span = document.createElement('span');
    span.dataset.number = number;
    span.classList.add('number', className);
    span.textContent = number;
    fragment.append(span);
  }
  boardElement.append(fragment);
};

const userBoardFunction = () => {
  generateRandomNumbers(randomUserNumber);
  renderBoard(userBoard, randomUserNumber, 'number-user');
};

const pcBoardFunction = () => {
  generateRandomNumbers(randomPcNumber);
  renderBoard(pcBoard, randomPcNumber, 'number-pc');
};

const checkNumbersBoard = randomNumber => {
  const userSpans = userBoard.querySelectorAll(`[data-number="${randomNumber}"]`);
  const pcSpans = pcBoard.querySelectorAll(`[data-number="${randomNumber}"]`);

  userSpans.forEach(span => span.classList.add('number-user-correct'));
  pcSpans.forEach(span => span.classList.add('number-pc-correct'));
};

const removeNumbersTable = () => {
  bingoSpans.forEach(span => {
    span.classList.remove('number-appeared');
  });
};

const checkNumbersTable = randomNumber => {
  bingoSpans.forEach(span => {
    if (span.textContent === randomNumber.toString()) {
      span.classList.add('number-appeared');
    }
  });
};

const finalScore = score => {
  scoreResult.textContent = score;
};

const startGameFunction = () => {
  showRandomNumberSpan();
  generateNumberElement.textContent = `Mezclando Numeros`;
  const intervalId = setInterval(() => {
    if (randomUserNumber.length === 0 && randomPcNumber.length === 0) {
      finalScore('Draw');
      showRestartGame();
      clearInterval(intervalId);
      return;
    } else if (randomUserNumber.length === 0) {
      finalScore('User Win');
      showRestartGame();
      clearInterval(intervalId);
      return;
    } else if (randomPcNumber.length === 0) {
      finalScore('Pc Win');
      showRestartGame();
      clearInterval(intervalId);
      return;
    }

    if (numberBoard.length === 0) {
      clearInterval(intervalId);
      generateNumberElement.textContent = 'No hay más números';
      return;
    }

    let randomIndexArray = Math.floor(Math.random() * numberBoard.length);
    let randomNumber = numberBoard[randomIndexArray];

    numberBoard.splice(randomIndexArray, 1);

    let idxUser = randomUserNumber.indexOf(randomNumber);
    if (randomUserNumber.includes(randomNumber)) {
      randomUserNumber.splice(idxUser, 1);
    }

    let idxPc = randomPcNumber.indexOf(randomNumber);
    if (randomPcNumber.includes(randomNumber)) {
      randomPcNumber.splice(idxPc, 1);
    }

    generateNumberElement.textContent = `Número: ${randomNumber}`;

    checkNumbersBoard(randomNumber);
    checkNumbersTable(randomNumber);
  }, 700);
};

const restartGameFunction = () => {
  restartGameElement.classList.add('d-none');
  startGameElement.classList.remove('d-none');
  cleanBoardFunction();
  generateBoardNumbers();
  userBoardFunction();
  pcBoardFunction();
};

generateBoardNumbers();
userBoardFunction();
pcBoardFunction();

startGameElement.addEventListener('click', startGameFunction);
restartGameElement.addEventListener('click', restartGameFunction);
