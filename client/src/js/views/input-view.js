import AbstractView from "./abstract-view.js";

const isValidTemplate = (isTouched, isValid) => {
  if (!isTouched) {
    return ``;
  } else if (!isValid) {
    return `login__label--error`;
  }

  return `login__label--success`;
};

const inputFieldTemplate = (field, isPassword) => {
  return `
  <label class="login__label js-label ${isValidTemplate(
    field.isTouched,
    field.isValid
  )}">
    <span class="login__span">${field.title}</span>
      <input data-fieldid=${field.id} class="login__input js-input"
      value="${field.value}" ${
    isPassword
      ? 'type="password" id="test-user-password" autocomplete="current-password"'
      : 'type="text" id="test-user-login"  autocomplete="username"'
  } placeholder="Введите ${field.title}" required >
  </label>
  `;
};

export default class InputField extends AbstractView {
  constructor(field, isPassword = false) {
    super();

    this._field = field;
    this._isPassword = isPassword;
  }

  _changeHandler = (evt) => {
    evt.preventDefault();

    this._handler.change(evt.target.dataset.fieldid, evt.target.value);
  };

  getTemplate() {
    return inputFieldTemplate(this._field, this._isPassword);
  }

  _setValid(evt) {
    evt.target.closest(`.js-label`).classList.remove(`login__label--error`);
  }

  setChangeHandler(handler) {
    this._handler.change = handler;

    this.getElement()
      .querySelector(".js-input")
      .addEventListener(`focusout`, this._changeHandler);

    this.getElement()
      .querySelector(".js-input")
      .addEventListener(`focus`, (evt) => this._setValid(evt));
  }
}
