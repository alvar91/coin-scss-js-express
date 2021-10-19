import Utils from "../utils/common.js";

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getWebSocketConnectionTransfer() {
    if (Utils.isOnline()) {
      return this._api.getWebSocketConnectionTransfer();
    }
  }

  getAccounts(token) {
    if (this._getIsItemPersisted({ key: "accounts" }) && this._isNotExpired()) {
      return Promise.resolve(
        Object.values(this._store.getItem({ key: "accounts" }))
      );
    }

    if (Utils.isOnline()) {
      return this._api.getAccounts(token).then(({ payload: accounts }) => {
        for (const account of accounts) {
          const accountId = account.account;
          this.setItem({ key: "accounts", subKey: accountId, value: account });
        }

        return accounts;
      });
    }

    return Promise.reject(new Error(`Fetch accounts failed`));
  }

  _getIsItemPersisted({ key, subKey }) {
    if (key && subKey) {
      return !!Object.keys(this._store.getItem({ key, subKey })).length > 0;
    }

    if (key) {
      return !!Object.keys(this._store.getItem({ key })).length > 0;
    }

    return false;
  }

  getAccount(authData) {
    const subKey = authData.accountId;

    if (
      this._getIsItemPersisted({ key: "accounts", subKey }) &&
      this._store.getItem({ key: "accounts", subKey }).transactions.length >
        1 &&
      this._isNotExpired()
    ) {
      return Promise.resolve(this._store.getItem({ key: "accounts", subKey }));
    }

    if (Utils.isOnline()) {
      return this._api.getAccount(authData).then((account) => {
        const currentAccount = account.payload;
        const currentAccountId = currentAccount.account;
        this._store.setItem({ key: "accounts", subKey, value: currentAccount });

        const { loss, profit } = Utils.mapTransactionsByMonths(currentAccount);

        this._store.setItem({
          key: "mappedLastYearTransactionsByMonth",
          subKey: "loss",
          subKey2: currentAccountId,
          value: loss,
        });
        this._store.setItem({
          key: "mappedLastYearTransactionsByMonth",
          subKey: "profit",
          subKey2: currentAccountId,
          value: profit,
        });

        return currentAccount;
      });
    }

    return Promise.reject(new Error(`Fetch account failed`));
  }

  newTransaction(transactionData, token) {
    if (Utils.isOnline()) {
      return this._api
        .newTransaction(transactionData, token)
        .then((response) => {
          this.resetMinorStorage();

          const updatedTransaction = this._store.concatItem({
            key: "verifiedAccountsByTransactions",
            value: transactionData.to,
          });
          this._store.setItem({
            key: "verifiedAccountsByTransactions",
            value: updatedTransaction,
          });

          return response;
        });
    }
  }

  newCurrency(currencyData, token) {
    if (Utils.isOnline()) {
      return this._api.newCurrency(currencyData, token).then((response) => {
        return response;
      });
    }
  }

  getMappedLastYearTransactions(currentAccount) {
    const loss = this._store.getItem({
      key: "mappedLastYearTransactionsByMonth",
      subKey: "loss",
      subKey2: currentAccount,
    });
    const profit = this._store.getItem({
      key: "mappedLastYearTransactionsByMonth",
      subKey: "profit",
      subKey2: currentAccount,
    });

    return { loss, profit };
  }

  addAccount(token) {
    if (Utils.isOnline()) {
      return this._api.addAccount(token).then((account) => {
        const accountId = account.account;

        this.setItem({ key: "accounts", subKey: accountId, value: account });
        return account;
      });
    }

    return Promise.reject(new Error(`Add account failed`));
  }

  getBanks(token) {
    if (this._getIsItemPersisted({ key: "banks" }) && this._isNotExpired()) {
      return Promise.resolve(
        Object.values(this._store.getItem({ key: "banks" }))
      );
    }

    if (Utils.isOnline()) {
      return this._api.getBanks(token).then(({ payload: banks }) => {
        this.setItem({ key: "banks", value: banks });

        return banks;
      });
    }

    return Promise.reject(new Error(`Fetch banks failed`));
  }

  getCurrencies(token) {
    if (Utils.isOnline()) {
      return this._api.getCurrencies(token).then((response) => {
        return response;
      });
    }
  }

  login(authData) {
    if (Utils.isOnline()) {
      return this._api.login(authData);
    }
  }

  setItem(params) {
    this._store.setItem(params);
  }

  getToken() {
    if (this._getIsItemPersisted({ key: "auth" }) && this._isNotExpired()) {
      return this._store.getItem({ key: "auth" })?.token;
    }

    return null;
  }

  getIsAuth() {
    if (this._getIsTokenPersisted() && this._isNotExpired()) {
      return true;
    }

    this.resetStorage();

    return false;
  }

  _getIsTokenPersisted() {
    return !!this._store.getItem({ key: "auth" })?.token;
  }

  _isNotExpired() {
    const expireDate = this._store.getItem({ key: "expireDate" });
    const nowDate = new Date();

    return nowDate <= expireDate;
  }

  resetStorage() {
    this._store.resetStorage();
  }

  resetMinorStorage() {
    this._store.resetMinorStorage();
  }

  setShowAccountOrder(order) {
    this.setItem({
      key: "pageOrders",
      subKey: "showAccountPage",
      value: order,
    });
  }

  getShowAccountOrder() {
    return this._store.getItem({
      key: "pageOrders",
      subKey: "showAccountPage",
    });
  }

  setShowHistoryOrder(order) {
    this.setItem({
      key: "pageOrders",
      subKey: "showHistoryPage",
      value: order,
    });
  }

  setShowCurrencyOrder(order) {
    this.setItem({
      key: "pageOrders",
      subKey: "showCurrencyPage",
      value: order,
    });
  }

  getShowHistoryOrder() {
    return this._store.getItem({
      key: "pageOrders",
      subKey: "showHistoryPage",
    });
  }

  getShowCurrencyOrder() {
    return this._store.getItem({
      key: "pageOrders",
      subKey: "showCurrencyPage",
    });
  }

  getVerifiedAccounts() {
    return this._store.getItem({ key: "verifiedAccountsByTransactions" });
  }
}
