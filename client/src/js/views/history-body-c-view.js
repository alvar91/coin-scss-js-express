import AbstractView from "./abstract-view.js";
import Utils from "../utils/common.js";

const createTableRowTemplate = ({ amount, date, from, to }, personAccount) => {
  const isPositive = personAccount === to;

  return `<div class="history__table-row">
      <div class="history__table-item">
        ${from}
      </div>
      <div class="history__table-item">
        ${to}
      </div>
    <div class="history__table-item ${
      isPositive ? "history__table-item--green" : "history__table-item--red"
    }">${isPositive ? "+" : "-"} ${Utils.formatMoney(amount)} ₽</div>
    <div class="history__table-item"> 
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

const createHistoryBodyCTemplate = (currentAccount) => {
  const personAccount = currentAccount.account;
  const transactions = currentAccount.transactions.splice(-25).reverse();

  return `<div data-item="c" class="history__history draggable__item" draggable="true">
      <div class="history__table">
        <h2 class="history__title">История переводов</h2>
        <div class="history__table-header">
          <div class="history__table-item">
            Счёт отправителя</div>
          <div class="history__table-item">
            Счёт получателя</div>
          <div class="history__table-item">
            Сумма</div>
          <div class="history__table-item">
            Дата</div>
      </div>

      <div class="history__table-body">
        ${
          transactions.length
            ? createTableList(transactions, personAccount)
            : "Транзакции отсутствуют"
        }
      </div>
    </div>
  </div>`;
};

export default class HistoryBodyC extends AbstractView {
  constructor(currentAccount) {
    super();

    this._currentAccount = currentAccount;
  }

  getTemplate() {
    return createHistoryBodyCTemplate(this._currentAccount);
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
