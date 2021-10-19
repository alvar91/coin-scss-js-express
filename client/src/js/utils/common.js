import { MIN_PASSWORD_LENGTH, MIN_ACCOUNT_NUMBER_LENGTH } from "../const.js";

export default class {
  static addEscapeEvent(evt, action) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      action(evt);
    }
  }

  static getShortDescription(description) {
    return description.length >= DESCRIPTION_LENGTH
      ? `${description.slice(0, DESCRIPTION_LENGTH - 1)}...`
      : description;
  }

  static isOnline() {
    return window.navigator.onLine;
  }

  static sortAccountsByNumber(accountA, accountB) {
    return accountA.account > accountB.account ? 1 : -1;
  }

  static sortAccountsByBalance(accountA, accountB) {
    return accountA.balance > accountB.balance ? 1 : -1;
  }

  static sortAccountsByTransaction(accountA, accountB) {
    const dateA = accountA?.transactions[0]?.date;
    const dateB = accountB?.transactions[0]?.date;

    if (!dateA || !dateB) {
      return 0;
    }

    return dateA > dateB ? 1 : -1;
  }

  static toast(message) {
    const SHOW_TIME = 5000;
    const toastContainer = document.createElement(`div`);
    const toastItem = document.createElement(`div`);
    toastContainer.classList.add(`toast-container`);

    document.body.append(toastContainer);

    toastItem.textContent = message;
    toastItem.classList.add(`toast-item`);

    toastContainer.append(toastItem);

    setTimeout(() => {
      toastItem.remove();
    }, SHOW_TIME);
  }

  static toUpperCaseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static formatDate(date) {
    date = new Date(date);

    const months = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];

    const dd = String(date.getDate()).padStart(2, "0");
    var month = months[String(date.getMonth())];
    var yyyy = date.getFullYear();

    return dd + " " + month + " " + yyyy;
  }

  static formatDateTime(date) {
    return new Date(date)?.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  static formatTime(date) {
    return new Date(date)?.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  static formatMoney(money) {
    return money?.toLocaleString("ru-RU");
  }

  static calculateProfitOrLossByMonths = (context, monthNumber, item) => {
    if (context[monthNumber]) {
      const oldAmount = context[monthNumber];
      context[monthNumber] = oldAmount + item.amount;
    } else {
      context[monthNumber] = item.amount;
    }
  };

  static mapTransactionsByMonths(currentAccount) {
    const transactions = currentAccount.transactions;
    const accountId = currentAccount.account;

    const profit = {};
    const loss = {};

    let limitDate = new Date();
    limitDate = new Date(limitDate.setFullYear(limitDate.getFullYear() - 1));

    for (const item of transactions) {
      const transactionDate = new Date(item.date);
      const monthNumber = transactionDate.getMonth();

      if (transactionDate >= limitDate) {
        if (item.to == accountId) {
          this.calculateProfitOrLossByMonths(profit, monthNumber, item);
        } else {
          this.calculateProfitOrLossByMonths(loss, monthNumber, item);
        }
      }
    }

    return { loss, profit };
  }

  static filterTransactionsInLastHalfYear(transactionsYear) {
    const transactionsHalfYear = {};

    let finishMonth = new Date().getMonth();
    let startMonth = null;

    const innerCircle = () => {
      for (const [key, value] of Object.entries(transactionsYear)) {
        if (startMonth - finishMonth < 0) {
          if (key < startMonth || key >= finishMonth) {
            transactionsHalfYear[key] = value;
          }
        } else {
          if (key > startMonth || key <= finishMonth) {
            transactionsHalfYear[key] = value;
          }
        }
      }
    };

    const outerCircle = () => {
      for (const [key, value] of Object.entries(transactionsYear)) {
        if (key > startMonth && key <= finishMonth) {
          transactionsHalfYear[key] = value;
        }
      }
    };

    if (finishMonth - 6 < 0) {
      startMonth = Math.abs(Math.abs(finishMonth - 6) - 12);
      innerCircle();
    } else {
      startMonth = finishMonth - 6;
      outerCircle();
    }

    return transactionsHalfYear;
  }

  static sortTranactionsByDate(transactionA, transactionB) {
    return transactionA.date > transactionB.date ? 1 : -1;
  }
  static getErrorNotFiled(title) {
    return `Ошибка: Поле "${title}" должно быть заполнено`;
  }

  static getErrorNotLengthMoreThan6(title) {
    return `Ошибка: Поле "${title}" должно быть длиной не менее ${MIN_PASSWORD_LENGTH} символов`;
  }

  static getErrorNotValidForm(title) {
    return `Ошибка: Невалидная форма "${title}"`;
  }

  static getErrorNotLengthIs26(title) {
    return `Ошибка: Поле "${title}" должно быть длиной ${MIN_ACCOUNT_NUMBER_LENGTH} символов`;
  }

  static getErrorNotValueMoreThanAccountHave(title) {
    return `Ошибка: Поле "${title}" должно быть не более доступных средств на счете и больше нуля`;
  }

  static notEqualFromAndTo(title) {
    return `Ошибка: "${title}" не может быть равен исходящему счету`;
  }

  static createUUID() {
    let dt = new Date().getTime();
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  }
}
