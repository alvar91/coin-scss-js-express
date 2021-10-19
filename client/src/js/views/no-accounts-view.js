import AbstractView from "./abstract-view.js";

const createNoAccountsTemplate = () => {
  return `
    <div class=container>
      There are no data in our database
    </div>
  `;
};

export default class NoAccounts extends AbstractView {
  getTemplate() {
    return createNoAccountsTemplate();
  }
}
