import SmartView from "./smart.js";
import { State } from "../const.js";

const addDisabledProperty = (isDisabled) => {
  return isDisabled ? `disabled` : ``;
};

const newAccountButtonTemplate = (title, { isAdding, isDisabled }) => {
  const editButtonText = isAdding
    ? `<div class="button-loader button-loader--light"></div><div>${title}</div>`
    : `<div>
            <span class="accounts__button-title">${title}</span>
        </div>`;

  return `
      <div class="button-container">
        <button class="button-filled currency__button js-button" ${addDisabledProperty(
          isDisabled
        )} id="test-new-transaction-button">
            ${editButtonText}
        </button>
      </div>
  `;
};

export default class CurrencyButton extends SmartView {
  constructor(title = `Обменять`, isDisabled = false) {
    super();

    this._title = title;
    this._state = { isAdding: false, isDisabled };
    this._handler = {};
  }

  _clickHandler = (evt) => {
    evt.preventDefault();

    this._handler.click();
  };

  getTemplate() {
    return newAccountButtonTemplate(this._title, this._state);
  }

  restoreHandlers() {
    this.setClickHandler(this._handler.click);
  }

  setClickHandler(handler) {
    this._handler.click = handler;

    this.getElement()
      .querySelector(`.js-button`)
      .addEventListener(`click`, this._clickHandler);
  }

  setViewState(state) {
    const resetFormState = () => {
      this.updateData({
        isAdding: false,
      });
    };

    switch (state) {
      case State.ADDING:
        this.updateData({
          isDisabled: true,
          isAdding: true,
        });
        break;
      case State.ABORTING:
        resetFormState();
        break;
    }

    this.updateElement();
  }
}
