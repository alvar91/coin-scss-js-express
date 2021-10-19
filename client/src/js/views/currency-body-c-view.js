import AbstractView from "./abstract-view.js";

const createCurrencyBodyCTemplate = () => {
  return `<div data-item="c" class="currency__convert draggable__item" draggable="true">
      <div class="currency__table js-currency-table-container">
        <h2 class="currency__title">Обмен валюты</h2>
        <div class="currency__block js-currency-block-container"></div>
    </div>
  </div>`;
};

export default class CurrencyBodyC extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createCurrencyBodyCTemplate();
  }

  getCurrencyTableContainer() {
    return document.querySelector(`.js-currency-table-container`);
  }

  getCurrencyBlockContainer() {
    return document.querySelector(`.js-currency-block-container`);
  }
}
