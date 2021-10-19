import AbstractView from "./abstract-view.js";
import Utils from "../utils/common.js";

const createTableRowTemplate = ({ amount, date, from, to }, personAccount) => {
  const isPositive = personAccount === to;

  return `<div class="account__table-row">
      <div class="account__table-item">
        ${from}
      </div>
      <div class="account__table-item">
        ${to}
      </div>
    <div class="account__table-item ${
      isPositive ? "account__table-item--green" : "account__table-item--red"
    }">${isPositive ? "+" : "-"} ${Utils.formatMoney(amount)} ₽</div>
    <div class="account__table-item"> 
      <time datetime="${Utils.formatTime(date)}">${Utils.formatDateTime(
    date
  )}</time>
    </div>
  </div>`;
};

const createTableList = (transactions, personAccount) => {
  return transactions
    .map((transaction) => {
      return createTableRowTemplate(transaction, personAccount);
    })
    .join("");
};

const createAccountBodyCTemplate = (currentAccount) => {
  const personAccount = currentAccount.account;
  const transactions = currentAccount.transactions.splice(-10).reverse();

  return `<div data-item="c" class="account__history draggable__item" draggable="true">
      <div class="account__table">
        <h2 class="account__title">
          <a class="link js-to-history" href="/history/${personAccount}">История переводов</a>
        </h2>
        <div class="account__table-header">
          <div class="account__table-item">
            Счёт отправителя</div>
          <div class="account__table-item">
            Счёт получателя</div>
          <div class="account__table-item">
            Сумма</div>
          <div class="account__table-item">
            Дата</div>
      </div>

      <div class="account__table-body">
        ${
          transactions.length
            ? createTableList(transactions, personAccount)
            : "Транзакции отсутствуют"
        }
      </div>
    </div>
  </div>`;
};

export default class AccontBodyC extends AbstractView {
  constructor(currentAccount) {
    super();

    this._currentAccount = currentAccount;
  }

  getTemplate() {
    return createAccountBodyCTemplate(this._currentAccount);
  }

  _clickHandler = (e) => {
    e.preventDefault();

    this._handler.click(this._currentAccount.account);
  };

  setClickHandler(handler) {
    this._handler.click = handler;

    this.getElement()
      .querySelector(".js-to-history")
      .addEventListener(`click`, this._clickHandler);
  }
}
