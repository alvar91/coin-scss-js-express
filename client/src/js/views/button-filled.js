import SmartView from "./smart.js";
import { State } from "../const.js";

const addDisabledProperty = (isDisabled) => {
  return isDisabled ? `disabled` : ``;
};

const saveButtonTemplate = (title, { isAdding, isDisabled }) => {
  const editButtonText = isAdding
    ? `<div class="button-loader"></div><div>${title}</div>`
    : `${title}`;

  return `
      <div class="button-login-container">
        <button id="test-login-button" class="button-submit js-button" ${addDisabledProperty(
          isDisabled
        )}>
            ${editButtonText}
        </button>
      </div>
  `;
};

export default class FilledButton extends SmartView {
  constructor(title, isDisabled, account) {
    super();

    this._title = title;
    this._state = { isAdding: false, isDisabled };
    this._handler = {};
    this._account = account;
  }

  _accountClickHandler = (evt) => {
    evt.preventDefault();

    if (this._account) {
      this._handler.click(this._account);
    } else {
      this._handler.click();
    }
  };

  getTemplate() {
    return saveButtonTemplate(this._title, this._state);
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
