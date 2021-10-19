import AbstractView from "./abstract-view.js";

const createCurrencyBodyBTemplate = () => {
  return `<div data-item="b" class="currency__change draggable__item" draggable="true">
  <h2 class="currency__title">Изменение курсов в реальном времени</h2>
    <div class="js-currency-container"></div>
  </div>`;
};

export default class CurrencyBodyB extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createCurrencyBodyBTemplate();
  }

  getContainer() {
    return document.querySelector(`.js-currency-container`);
  }
}
