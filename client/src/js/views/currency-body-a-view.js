import AbstractView from "./abstract-view.js";
import Utils from "../utils/common.js";

const currencyItemTemplate = ({ amount, code }) => {
  return `<li class="currency__item">
    <span class="currency__name">${code}</span>
    <span class="currency__value">${Utils.formatMoney(amount)}</span>
    <span class="currency__border"></span>
  </li>`;
};

const createCurrencyBodyBTemplate = (myCurrencies) => {
  return `<div data-item="a" class="currency__your draggable__item" draggable="true">
    <h2 class="currency__title">Ваши валюты</h2>
    <ul class="currency__list">
      ${myCurrencies
        .map((item) => {
          return currencyItemTemplate(item);
        })
        .join("")}
    </ul>
  </div>`;
};

export default class CurrencyBodyA extends AbstractView {
  constructor(myCurrencies) {
    super();

    this._myCurrencies = Object.values(myCurrencies);
  }

  getTemplate() {
    return createCurrencyBodyBTemplate(this._myCurrencies);
  }
}
