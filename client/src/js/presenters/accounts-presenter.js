import {
  END_POINT,
  WS_END_POINT,
  UpdateType,
  UserAction,
  DropdownTitle,
} from "../const.js";

import Router from "../utils/router.js";

import Api from "../api/api.js";
import Store from "../api/store.js";
import Provider from "../api/provider.js";

import AccountsModel from "../models/accounts-model.js";
import BanksModel from "../models/banks-model.js";
import FormModel from "../models/form-model.js";
import FormTransactionModel from "../models/form-transaction-model.js";
import CurrencyModel from "../models/currency-model.js";
import FormCurrencyModel from "../models/form-currency-model.js";

import Utils from "../utils/common.js";

import { FieldTitle, State, STORE_NAME } from "../const.js";

import {
  validationMethods,
  formatInput,
  formatTransactionInput,
} from "../utils/validate.js";

const api = new Api(END_POINT, WS_END_POINT);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

export default class AccountsPresenter {
  constructor(view) {
    this._view = view;

    this._api = apiWithProvider;

    this._router = new Router(this);

    this._accountsModel = new AccountsModel();
    this._banksModel = new BanksModel();
    this._formModel = new FormModel();
    this._formTransactionModel = new FormTransactionModel();
    this._currencyModel = new CurrencyModel();
    this._formCurrencyModel = new FormCurrencyModel();

    this._accountsModel.addObserver(this._handleModelEvent);
    this._banksModel.addObserver(this._handleModelEvent);
    this._formModel.addObserver(this._handleModelEvent);
    this._formTransactionModel.addObserver(this._handleModelEvent);
    this._currencyModel.addObserver(this._handleModelEvent);
    this._formCurrencyModel.addObserver(this._handleModelEvent);

    this._wsTransfer = null;
  }

  resetWebSocketTransfer() {
    this._wsTransfer = null;
  }

  // Handlers
  _handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this._view.updatePatch(data);
        break;

      case UpdateType.MINOR:
        this._view.updateMinor(data);
        break;

      case UpdateType.MAJOR:
        this._view.updateMajor(data);
        break;
    }
  };

  handleDnDChange = (mappedOrder) => {
    this._api.setShowAccountOrder(mappedOrder);
  };

  handleDnDChangeHistory = (mappedOrder) => {
    this._api.setShowHistoryOrder(mappedOrder);
  };

  handleDnDChangeCurrency = (mappedOrder) => {
    this._api.setShowCurrencyOrder(mappedOrder);
  };

  handleSortTypeChange = (sortType) => {
    const currentSortType = this.getCurrentSortType();
    if (currentSortType === sortType) {
      return;
    }

    this._accountsModel.setSortType(UpdateType.MINOR, sortType);
  };

  handleProfileAccountClick = (accountId) => {
    this._router.navigateTo(`/account/${accountId}`);
  };

  handleDropdownChange = (fieldTitle) => {
    let field;

    switch (fieldTitle) {
      case DropdownTitle.BY_NUMBER:
        field = DropdownTitle.BY_NUMBER;
        break;
      case DropdownTitle.BY_BALANCE:
        field = DropdownTitle.BY_BALANCE;
        break;
      case DropdownTitle.BY_TRANSACTION:
        field = DropdownTitle.BY_TRANSACTION;
        break;
      default:
        break;
    }

    if (!field) {
      throw new Error(`Can't create nonexistent field: ${fieldTitle}`);
    }

    this.handleSortTypeChange(field);
  };

  handleBackToAccountsButtonClick = () => {
    this._router.navigateTo(`/accounts`);
  };

  handleToHistoryClick = (currentAccountId) => {
    this._router.navigateTo(`/history/${currentAccountId}`);
  };

  handleToAccountClick = () => {
    const currentAccount = this.getCurrentAccount();
    const currentAccountId = currentAccount.account;
    this._router.navigateTo(`/account/${currentAccountId}`);
  };

  _validateField(field) {
    if (!field.required) return true;

    if (!field) {
      throw new Error(`Can't find nonexistent field: ${field}`);
    }

    const validationField = field.validation;

    for (const method in validationField) {
      const errorMessage = field.validation[method];

      if (
        validationField.hasOwnProperty(method) &&
        !validationMethods({ method, field }) &&
        !field.deletedField
      ) {
        this._formModel.setError(errorMessage);
        return false;
      }

      this._formModel.deleteError(errorMessage);
    }

    return true;
  }

  _validateTransactionField(field) {
    if (!field.required) return true;

    if (!field) {
      throw new Error(`Can't find nonexistent field: ${field}`);
    }

    const validationField = field.validation;

    const currentAccount = this.getCurrentAccount();

    for (const method in validationField) {
      const errorMessage = field.validation[method];

      if (
        validationField.hasOwnProperty(method) &&
        !validationMethods({ method, field, currentAccount }) &&
        !field.deletedField
      ) {
        this._formTransactionModel.setError(errorMessage);
        return false;
      }

      this._formTransactionModel.deleteError(errorMessage);
    }

    return true;
  }

  _validateCurrencyField(field) {
    if (!field.required) return true;

    if (!field) {
      throw new Error(`Can't find nonexistent field: ${field}`);
    }

    const validationField = field.validation;

    const сurrentFromCurrency = this.getCurrentFromCurrency();
    const myCurrencies = this.getMyCurrencies();

    const { amount } = myCurrencies[сurrentFromCurrency];
    const currentAccount = { balance: amount };

    for (const method in validationField) {
      const errorMessage = field.validation[method];

      if (
        validationField.hasOwnProperty(method) &&
        !validationMethods({ method, field, currentAccount }) &&
        !field.deletedField
      ) {
        this._formCurrencyModel.setError(errorMessage);
        return false;
      }

      this._formCurrencyModel.deleteError(errorMessage);
    }

    return true;
  }

  handleFieldChange = (fieldId, value) => {
    const field = this._formModel.getField(fieldId);

    if (!field) {
      throw new Error(`Can't find nonexistent field: ${field}`);
    }

    if ([FieldTitle.name, FieldTitle.password].includes(field.title)) {
      value = formatInput(value);
    }

    field.value = value;
    field.isTouched = true;

    const isValid = this._validateField(field);
    field.isValid = isValid;

    this._formModel.updateField(UpdateType.PATCH, field);
  };

  handleTransactionFieldChange = (fieldId, value) => {
    const field = this._formTransactionModel.getField(fieldId);

    if (!field) {
      throw new Error(`Can't find nonexistent field: ${field}`);
    }

    if ([FieldTitle.paymentSum].includes(field.title)) {
      value = formatTransactionInput(value);
    }

    field.value = value;
    field.isTouched = true;

    const isValid = this._validateTransactionField(field);
    field.isValid = isValid;

    this._formTransactionModel.updateField(UpdateType.PATCH, field);
  };

  handleCurrencyFieldChange = (fieldId, value) => {
    const field = this._formCurrencyModel.getField(fieldId);

    if (!field) {
      throw new Error(`Can't find nonexistent field: ${field}`);
    }

    if ([FieldTitle.sum].includes(field.title)) {
      value = formatTransactionInput(value);
    }

    field.value = value;
    field.isTouched = true;

    const isValid = this._validateCurrencyField(field);
    field.isValid = isValid;

    this._formCurrencyModel.updateField(UpdateType.MINOR, field);
  };

  _handleViewAction(actionType, updateType, authData) {
    switch (actionType) {
      case UserAction.SEND_LOGIN:
        this._view.addAccountButtonComponent.setViewState(State.ADDING);

        this._api
          .login(authData)
          .then((response) => {
            const token = response?.payload?.token;

            if (!token) throw new Error(`Authentication error`);

            this._api.setItem({ key: "auth", subKey: "token", value: token });
            this._router.navigateTo(`accounts`);
          })
          .catch((e) => {
            console.error(e);
            Utils.toast(`${e.message}`);
          })
          .finally(() => {
            this._view.addAccountButtonComponent.setViewState(State.ABORTING);
          });
        break;

      case UserAction.ADD_NEW_ACCOUNT:
        this._fetchNewAccount();
        break;

      // case UserAction.NEW_TRANSACTION:
      //   this._fetchTransaction();
      //   break;
    }
  }

  handleAddAccountClick = () => {
    const newAccount = this._formModel.mapFieldsForServer();

    this._handleViewAction(UserAction.SEND_LOGIN, UpdateType.MINOR, newAccount);
  };

  handleNewAccountButtonClick = () => {
    this._handleViewAction(UserAction.ADD_NEW_ACCOUNT, UpdateType.MINOR);
  };

  handleTransactionClick = () => {
    const { account: from } = this.getCurrentAccount();
    const { paymentNumber: to, paymentSum: amount } =
      this.getMappedFormFieldsTransactionModel();

    this._fetchTransaction({ from, to, amount });
  };

  handleCurrencyClick = () => {
    const from = this.getCurrentFromCurrency();
    const to = this.getCurrentToCurrency();

    const { paymentSum: amount } = this.getMappedFormFieldsCurrencyModel();

    this._fetchNewCurrency({ from, to, amount });
  };

  handleCurrencyChange = (currencyType, value) => {
    if (currencyType === "from") {
      this._currencyModel.setCurrentFromCurrency(UpdateType.MINOR, value);
    }

    if (currencyType === "to") {
      this._currencyModel.setCurrentToCurrency(UpdateType.MINOR, value);
    }
  };

  // Api
  _fetchNewAccount() {
    const token = this._api.getToken();
    if (token === null) {
      this.resetRoute();
      return;
    }

    this._view.newAccountComponent.setViewState(State.ADDING);

    this._accountsModel.setIsAccountsLoading(UpdateType.MINOR, {
      isLoading: true,
    });

    this._api
      .addAccount(token)
      .then((response) => {
        this._accountsModel.setAccount(UpdateType.MINOR, response);
      })
      .catch((e) => {
        console.error(e.message);
        Utils.toast(e.message);

        const accounts = this._accountsModel.getAccounts();

        this._accountsModel.setAccounts(UpdateType.MINOR, accounts);
      })
      .finally(() => {
        this._view.newAccountComponent.setViewState(State.ABORTING);
      });
  }

  _fetchAccount(accountId) {
    const token = this._api.getToken();
    if (token === null) {
      this.resetRoute();
      return;
    }

    this._accountsModel.setIsAccountsLoading(UpdateType.MAJOR, {
      isLoading: true,
    });
    this._api
      .getAccount({ token, accountId })
      .then((account) => {
        this._accountsModel.setCurrentAccount(UpdateType.MAJOR, account);
      })
      .catch((e) => {
        console.error(e.message);
        Utils.toast(e.message);
        this._accountsModel.setCurrentAccount(UpdateType.MAJOR, {});
      });
  }

  _fetchAccounts() {
    const token = this._api.getToken();
    if (token === null) {
      this.resetRoute();
      return;
    }

    this._accountsModel.setIsAccountsLoading(UpdateType.MAJOR, {
      isLoading: true,
    });

    this._api
      .getAccounts(token)
      .then((response) => {
        this._accountsModel.setAccounts(UpdateType.MAJOR, response);
      })
      .catch((e) => {
        console.error(e.message);
        Utils.toast(e.message);
        this._accountsModel.setAccounts(UpdateType.MAJOR, []);
      });
  }

  _fetchCurrency() {
    const token = this._api.getToken();
    if (token === null) {
      this.resetRoute();
      return;
    }

    this._currencyModel.setIsCurrenciesLoading(UpdateType.MAJOR, {
      isLoading: true,
    });

    this._api
      .getCurrencies(token)
      .then((response) => {
        this._currencyModel.setCurrencies(UpdateType.MAJOR, response);
      })
      .catch((e) => {
        console.error(e.message);
        Utils.toast(e.message);
        this._currencyModel.setCurrencies(UpdateType.MAJOR, []);
      });

    this._wsTransfer = this._api.getWebSocketConnectionTransfer();
    this._wsTransfer.onmessage = (response) => {
      this._currencyModel.setRealtimeCurrencies(
        UpdateType.MINOR,
        JSON.parse(response.data)
      );
    };
  }

  _fetchTransaction(transactionData) {
    const token = this._api.getToken();
    if (token === null) {
      this.resetRoute();
      return;
    }

    this._view.addTransactionButtonComponent.setViewState(State.ADDING);

    this._accountsModel.setIsAccountsLoading(UpdateType.MAJOR, {
      isLoading: true,
    });

    this._api
      .newTransaction(transactionData, token)
      .then((response) => {
        this._router.navigateTo(`/accounts`);
      })
      .catch((e) => {
        console.error(e.message);
        Utils.toast(e.message);

        this._fetchCurrency();
      })
      .finally(() => {
        this._view.addTransactionButtonComponent.setViewState(State.ABORTING);
      });
  }

  _fetchNewCurrency(currencyData) {
    const token = this._api.getToken();
    if (token === null) {
      this.resetRoute();
      return;
    }

    this._view.currencyButton.setViewState(State.ADDING);

    this._accountsModel.setIsAccountsLoading(UpdateType.MAJOR, {
      isLoading: true,
    });

    this._api
      .newCurrency(currencyData, token)
      .then((response) => {
        //this._currencyModel.setRealtimeCurrencies(UpdateType.MAJOR, response.payload);
      })
      .catch((e) => {
        console.error(e.message);
        Utils.toast(e.message);
      })
      .finally(() => {
        this._view.currencyButton.setViewState(State.ABORTING);
        this._router.navigateTo(`/accounts`);
      });
  }

  _fetchBanks() {
    const token = this._api.getToken();
    if (token === null) {
      this.resetRoute();
      return;
    }

    this._banksModel.setIsBanksLoading(UpdateType.MAJOR, {
      isLoading: true,
    });

    this._api
      .getBanks(token)
      .then((response) => {
        this._banksModel.setBanks(UpdateType.MAJOR, response);
      })
      .catch((e) => {
        console.error(e.message);
        Utils.toast(e.message);
        this._banksModel.setBanks(UpdateType.MAJOR, []);
      });
  }

  // Routes
  accountsRoute() {
    this._fetchAccounts();
  }

  currencyRoute() {
    this._fetchCurrency();
  }

  banksRoute() {
    this._fetchBanks();
  }

  resetRoute() {
    this._api.resetStorage();
    this._router.navigateTo(`/`);
    this._view.updateMajor();
  }

  accountIdRoute(id) {
    this._fetchAccount(id);
  }

  accountIdHistory(id) {
    this._fetchAccount(id);
  }

  _sortAccounts(accounts, currentSortType) {
    switch (currentSortType) {
      case DropdownTitle.BY_NUMBER:
        return accounts.sort(Utils.sortAccountsByNumber);
      case DropdownTitle.BY_BALANCE:
        return accounts.sort(Utils.sortAccountsByBalance);
      case DropdownTitle.BY_TRANSACTION:
        return accounts.sort(Utils.sortAccountsByTransaction);
      default:
        return accounts;
    }
  }

  // Model
  getAccounts() {
    const accounts = this._accountsModel.getAccounts();

    const currentSortType = this.getCurrentSortType();

    return this._sortAccounts(accounts, currentSortType);
  }

  getAccountsCount() {
    return this._accountsModel.getAccountsCount();
  }

  getCurrentAccount() {
    return this._accountsModel.getCurrentAccount();
  }

  getCurrentSortType = () => {
    return this._accountsModel.getCurrentSortType();
  };

  getFormField(fieldId) {
    return this._formModel.getField(fieldId);
  }

  getTransactionFormField(fieldId) {
    return this._formTransactionModel.getField(fieldId);
  }

  getLoginFormFields() {
    return this._formModel.getFields();
  }

  getTransactionFormFields() {
    return this._formTransactionModel.getFields();
  }

  getCurrencyFormFields() {
    return this._formCurrencyModel.getFields();
  }

  getCurrencyFormField(fieldId) {
    return this._formCurrencyModel.getField(fieldId);
  }

  resetFormFields() {
    return this._formModel.resetFields();
  }

  resetTransactionFormFields() {
    return this._formTransactionModel.resetFields();
  }

  getErrorMessages() {
    return this._formModel.getErrorMessages();
  }

  resetTransactionErrorMessages() {
    return this._formTransactionModel.resetErrorMessages();
  }

  getTransactionErrorMessages() {
    return this._formTransactionModel.getErrorMessages();
  }

  getCurrencyErrorMessages() {
    return this._formCurrencyModel.getErrorMessages();
  }

  getCurrentRoute() {
    return this._router.getCurrentRoute();
  }

  getIsAuth() {
    return this._api.getIsAuth();
  }

  getBanks() {
    return this._banksModel.getBanks();
  }

  getBanksCount() {
    return this._banksModel.getBanksCount();
  }

  getShowAccountOrder() {
    return this._api.getShowAccountOrder();
  }

  getShowHistoryOrder() {
    return this._api.getShowCurrencyOrder();
  }

  getShowCurrencyOrder() {
    return this._api.getShowCurrencyOrder();
  }

  getMappedLastYearTransactions() {
    return this._api.getMappedLastYearTransactions();
  }

  getMappedFormFieldsTransactionModel() {
    return this._formTransactionModel.mapFieldsForServer();
  }

  getVerifiedAccounts() {
    return this._api.getVerifiedAccounts();
  }

  getAllCurrencies() {
    return this._currencyModel.getAllCurrencies();
  }

  getMyCurrencies() {
    return this._currencyModel.getMyCurrencies();
  }

  getRealtimeCurrencies() {
    return this._currencyModel.getRealtimeCurrencies();
  }

  getCurrentFromCurrency() {
    return this._currencyModel.getCurrentFromCurrency();
  }

  getCurrentToCurrency() {
    return this._currencyModel.getCurrentToCurrency();
  }

  resetCurrencyFields() {
    return this._formCurrencyModel.resetFields();
  }

  getMappedFormFieldsCurrencyModel() {
    return this._formCurrencyModel.mapFieldsForServer();
  }

  init() {
    this._router.init();
  }
}
