import AbstractView from "./abstract-view.js";

const createAccountBodyATemplate = () => {
  return `<div data-item="a" class="account__new-transaction draggable__item" draggable="true">
    <h2 class="account__title">Новый перевод</h2>
      <form class="account__form js-form-container">
      </form>
  </div>`;
};

export default class AccontBodyA extends AbstractView {
  constructor(currentAccount) {
    super();

    this._currentAccount = currentAccount;
  }

  getTemplate() {
    return createAccountBodyATemplate();
  }

  getFormContainer() {
    return document.querySelector(`.js-form-container`);
  }
}
