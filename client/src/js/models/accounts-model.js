import Observer from "../utils/observer.js";

import { DropdownTitle } from "../const.js";

export default class AccountsModel extends Observer {
  constructor() {
    super();

    this._accounts = [];

    this._currentAccount = null;

    this._currentSortType = DropdownTitle.BY_NUMBER;
  }

  setIsAccountsLoading(updateType, update) {
    this._notify(updateType, update);
  }

  getAccount(id) {
    return this._accounts[id];
  }

  setAccount(updateType, account) {
    const accounts = this._accounts.slice();
    accounts.push(account);

    this._accounts = accounts;

    this._notify(updateType, { isLoading: false });
  }

  getAccounts() {
    return this._accounts;
  }

  getAccountsCount() {
    return this._accounts.length;
  }

  setAccounts(updateType, accounts) {
    this._accounts = accounts.slice();

    this._notify(updateType, { isLoading: false });
  }

  setSortType(updateType, sortType) {
    this._currentSortType = sortType;
    this._notify(updateType, { isLoading: false });
  }

  getCurrentSortType() {
    return this._currentSortType;
  }

  setCurrentAccount(updateType, response) {
    this._currentAccount = response;
    const accountId = response.account;

    this._notify(updateType, { isLoading: false, accountId });
  }

  getCurrentAccount() {
    return this._currentAccount;
  }

  resetCurrentAccount() {
    this._currentAccount = null;
  }
}
