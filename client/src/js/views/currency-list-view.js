import AbstractView from "./abstract-view.js";
import Utils from "../utils/common.js";

const createListItemTemplate = ({ from, to, rate, change }) => {
  return `<li class="currency__item ${
    change == 1 ? "currency__item--green" : "currency__item--red"
  }">
        <span class="currency__name-grey">${from}/${to}</span>
        <span class="currency__value-grey">${Utils.formatMoney(rate)}</span>
        <span class="currency__border"></span>
    </li>`;
};

const createCurrencyListTemplate = (realtimeCurrencies) => {
  return `<ul class="currency__list js-currency-list-container">
    ${realtimeCurrencies
      .map((item) => {
        return createListItemTemplate(item);
      })
      .join("")}
  <ul>`;
};

export default class CurrencyList extends AbstractView {
  constructor(realtimeCurrencies) {
    super();

    this._realtimeCurrencies = realtimeCurrencies;
  }

  getTemplate() {
    return createCurrencyListTemplate(this._realtimeCurrencies);
  }

  getContainer() {
    return document.querySelector(`.js-currency-container`);
  }

  getCurrencyListContainer() {
    return document.querySelector(`.js-currency-list-container`);
  }
}
