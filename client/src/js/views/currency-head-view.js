import AbstractView from "./abstract-view.js";

const createAccountTopTemplate = () => {
  return `<div class="currency">
    <div class="currency__top js-currency-top">
      <h1 class="section-title">Валютный обмен</h1>
    </div>
  </div>
  `;
};

export default class CurrencyHead extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createAccountTopTemplate();
  }

  getAccountTopContainer() {
    return document.querySelector(`.js-currency-top`);
  }
}
