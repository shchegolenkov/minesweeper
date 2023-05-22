import keyPressSoundSource from './assets/sounds/keypress.mp3';
import flagSoundSource from './assets/sounds/flag.mp3';
import newGameSoundSource from './assets/sounds/new-game.mp3';
import gameOverSoundSource from './assets/sounds/lose.mp3';
import gameWinSoundSource from './assets/sounds/win.mp3';
import emojiSmile from './assets/img/emoji-smile.svg';
import emojiScared from './assets/img/emoji-scared.svg';
import emojiWin from './assets/img/emoji-win.svg';
import emojiDead from './assets/img/emoji-dead.svg';
import bombs1 from './assets/img/1.svg';
import bombs2 from './assets/img/2.svg';
import bombs3 from './assets/img/3.svg';
import bombs4 from './assets/img/4.svg';
import bombs5 from './assets/img/5.svg';
import bombs6 from './assets/img/6.svg';
import bombs7 from './assets/img/7.svg';
import bombs8 from './assets/img/8.svg';

let clicks = 0;
let seconds = 0;
let flags = 0;
let bombsRemained;
let bombsCount;
let sideCount;
let timer;
let counterToWin;
let isGaming = false;
let bombsGrid = [];
let savedResults = JSON.parse(localStorage.getItem('results')) || [{ time: '-', moves: '-' }, { time: '-', moves: '-' }, { time: '-', moves: '-' }, { time: '-', moves: '-' }, { time: '-', moves: '-' }, { time: '-', moves: '-' }, { time: '-', moves: '-' }, { time: '-', moves: '-' }, { time: '-', moves: '-' }, { time: '-', moves: '-' }];
if (!localStorage.getItem('results')) localStorage.setItem('results', JSON.stringify(savedResults));

if (!localStorage.getItem('level')) {
  localStorage.setItem('level', 10);
}

if (!localStorage.getItem('mines')) {
  localStorage.setItem('mines', 10);
}

if (!localStorage.getItem('sound')) {
  localStorage.setItem('sound', 'on');
}

function addClick() {
  clicks += 1;
  const clicksDisplay = document.querySelector('.click__counter');
  clicksDisplay.textContent = clicks.toString().padStart(3, '0');
}

function changeFlagsCounter(value) {
  flags = value ? flags + 1 : flags - 1;
  bombsRemained = bombsCount - flags;
  document.querySelector('.flags__counter').textContent = flags.toString().padStart(3, '0');
  document.querySelector('.bombs__counter').textContent = (bombsRemained > -10 && bombsRemained < 0) ? `-0${bombsRemained.toString().slice(-1)}` : bombsRemained.toString().padStart(3, '0');
}

function startTimer() {
  timer = setInterval(() => {
    seconds += 1;
    const secondsToShow = seconds.toString().padStart(3, '0');
    document.querySelector('.time__counter').textContent = `${secondsToShow}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function resetGame() {
  isGaming = false;
  stopTimer();
  clicks = 0;
  seconds = 0;
  flags = 0;
  bombsRemained = 0;
  document.querySelector('.grid').innerHTML = '';
  document.querySelector('.click__counter').textContent = '000';
  document.querySelector('.time__counter').textContent = '000';
  document.querySelector('.bombs__counter').textContent = '000';
  document.querySelector('.flags__counter').textContent = '000';
  document.querySelector('.button__text').textContent = 'Play again';
  document.querySelector('.emoji').setAttribute('src', `${emojiSmile}`);
}

function worryEmoji(event) {
  if (event.target.classList.contains('block') && !event.target.classList.contains('block--flagged')
    && !event.target.classList.contains('block--opened')) {
    document.querySelector('.emoji').setAttribute('src', `${emojiScared}`);
  }
}

function smileEmoji() {
  document.querySelector('.emoji').setAttribute('src', `${emojiSmile}`);
}

function showAllBombs() {
  bombsGrid.forEach((bomb) => {
    setTimeout(() => {
      const block = document.getElementById(bomb);
      if (block) block.classList.add('block--bomb');
    }, 10);
  });
}

function gameOver() {
  const grid = document.querySelector('.grid');

  stopTimer();
  isGaming = false;
  if (localStorage.getItem('sound') === 'on') new Audio(gameOverSoundSource).play();
  const shakingAnimation = [
    { transform: 'translateX(0)' },
    { transform: 'translateX(6px)' },
    { transform: 'translateX(-6px)' },
    { transform: 'translateX(4px)' },
    { transform: 'translateX(-4px)' },
    { transform: 'translateX(0)' },
  ];

  const shakingTiming = {
    duration: 200,
    iterations: 1,
  };

  document.querySelector('.emoji').setAttribute('src', `${emojiDead}`);
  grid.animate(shakingAnimation, shakingTiming);

  showAllBombs();

  grid.querySelectorAll('.block').forEach((block) => {
    block.classList.add('block--game-over');
  });

  grid.removeEventListener('mouseover', worryEmoji);
  grid.removeEventListener('mouseout', smileEmoji);

  document.querySelector('.button__text').textContent = 'Game over';
}

function gameWinCheck(event) {
  bombsCount = +localStorage.getItem('mines');
  let currentCounterToWin = 0;

  document.querySelector('.grid').querySelectorAll('.block').forEach((block) => {
    if (block.classList.contains('block--opened')) currentCounterToWin += 1;
  });

  if ((currentCounterToWin === counterToWin) && !event.target.classList.contains('block--bomb')) {
    const grid = document.querySelector('.grid');
    stopTimer();
    isGaming = false;
    if (localStorage.getItem('sound') === 'on') new Audio(gameWinSoundSource).play();
    document.querySelector('.emoji').setAttribute('src', `${emojiWin}`);
    document.querySelector('.button__text').textContent = 'You win!!!';
    grid.removeEventListener('mouseover', worryEmoji);
    grid.removeEventListener('mouseout', smileEmoji);
    grid.querySelectorAll('.block').forEach((block) => {
      block.classList.add('block--game-over');
    });

    savedResults.unshift({
      time: seconds,
      moves: clicks,
    });
    savedResults = savedResults.slice(0, 10);
    localStorage.setItem('results', JSON.stringify(savedResults));
  }
}

function createBombs(event) {
  bombsGrid = [];
  const mines = +localStorage.getItem('mines');

  let i = 0;
  while (i < mines) {
    const row = Math.floor(Math.random() * (sideCount));
    const column = Math.floor(Math.random() * (sideCount));
    const newBombId = `${row}-${column}`;
    if (!bombsGrid.includes(newBombId) && (newBombId !== event.target.id)) {
      bombsGrid.push(newBombId);
      i += 1;
    }
  }
  bombsRemained = bombsGrid.length;
  document.querySelector('.bombs__counter').textContent = bombsRemained.toString().padStart(3, '0');
}

function checkAround(row, column) {
  if (bombsGrid.includes(`${row}-${column}`)) {
    return 1;
  }
  return 0;
}

function checkBlock(event) {
  const side = +localStorage.getItem('level');

  function checkNumber(row, column) {
    if (row < 0 || row >= side || column < 0 || column >= side) return;
    const id = `${row}-${column}`;
    const block = document.getElementById(id);
    if (block.classList.contains('block--opened') || block.classList.contains('block--flagged')) return;

    let minesFound = 0;
    minesFound += checkAround(row - 1, column - 1);
    minesFound += checkAround(row - 1, column);
    minesFound += checkAround(row - 1, column + 1);
    minesFound += checkAround(row, column - 1);
    minesFound += checkAround(row, column + 1);
    minesFound += checkAround(row + 1, column - 1);
    minesFound += checkAround(row + 1, column);
    minesFound += checkAround(row + 1, column + 1);

    if (minesFound > 0) {
      const img = document.createElement('img');
      switch (minesFound) {
        case 1:
          img.src = `${bombs1}`;
          break;
        case 2:
          img.src = `${bombs2}`;
          break;
        case 3:
          img.src = `${bombs3}`;
          break;
        case 4:
          img.src = `${bombs4}`;
          break;
        case 5:
          img.src = `${bombs5}`;
          break;
        case 6:
          img.src = `${bombs6}`;
          break;
        case 7:
          img.src = `${bombs7}`;
          break;
        case 8:
          img.src = `${bombs8}`;
          break;
        default:
          break;
      }
      block.appendChild(img);
      block.classList.add('block--opened');
    } else {
      block.classList.add('block--opened');
      checkNumber(row - 1, column - 1);
      checkNumber(row - 1, column);
      checkNumber(row - 1, column + 1);
      checkNumber(row, column - 1);
      checkNumber(row, column + 1);
      checkNumber(row + 1, column - 1);
      checkNumber(row + 1, column);
      checkNumber(row + 1, column + 1);
    }
  }

  if (bombsGrid.includes(event.target.id)) {
    event.target.classList.add('block--bomb');
    gameOver();
  } else {
    const coords = event.target.id.split('-');
    const row = parseInt(coords[0], 10);
    const column = parseInt(coords[1], 10);
    checkNumber(row, column);
  }
}

function clickHandler(event) {
  if (!isGaming && clicks) return;

  if (!isGaming && event.button !== 2) {
    startTimer();
    isGaming = true;
    createBombs(event);
  }

  if (isGaming) smileEmoji();

  if (event.target.classList.contains('block') && !event.target.classList.contains('block--opened')) {
    if (event.button === 2 && clicks) {
      if (!event.target.classList.contains('block--flagged')) {
        event.target.classList.add('block--flagged');
        changeFlagsCounter(1);
        gameWinCheck(event);
      } else {
        event.target.classList.remove('block--flagged');
        changeFlagsCounter(0);
      }
      worryEmoji(event);
      if (localStorage.getItem('sound') === 'on') new Audio(flagSoundSource).play();
    } else if (event.button === 0 && !event.target.classList.contains('block--flagged')) {
      if (localStorage.getItem('sound') === 'on') new Audio(keyPressSoundSource).play();
      checkBlock(event);
      event.target.classList.add('block--opened');
      addClick();
      gameWinCheck(event);
    }
  }
}

export default function renderGame(side = +localStorage.getItem('level'), bombs = +localStorage.getItem('mines')) {
  resetGame();

  sideCount = side;
  if (side !== 10 && side !== 15 && side !== 25) {
    sideCount = 10;
  }

  bombsCount = bombs;
  if (!bombs || Number.isNaN(bombs) || bombs < 10 || bombs > 99) {
    bombsCount = 10;
    localStorage.setItem('mines', bombsCount);
  }

  counterToWin = sideCount * sideCount - bombsCount;

  const grid = document.querySelector('.grid');
  grid.style.gridTemplate = `repeat(${sideCount}, 1fr) / repeat(${sideCount}, 1fr)`;

  for (let i = 0; i < sideCount; i += 1) {
    for (let j = 0; j < sideCount; j += 1) {
      const div = document.createElement('div');
      div.classList.add('block');
      div.setAttribute('id', `${i}-${j}`);

      div.oncontextmenu = (event) => {
        event.preventDefault();
      };

      grid.appendChild(div);
    }
  }

  grid.addEventListener('mouseup', clickHandler);
  grid.addEventListener('mouseover', worryEmoji);
  grid.addEventListener('mouseout', smileEmoji);

  document.querySelector('.button--game').addEventListener('click', () => {
    if (seconds || clicks) {
      renderGame();
      if (localStorage.getItem('sound') === 'on') new Audio(newGameSoundSource).play();
    }
  });
}
