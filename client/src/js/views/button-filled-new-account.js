import SmartView from "./smart.js";
import { State } from "../const.js";

const addDisabledProperty = (isDisabled) => {
  return isDisabled ? `disabled` : ``;
};

const newAccountButtonTemplate = (title, { isAdding, isDisabled }) => {
  const editButtonText = isAdding
    ? `<div class="button-loader button-loader--light"></div><div>${title}</div>`
    : `<div>
            <svg class="accounts__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.00001L12 12M12 12L12 20M12 12L20 12M12 12L4 12" stroke="white" stroke-width="2"/>
            </svg>
            <span class="accounts__button-title">${title}</span>
        </div>`;

  return `
      <div class="button-container">
        <button class="button-filled accounts__button js-button" id="test-new-account" ${addDisabledProperty(
          isDisabled
        )}>
            ${editButtonText}
        </button>
      </div>
  `;
};

export default class NewAccountButton extends SmartView {
  constructor(title = `Создать новый счет`, isDisabled = false) {
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
    this.setAccountClickHandler(this._handler.click);
  }

  setAccountClickHandler(handler) {
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
