import './styles.css';

import popupHandler from './popup';
import insertContent from './insertContent';
import renderGame from './renderGame';
import setTheme from './setTheme';

function popupButtonsHandler() {
  document.querySelector('.button--settings').addEventListener('click', () => {
    popupHandler('settings');
  });

  document.querySelector('.button--results').addEventListener('click', () => {
    popupHandler('results');
  });
}

function initializeContent() {
  insertContent();
  renderGame();
  setTheme();
  popupButtonsHandler();
}

window.onload = () => {
  initializeContent();
};
