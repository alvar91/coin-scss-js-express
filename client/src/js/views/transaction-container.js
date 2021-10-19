import AbstractView from "./abstract-view.js";

const createLoginContainerTemplate = () => {
  return `<div class="login">
        <div class="login__container">
            <h1 class="section-title">Вход в аккаунт</h1>
            <form class="login__form js-form-container"></form>
        </div>
    </div>
  `;
};

export default class TransactionContainer extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createLoginContainerTemplate();
  }

  getFormContainer() {
    return document.querySelector(`.js-form-container`);
  }
}
