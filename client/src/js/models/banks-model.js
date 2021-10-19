import Observer from "../utils/observer.js";

export default class BanksModel extends Observer {
  constructor() {
    super();

    this._banks = [];
  }

  setIsBanksLoading(updateType, update) {
    this._notify(updateType, update);
  }

  getBanks() {
    return this._banks;
  }

  getBanksCount() {
    return this._banks.length;
  }

  setBanks(updateType, banks) {
    this._banks = banks.slice();

    this._notify(updateType, { isLoading: false });
  }
}
