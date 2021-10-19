import SmartView from "./smart.js";
import { State } from "../const.js";

const addDisabledProperty = (isDisabled) => {
  return isDisabled ? `disabled` : ``;
};

const newAccountButtonTemplate = (title, { isAdding, isDisabled }) => {
  const editButtonText = isAdding
    ? `<div class="button-loader button-loader--light"></div><div>${title}</div>`
    : `<div>
            <svg class="account__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M20 20H4C2.89543 20 2 19.1046 2 18V5.913C2.04661 4.84255 2.92853 3.99899 4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20ZM4 7.868V18H20V7.868L12 13.2L4 7.868ZM4.8 6L12 10.8L19.2 6H4.8Z" fill="white"/>
            </svg>
            <span class="accounts__button-title">${title}</span>
        </div>`;

  return `
      <div class="button-container">
        <button class="button-filled account__button-transaction js-button" ${addDisabledProperty(
          isDisabled
        )} id="test-new-transaction">
            ${editButtonText}
        </button>
      </div>
  `;
};

export default class TransactionButton extends SmartView {
  constructor(title, isDisabled = false) {
    super();

    this._title = title;
    this._state = { isAdding: false, isDisabled };
    this._handler = {};
  }

  _accountClickHandler = (evt) => {
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
      .addEventListener(`click`, this._accountClickHandler);
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
