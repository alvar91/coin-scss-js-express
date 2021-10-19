import Observer from "../utils/observer.js";

export default class CurrencyModel extends Observer {
  constructor() {
    super();

    this._myCurrencies = {};
    this._allCurrencies = [];

    this._realtimeCurrencies = [];

    this._currentFromCurrency = null;
    this._currentToCurrency = null;
  }

  setIsCurrenciesLoading(updateType, update) {
    this._notify(updateType, update);
  }

  getAllCurrencies() {
    return this._allCurrencies;
  }

  getMyCurrencies() {
    return this._myCurrencies;
  }

  setCurrencies(updateType, currenciesArr) {
    const allCurrencies = currenciesArr[0];
    const myCurrencies = currenciesArr[1];

    this._allCurrencies = allCurrencies.slice();
    this._myCurrencies = Object.assign({}, myCurrencies);

    this._notify(updateType, { isLoading: false });
  }

  setMyCurrencies(updateType, myCurrencies) {
    this._myCurrencies = [].concat(myCurrencies);

    this._notify(updateType, { isLoading: false });
  }

  setRealtimeCurrencies(updateType, realtimeCurrencies) {
    this._realtimeCurrencies.push(realtimeCurrencies);
    if (this._realtimeCurrencies.length > 20) {
      this._realtimeCurrencies.splice(0, 1);
    }

    this._notify(updateType, { realtimeCurrenciesChange: true });
  }

  getRealtimeCurrencies() {
    return this._realtimeCurrencies;
  }

  setCurrentFromCurrency(updateType, currentFromCurrency) {
    this._currentFromCurrency = currentFromCurrency;
    this._notify(updateType, {
      currentCurrencyTypeChange: true,
      resetInputValue: true,
    });
  }

  getCurrentFromCurrency() {
    if (!this._currentFromCurrency) {
      return Object.keys(this._myCurrencies)[0];
    }

    return this._currentFromCurrency;
  }

  setCurrentToCurrency(updateType, currentToCurrency) {
    this._currentToCurrency = currentToCurrency;
    this._notify(updateType, { currentCurrencyTypeChange: true });
  }

  getCurrentToCurrency() {
    if (!this._currentToCurrency) {
      return this._allCurrencies[0];
    }

    return this._currentToCurrency;
  }
}
