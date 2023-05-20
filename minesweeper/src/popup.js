import closeIcon from './assets/img/close-icon.svg';

export default function popupHandler(context) {
  function openPopup() {
    const settingsPopupContent = `<div class="popup__wrapper">
    <div class="popup__overlay"></div>
    <div class="popup settings__popup">
      <button class="close-button">
        <img class="close-button__icon" src=${closeIcon} alt="close">
      </button>
      <div class="popup__header">Settings</div>
      <div class="settings__block">
        <div class="settings__name">Level:</div>
        <form class="settings__form settings__flex">
          <label class="settings__label">
            <input type="radio" name="level" value="easy" class="input input--level">
            Easy
          </label>
          <br>
          <label class="settings__label">
            <input type="radio" name="level" value="medium" class="input input--level">
            Medium
          </label>
          <label class="settings__label">
            <input type="radio" name="level" value="hard" class="input input--level">
                Hard
              </label>
            </form>
          </div>
          <div class=" settings__block">
            <div class="settings__name">Mines:</div>
            <div class="settings__form settings__flex">
              <span class="settings__description">From 10 to 99</span>
              <input type="number" class="settings__input input--mines" min="10" max="99" step="1" minlength="2" maxlength="2" pattern="[0-9]*" required>
            </div>
      </div>
      <div class="settings__block">
        <span class="settings__name">Theme:</span>
        <form class="settings__form settings__flex">
          <label class="settings__label">
            <input type="radio" name="theme" value="light" class="input input--theme">
            Light
          </label>
          <br>
          <label class="settings__label">
            <input type="radio" name="theme" value="dark" class="input input--theme">
            Dark
          </label>
        </form>
      </div>
      <div class="settings__block">
        <span class="settings__name">Sound:</span>
        <form class="settings__form settings__flex">
          <label class="settings__label">
            <input type="radio" name="sound" value="on" class="input input--sound">
            On
          </label>
          <br>
          <label class="settings__label">
            <input type="radio" name="sound" value="off" class="input input--sound">
            Off
          </label>
        </form>
      </div>
    </div>
  </div>`;

    const resultsPopupContent = `<div class="popup__wrapper">
    <div class="popup__overlay"></div>
    <div class="popup results__popup">
      <button class="close-button">
        <img class="close-button__icon" src=${closeIcon} alt="close">
      </button>
      <div class="popup__header">Results</div>
      <table class="results__table table">
        <thead>
          <tr class="table__header">
            <th>#</th>
            <th>Time</th>
            <th>Clicks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>2</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>3</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>4</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>5</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>6</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>7</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>8</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>9</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>10</td>
            <td>0</td>
            <td>0</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`;

    let popupContent;
    if (context === 'settings') {
      popupContent = settingsPopupContent;
    } else if (context === 'results') {
      popupContent = resultsPopupContent;
    }

    document.body.insertAdjacentHTML('beforeend', popupContent);

    setTimeout(() => {
      document.querySelector('.popup').classList.add('popup--visible');
      document.querySelector('.popup__overlay').classList.add('popup__overlay--visible');
    }, 100);
  }

  openPopup();

  const popup = document.querySelector('.popup');

  function closePopup(event) {
    if ((event.target.classList.contains('popup__overlay--visible') || event.target.classList.contains('close-button__icon') || event.target.classList.contains('close-button'))) {
      popup.classList.remove('popup--visible');
      document.querySelector('.popup__overlay').classList.remove('popup__overlay--visible');

      setTimeout(() => {
        if (document.querySelector('.popup__wrapper')) document.querySelector('.popup__wrapper').remove();
      }, 200);
    }
  }

  function settingsPopupHandler() {
    const minesInput = document.querySelector('.input--mines');
    minesInput.value = localStorage.getItem('mines');

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

    minesInput.oninput = function limitInputLength() {
      minesInput.value = minesInput.value.substr(0, 2);
    };

    minesInput.addEventListener('change', () => {
      if (minesInput.value.length === 2 && /^([1-9]\d)$/.test(minesInput.value)) {
        minesInput.classList.remove('settings__input--invalid');
        localStorage.setItem('mines', minesInput.value);
      } else {
        minesInput.classList.add('settings__input--invalid');
        minesInput.animate(shakingAnimation, shakingTiming);
      }
    });

    const settingRadioButtons = popup.querySelectorAll('.input');

    settingRadioButtons.forEach((input) => {
      if (input.value === localStorage.getItem(input.name)) {
        input.setAttribute('checked', 'true');
      }
      input.addEventListener('click', () => {
        localStorage.setItem(input.name, input.value);
      });
    });
  }

  if (context === 'settings') {
    settingsPopupHandler();
  }

  document.body.addEventListener('click', closePopup);
}
