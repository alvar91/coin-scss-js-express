import AbstractView from "./abstract-view.js";
import Utils from "../utils/common.js";

const createAccountTopTemplate = (currentAccount) => {
  return `<div class="account">
    <div class="account__top js-account-top">
      <h1 class="section-title">История баланса</h1>
      <button class="button-filled account__button js-button">
        <svg class="account__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.83 11L11.41 7.41L10 6L4 12L10 18L11.41 16.59L7.83 13H20V11H7.83Z" fill="white"/>
        </svg>
        <span class="account__button-title">Вернуться назад</span>
      </button>
  </div>
  <div class="account__content"><span class="account__id">№ ${
    currentAccount?.account
  }</span>
    <p class="account__balance"><span class="account__balance-title">Баланс</span><span class="account__balance-value">
    ${Utils.formatMoney(currentAccount?.balance)} ₽</span></p>
  </div>
  </div>
  `;
};

export default class AccountHead extends AbstractView {
  constructor(currentAccount) {
    super();

    this._currentAccount = currentAccount;
  }

  _accountClickHandler = (evt) => {
    evt.preventDefault();

    this._handler.click();
  };

  setClickHandler(handler) {
    this._handler.click = handler;

    this.getElement()
      .querySelector(`.js-button`)
      .addEventListener(`click`, this._accountClickHandler);
  }

  getTemplate() {
    return createAccountTopTemplate(this._currentAccount);
  }

  getAccountTopContainer() {
    return document.querySelector(`.js-account-top`);
  }
}
