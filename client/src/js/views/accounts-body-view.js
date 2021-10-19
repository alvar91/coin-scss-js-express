import AbstractView from "./abstract-view.js";

const createAccountsBodyTemplate = () => {
  return `<ul class="accounts__list"></ul>`;
};

export default class AccontsBody extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createAccountsBodyTemplate();
  }
}
