import AbstractView from "./abstract-view.js";
import Utils from "../utils/common.js";

const transactionDateRender = (transactionDate) => {
  if (transactionDate) {
    return `<time class="accounts__date-transaction " datetime="${Utils.formatDateTime(
      transactionDate
    )}">${Utils.formatDate(transactionDate)}</time>`;
  }

  return `<span class="accounts__date-transaction">Отсутствует</span>`;
};

const createProfileItemTemplate = (account) => {
  if (!account.account) return;

  const transactionDate = account?.transactions[0]?.date;

  return `<li data-testid="test-account-profile">
    <article class="accounts__item"><span class="accounts__id">${
      account.account
    }</span><span class="accounts__cost">${Utils.formatMoney(
    account.balance
  )} ₽</span>
      <div class="accounts__item-bottom">
        <div class="accounts__transaction"><span class="accounts__last-transaction">
            Последняя транзакция:<br /></span>
            ${transactionDateRender(transactionDate)}
        </div>
        <button class="button-filled js-account">Открыть</button>
      </div>
    </article>
  </li>
`;
};

export default class AccountProfile extends AbstractView {
  constructor(account) {
    super();
    this._account = account;
  }

  getTemplate() {
    return createProfileItemTemplate(this._account);
  }

  _clickProfileHandler = (evt) => {
    if (!evt.target.classList.contains(`js-account`)) {
      return;
    }

    evt.preventDefault();
    this._handler.clickProfile(this._account.account);
  };

  setProfileAccountClickHandler(handler) {
    this._handler.clickProfile = handler;

    this.getElement().addEventListener(`click`, this._clickProfileHandler);
  }
}
