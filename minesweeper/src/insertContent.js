import logoImg from './assets/img/logo-image.png';
import logoText from './assets/img/logo-text.svg';
import timeIcon from './assets/img/time-icon.svg';
import clickIcon from './assets/img/click-icon.svg';
import emojiSmile from './assets/img/emoji-smile.svg';
import resultsIcon from './assets/img/results-icon.svg';
import settingsIcon from './assets/img/settings-icon.svg';

export default function insertContent() {
  const content = `<main class="main">
    <div class="logo">
      <img class="logo__img" src=${logoImg} alt="logo" width="100" height="100">
      <img class="logo__text" src=${logoText} alt="Minesweeper">
    </div>
    <div class="game-area">
      <div class="game-area__top">
        <div class="info-block info-block--time">
          <img src=${timeIcon} alt="Time" height="30">
          <span class="info-block__text time__counter">000</span>
        </div>
        <button class="button button--game">
          <img src=${emojiSmile} alt="emoji" height="40">
          <span class="button__text">Play again</span>
        </button>
        <div class="info-block info-block--clicks">
          <img src=${clickIcon} alt="Clicks" height="30">
          <span class="info-block__text click__counter">000</span>
        </div>
      </div>
      <div class="grid">
      </div>
      <div class="game-area__bottom">
        <button class="button button--results">
          <img src=${resultsIcon} alt="" height="30">
          <span class="button__text">Results</span></button>
        <button class="button button--settings">
          <img src=${settingsIcon} alt="" height="30">
          <span class="button__text">Settings</span></button>
        </button>
      </div>
    </div>
  </main>`;

  document.body.insertAdjacentHTML('afterBegin', content);
}