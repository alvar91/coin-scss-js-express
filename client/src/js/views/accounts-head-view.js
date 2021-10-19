import AbstractView from "./abstract-view.js";

const createAccountsTopTemplate = () => {
  return `
    <div class="accounts__top js-accounts-top">
      <h1 class="section-title">Ваши счета</h1>
  </div>
  `;
};

export default class AccountsHead extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createAccountsTopTemplate();
  }

  getAccountsTopContainer() {
    return document.querySelector(`.js-accounts-top`);
  }
}
