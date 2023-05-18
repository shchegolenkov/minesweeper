import keyPressSoundSource from './assets/sounds/keypress.mp3';

let clicks = 0;
let timer = false;
const isGaming = 1;

if (!localStorage.getItem('level')) {
  localStorage.setItem('level', 'easy');
}

if (!localStorage.getItem('mines')) {
  localStorage.setItem('mines', 10);
}

const clicksDisplay = document.querySelector('.click__counter');

function addClick() {
  clicks += 1;
  const clicksToShow = clicks.toString().padStart(3, '0');
  clicksDisplay.textContent = clicksToShow;
}
let seconds = 0;
let timerInterval;

function startTimer() {
  timer = true;
  timerInterval = setInterval(() => {
    seconds += 1;
    const secondsToShow = seconds.toString().padStart(3, '0');
    document.querySelector('.time__counter').innerText = `${secondsToShow}`;
    if (!isGaming) {
      clearInterval(timerInterval);
    }
  }, 1000);
}

function clickHandler(event) {
  const keyPressSound = new Audio(keyPressSoundSource);

  if (event.target.classList.contains('block')) {
    if (!timer) startTimer();
    addClick();
    event.target.classList.add('block--opened');
    keyPressSound.play();
    // grid.animate(shakingAnimation, shakingTiming);
  }
}

export default function renderGame() {
  const grid = document.querySelector('.grid');

  for (let i = 0; i < 100; i += 1) {
    const div = document.createElement('div');
    div.classList.add('block');

    // Disable right click on box:
    // div.addEventListener('contextmenu', (e) => {
    //   e.preventDefault();
    // }, false);
    div.oncontextmenu = (e) => {
      e.preventDefault();
    };

    grid.appendChild(div);

    grid.addEventListener('click', clickHandler);
  }
}
