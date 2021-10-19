import AccountsPresenter from "../presenters/accounts-presenter.js";

import Render from "../utils/render.js";

import HeaderContainer from "./header-container.js";
import MainContainer from "./main-container.js";

import HeaderView from "./header-view.js";
import NoAccountsView from "./no-accounts-view.js";

//Login page
import LoginContainer from "./login-container.js";

import LoadingView from "./loading-view.js";

import ErrorsContainerView from "./errors-container.js";
import FormErrorsView from "./form-errors.js";
import FilledButtonView from "./button-filled.js";

import InputFieldView from "./input-view.js";

import InputNumberField from "./input-number-view.js";
import InputDropdown from "./input-dropdown-view.js";

//Accounts page
import AccountsHeadView from "./accounts-head-view.js";
import AccountsBodyView from "./accounts-body-view.js";
import DropdownView from "./dropdown-view.js";
import NewAccountButton from "./button-filled-new-account.js";
import AccountProfileView from "./account-profile-view.js";

//Account page
import AccountHeadView from "./account-head-view.js";
import AccountBodyView from "./account-body-view.js";

import AccountBodyA from "./account-body-a-view.js";
import AccountBodyB from "./account-body-b-view.js";
import AccountBodyC from "./account-body-c-view.js";
import TransactionButton from "./button-filled-transaction.js";

//History page
import HistoryHeadView from "./history-head-view.js";
import HistoryBodyView from "./history-body-view.js";

import HistoryBodyA from "./history-body-a-view.js";
import HistoryBodyB from "./history-body-b-view.js";
import HistoryBodyC from "./history-body-c-view.js";

//Currency page
import CurrencyHeadView from "./currency-head-view.js";
import CurrencyBodyView from "./currency-body-view.js";

import CurrencyBodyA from "./currency-body-a-view.js";
import CurrencyBodyB from "./currency-body-b-view.js";
import CurrencyBodyC from "./currency-body-c-view.js";
import InputBlockCurrency from "./input-currency-view.js";
import CurrencyButton from "./button-filled-currency.js";

import CurrencyList from "./currency-list-view.js";
import InputNumberCurrencyField from "./input-number-currency-view.js";

//Banks page
import MapView from "./map-view.js";

import { RenderPosition, FORM, ButtonTitle } from "../const.js";

export default class AppView {
  constructor() {
    this._accountsPresenter = new AccountsPresenter(this);

    this._rootContainer = document.getElementById("root");

    this._headerContainer = new HeaderContainer();
    this._mainContainer = new MainContainer();

    this._noAccountsComponent = new NoAccountsView();

    this._accountsComponents = new Map();
    this._formFieldComponents = new Map();

    this._formTransactionFieldComponents = new Map();
    this._formCurrencyFieldComponents = new Map();
  }

  _renderHeaderComponent() {
    const currentRoute = this._accountsPresenter.getCurrentRoute();

    const isAuth = this._accountsPresenter.getIsAuth();

    this._headerComponent = new HeaderView(currentRoute, isAuth);
    Render.render(this._headerContainer, this._headerComponent);

    this._headerComponent.setBurgerClickHandler();
  }

  _clearHeaderComponent() {
    Render.remove(this._headerComponent);
  }

  _createInput(field, isPassword) {
    const inputComponent = new InputFieldView(field, isPassword);

    inputComponent.setChangeHandler(this._accountsPresenter.handleFieldChange);

    this._formFieldComponents.set(field.id, inputComponent);

    return inputComponent;
  }

  _createTransactionDropdown(field) {
    const verifiedAccounts = this._accountsPresenter.getVerifiedAccounts();
    const inputComponent = new InputDropdown(field, verifiedAccounts);

    inputComponent.setChangeHandlerInput(
      this._accountsPresenter.handleTransactionFieldChange
    );

    inputComponent.setChangeHandlerDropdown(
      this._accountsPresenter.handleTransactionFieldChange
    );

    this._formTransactionFieldComponents.set(field.id, inputComponent);

    return inputComponent;
  }

  _createTransactionInputNumber(field) {
    const inputComponent = new InputNumberField(field);

    inputComponent.setChangeHandler(
      this._accountsPresenter.handleTransactionFieldChange
    );

    this._formTransactionFieldComponents.set(field.id, inputComponent);

    return inputComponent;
  }

  _creatCurrencyInputNumber(field) {
    const inputComponent = new InputNumberCurrencyField(field);

    inputComponent.setChangeHandler(
      this._accountsPresenter.handleCurrencyFieldChange
    );

    this._formCurrencyFieldComponents.set(field.id, inputComponent);

    return inputComponent;
  }

  _createFieldComponent(field) {
    switch (field.type) {
      case FORM.inputText:
        return this._createInput(field);
      case FORM.inputPassword:
        const isPassword = true;
        return this._createInput(field, isPassword);
      default:
        return null;
    }
  }

  _createTransactionFieldComponent(field) {
    switch (field.type) {
      case FORM.inputTransactionDropdown:
        return this._createTransactionDropdown(field);
      case FORM.inputNumber:
        return this._createTransactionInputNumber(field);
      default:
        return null;
    }
  }

  _createCurrencyFieldComponent(field) {
    switch (field.type) {
      case FORM.inputNumber:
        return this._creatCurrencyInputNumber(field);
      default:
        return null;
    }
  }

  _renderFormField(container, fieldComponent) {
    Render.render(container, fieldComponent);
  }

  _renderFormErrors() {
    const container = this._errorsContainer;

    const errors = this._accountsPresenter.getErrorMessages();
    this._formErrorsComponent = new FormErrorsView(errors);

    Render.render(container, this._formErrorsComponent);
  }

  _renderTransactionFormErrors() {
    const container = this._errorsContainer;

    const errors = this._accountsPresenter.getTransactionErrorMessages();
    this._formTransactionErrorsComponent = new FormErrorsView(errors);

    Render.render(container, this._formTransactionErrorsComponent);
  }

  _renderCurrencyFormErrors() {
    const container = this._errorsContainer;

    this._realtimeCurrencyComponents;

    const errors = this._accountsPresenter.getCurrencyErrorMessages();

    this._formCurrencyErrorsComponent = new FormErrorsView(errors);

    Render.render(container, this._formCurrencyErrorsComponent);
  }

  _renderLoginButton() {
    const container = this._errorsContainer.getErrorsContainer();

    const isFormValid = this._accountsPresenter
      .getLoginFormFields()
      .some((field) => field.required && !field.isValid);

    this.addAccountButtonComponent = new FilledButtonView(
      ButtonTitle.save,
      isFormValid
    );

    this.addAccountButtonComponent.setAccountClickHandler(
      this._accountsPresenter.handleAddAccountClick
    );

    Render.render(
      container,
      this.addAccountButtonComponent,
      RenderPosition.AFTEREND
    );
  }

  _renderTransactionButton() {
    const container = this._errorsContainer.getErrorsContainer();

    const isFormValid = this._accountsPresenter
      .getTransactionFormFields()
      .some((field) => field.required && !field.isValid);

    this.addTransactionButtonComponent = new TransactionButton(
      ButtonTitle.send,
      isFormValid
    );

    this.addTransactionButtonComponent.setClickHandler(
      this._accountsPresenter.handleTransactionClick
    );

    Render.render(
      container,
      this.addTransactionButtonComponent,
      RenderPosition.AFTEREND
    );
  }

  _renderCurrencyButton(blockContainer) {
    const isFormValid = this._accountsPresenter
      .getCurrencyFormFields()
      .some((field) => field.required && !field.isValid);

    this.currencyButton = new CurrencyButton(
      ButtonTitle.exchange,
      isFormValid
    );

    this.currencyButton.setClickHandler(
      this._accountsPresenter.handleCurrencyClick
    );

    Render.render(blockContainer, this.currencyButton);
  }

  _clearCurrencyButton() {
    if (this.currencyButton) {
      Render.remove(this.currencyButton);
    }
  }

  _createAccountComponent(account) {
    const accountComponent = new AccountProfileView(account);
    accountComponent.setProfileAccountClickHandler(
      this._accountsPresenter.handleProfileAccountClick
    );

    return accountComponent;
  }

  _renderAccountComponent(container, components, account) {
    const accountComponent = this._createAccountComponent(account);
    Render.render(container, accountComponent);
    components.set(account.account, accountComponent);
  }

  _renderNoAccounts() {
    Render.render(this._mainContainer, this._noAccountsComponent);
  }

  _renderAccounts() {
    if (!this.isLoading && this._accountsPresenter.getAccountsCount() === 0) {
      this._renderNoAccounts();
      return;
    }

    this._accountsHeadComponent = new AccountsHeadView();
    Render.render(this._mainSectionContainer, this._accountsHeadComponent);

    const accountsTopContainer =
      this._accountsHeadComponent.getAccountsTopContainer();

    const currentSortType = this._accountsPresenter.getCurrentSortType();

    const dropdownComponent = new DropdownView(currentSortType);
    Render.render(accountsTopContainer, dropdownComponent);

    dropdownComponent.setChangeHandlerDropdown(
      this._accountsPresenter.handleDropdownChange
    );

    this.newAccountComponent = new NewAccountButton();
    this.newAccountComponent.setAccountClickHandler(
      this._accountsPresenter.handleNewAccountButtonClick
    );

    Render.render(accountsTopContainer, this.newAccountComponent);

    this._accountsBodyContainer = new AccountsBodyView();

    Render.render(this._mainSectionContainer, this._accountsBodyContainer);

    const accounts = this._accountsPresenter.getAccounts();

    accounts.forEach((account) => {
      this._renderAccountComponent(
        this._accountsBodyContainer,
        this._accountsComponents,
        account
      );
    });
  }

  _clearAccounts() {
    if (this._accountsHeadComponent) {
      Render.remove(this._accountsHeadComponent);
    }

    this._accountsComponents.forEach((component) => Render.remove(component));
    this._accountsComponents.clear();

    if (this._accountsBodyContainer) {
      Render.remove(this._accountsBodyContainer);
    }
  }

  _clearAccount() {
    this._accountsPresenter.resetTransactionFormFields();
    this._accountsPresenter.resetTransactionErrorMessages();

    if (this._accountHeadComponent) {
      Render.remove(this._accountHeadComponent);
    }

    this._formTransactionFieldComponents.forEach((component) =>
      Render.remove(component)
    );
    this._formTransactionFieldComponents.clear();

    if (this._formErrorsComponent) {
      Render.remove(this._formErrorsComponent);
    }

    if (this._formTransactionErrorsComponent) {
      Render.remove(this._formTransactionErrorsComponent);
    }

    if (this._accountBodyContainer) {
      Render.remove(this._accountBodyContainer);
    }
  }

  _getContainer(container) {
    switch (container) {
      case "0":
        return this._accountBodyContainer.get0Container();
      case "1":
        return this._accountBodyContainer.get1Container();
      case "2":
        return this._accountBodyContainer.get2Container();
      default:
        return null;
    }
  }

  _getContainerHistory(container) {
    switch (container) {
      case "0":
        return this._historyBodyContainer.get0Container();
      case "1":
        return this._historyBodyContainer.get1Container();
      case "2":
        return this._historyBodyContainer.get2Container();
      default:
        return null;
    }
  }

  _getContainerCurrency(container) {
    switch (container) {
      case "0":
        return this._currencyBodyContainer.get0Container();
      case "1":
        return this._currencyBodyContainer.get1Container();
      case "2":
        return this._currencyBodyContainer.get2Container();
      default:
        return null;
    }
  }

  _getChild({ currentAccount, child }) {
    switch (child) {
      case "a":
        return (this.accountBodyA = new AccountBodyA(currentAccount));
      case "b":
        const mappedLastYearTransactions =
          this._accountsPresenter.getMappedLastYearTransactions(currentAccount);
        return (this.accountBodyB = new AccountBodyB(
          currentAccount,
          mappedLastYearTransactions
        ));
      case "c":
        return (this.accountBodyC = new AccountBodyC(currentAccount));
      default:
        return null;
    }
  }

  _renderItemOrder({ currentAccount, container, child }) {
    const containerComponent = this._getContainer(container);

    const childComponent = this._getChild({ currentAccount, child });

    if (!containerComponent || !childComponent) {
      return;
    }

    Render.render(containerComponent, childComponent);
  }

  _getChildHistory({ currentAccount, child }) {
    const mappedLastYearTransactions =
      this._accountsPresenter.getMappedLastYearTransactions(currentAccount);

    switch (child) {
      case "a":
        return (this.historyBodyA = new HistoryBodyA(
          currentAccount,
          mappedLastYearTransactions
        ));
      case "b":
        return (this.historyBodyB = new HistoryBodyB(
          currentAccount,
          mappedLastYearTransactions
        ));
      case "c":
        return (this.historyBodyC = new HistoryBodyC(currentAccount));
      default:
        return null;
    }
  }

  _getChildCurrency({ child }) {
    const myCurrencies = this._accountsPresenter.getMyCurrencies();

    switch (child) {
      case "a":
        return (this.currencyBodyA = new CurrencyBodyA(myCurrencies));
      case "b":
        return (this.currencyBodyB = new CurrencyBodyB());
      case "c":
        return (this.currencyBodyC = new CurrencyBodyC());
      default:
        return null;
    }
  }

  _renderItemOrderHistory({ currentAccount, container, child }) {
    const containerComponent = this._getContainerHistory(container);

    const childComponent = this._getChildHistory({ currentAccount, child });

    if (!containerComponent || !childComponent) {
      return;
    }

    Render.render(containerComponent, childComponent);
  }

  _renderItemOrderCurrency({ currentAccount, container, child }) {
    const containerComponent = this._getContainerCurrency(container);

    const childComponent = this._getChildCurrency({ currentAccount, child });

    if (!containerComponent || !childComponent) {
      return;
    }

    Render.render(containerComponent, childComponent);
  }

  _renderAccount(accountId) {
    if (!this.isLoading && !accountId) {
      this._renderNoAccounts();
      return;
    }

    const currentAccount = this._accountsPresenter.getCurrentAccount(accountId);

    this._accountHeadComponent = new AccountHeadView(currentAccount);
    Render.render(this._mainSectionContainer, this._accountHeadComponent);

    this._accountHeadComponent.setClickHandler(
      this._accountsPresenter.handleBackToAccountsButtonClick
    );

    this._accountBodyContainer = new AccountBodyView();

    Render.render(this._mainSectionContainer, this._accountBodyContainer);
    this._accountBodyContainer.init();

    this._accountBodyContainer.setChangeHandler(
      this._accountsPresenter.handleDnDChange
    );

    const showAccountOrder = this._accountsPresenter.getShowAccountOrder();
    showAccountOrder.forEach((item) => {
      const [entrie] = Object.entries(item);
      const container = entrie[0];
      const child = entrie[1];

      this._renderItemOrder({ currentAccount, container, child });
    });

    this._renderTransactionForm(this.accountBodyA);

    this.accountBodyB.setChart();
    this.accountBodyB.setClickHandler(
      this._accountsPresenter.handleToHistoryClick
    );

    this.accountBodyC.setClickHandler(
      this._accountsPresenter.handleToHistoryClick
    );
  }

  _renderHistory(accountId) {
    if (!this.isLoading && !accountId) {
      this._renderNoAccounts();
      return;
    }

    const currentAccount = this._accountsPresenter.getCurrentAccount(accountId);

    this._historyHeadComponent = new HistoryHeadView(currentAccount);
    Render.render(this._mainSectionContainer, this._historyHeadComponent);

    this._historyHeadComponent.setClickHandler(
      this._accountsPresenter.handleToAccountClick
    );

    this._historyBodyContainer = new HistoryBodyView();

    Render.render(this._mainSectionContainer, this._historyBodyContainer);
    this._historyBodyContainer.init();

    this._historyBodyContainer.setChangeHandler(
      this._accountsPresenter.handleDnDChangeHistory
    );

    const showHistoryOrder = this._accountsPresenter.getShowHistoryOrder();
    showHistoryOrder.forEach((item) => {
      const [entrie] = Object.entries(item);
      const container = entrie[0];
      const child = entrie[1];

      this._renderItemOrderHistory({ currentAccount, container, child });
    });

    this.historyBodyA.setChart();
    this.historyBodyB.setChart();
  }

  _clearRealtimeCurrency() {
    if (this._realtimeCurrenciesList) {
      Render.remove(this._realtimeCurrenciesList);
    }
  }

  _renderRealtimeCurrency() {
    const container = this.currencyBodyB.getContainer();
    const realtimeCurrencies = this._accountsPresenter.getRealtimeCurrencies();
    this._realtimeCurrenciesList = new CurrencyList(realtimeCurrencies);

    Render.render(container, this._realtimeCurrenciesList);
  }

  _renderCurrency() {
    const allCurrencies = this._accountsPresenter.getAllCurrencies();
    const myCurrencies = this._accountsPresenter.getMyCurrencies();

    if (
      !this.isLoading &&
      !allCurrencies.length &&
      !Object.values(myCurrencies).keys
    ) {
      this._renderNoAccounts();
      return;
    }

    this._currencyHeadComponent = new CurrencyHeadView();
    Render.render(this._mainSectionContainer, this._currencyHeadComponent);

    this._currencyBodyContainer = new CurrencyBodyView();

    Render.render(this._mainSectionContainer, this._currencyBodyContainer);
    this._currencyBodyContainer.init();

    this._currencyBodyContainer.setChangeHandler(
      this._accountsPresenter.handleDnDChangeCurrency
    );

    const showCurrencyOrder = this._accountsPresenter.getShowCurrencyOrder();
    showCurrencyOrder.forEach((item) => {
      const [entrie] = Object.entries(item);
      const container = entrie[0];
      const child = entrie[1];

      this._renderItemOrderCurrency({ container, child });
    });

    this._renderCurrencyForm();

    this._renderRealtimeCurrency();
  }

  _renderBanks() {
    if (!this.isLoading && this._accountsPresenter.getBanksCount() === 0) {
      this._renderNoAccounts();
      return;
    }

    this._mapComponent = new MapView();

    Render.render(this._mainSectionContainer, this._mapComponent);

    const banks = this._accountsPresenter.getBanks();
    this._mapComponent.init(banks);
  }

  _renderLoginForm() {
    const formFields = this._accountsPresenter.getLoginFormFields();
    const fieldComponents = formFields.map((field) =>
      this._createFieldComponent(field)
    );

    this._loginContainer = new LoginContainer();

    Render.render(this._mainSectionContainer, this._loginContainer);

    const container = this._loginContainer.getFormContainer();

    fieldComponents.forEach((fieldComponent) => {
      this._renderFormField(container, fieldComponent);
    });

    this._errorsContainer = new ErrorsContainerView();
    Render.render(container, this._errorsContainer);
    this._renderFormErrors();

    this._renderLoginButton();
  }

  _renderTransactionForm(transactionContainer) {
    const formTransactionFields =
      this._accountsPresenter.getTransactionFormFields();
    const fieldTransactionComponents = formTransactionFields.map((field) =>
      this._createTransactionFieldComponent(field)
    );

    const container = transactionContainer.getFormContainer();

    fieldTransactionComponents.forEach((fieldComponent) => {
      this._renderFormField(container, fieldComponent);
    });

    this._errorsContainer = new ErrorsContainerView();
    Render.render(container, this._errorsContainer);
    this._renderTransactionFormErrors();

    this._renderTransactionButton();
  }

  _clearCurrencyForm() {
    if (this._inputBlockCurrency) {
      Render.remove(this._inputBlockCurrency);
    }

    if (this._errorsContainer) {
      Render.remove(this._errorsContainer);
    }

    this._clearCurrencyButton();
  }

  _renderCurrencyForm() {
    const blockContainer = this.currencyBodyC.getCurrencyBlockContainer();
    const tableContainer = this.currencyBodyC.getCurrencyTableContainer();

    const allCurrencies = this._accountsPresenter.getAllCurrencies();
    const currentFromCurrency =
      this._accountsPresenter.getCurrentFromCurrency();

    const myCurrencies = this._accountsPresenter.getMyCurrencies();
    const currentToCurrency = this._accountsPresenter.getCurrentToCurrency();

    this._inputBlockCurrency = new InputBlockCurrency({
      myCurrencies,
      currentFromCurrency,
      allCurrencies,
      currentToCurrency,
    });
    Render.render(blockContainer, this._inputBlockCurrency);
    this._inputBlockCurrency.init();

    this._inputBlockCurrency.setChangeHandlerDropdown(
      this._accountsPresenter.handleCurrencyChange
    );

    const formCurrencyFields = this._accountsPresenter.getCurrencyFormFields();

    const fieldCurrencyComponents = formCurrencyFields.map((field) =>
      this._createCurrencyFieldComponent(field)
    );

    const inputContainer = this._inputBlockCurrency.getFormContainer();

    fieldCurrencyComponents.forEach((fieldComponent) => {
      this._renderFormField(inputContainer, fieldComponent);
    });

    this._errorsContainer = new ErrorsContainerView();
    Render.render(
      tableContainer,
      this._errorsContainer,
      RenderPosition.AFTEREND
    );

    this._renderCurrencyFormErrors();

    this._renderCurrencyButton(blockContainer);
  }

  clearMinor({
    realtimeCurrenciesChange,
    currentCurrencyTypeChange,
    resetInputValue,
  } = {}) {
    if (this._loadingComponent) {
      Render.remove(this._loadingComponent);
    }

    if (this._noAccountsComponent) {
      Render.remove(this._noAccountsComponent);
    }

    const currentRoute = this._accountsPresenter.getCurrentRoute();

    // Accounts page
    if (currentRoute === "accounts") {
      this._clearAccounts();
      return;
    }

    // Account page
    if (currentRoute === "account") {
      this._clearAccount();
      return;
    }

    // Currency page
    if (currentRoute === "currency") {
      if (realtimeCurrenciesChange) {
        this._clearRealtimeCurrency();
      }

      if (resetInputValue) {
        this._accountsPresenter.resetCurrencyFields();

        this._formCurrencyFieldComponents.forEach((component) =>
          Render.remove(component)
        );
        this._formCurrencyFieldComponents.clear();
      }

      if (currentCurrencyTypeChange) {
        this._clearCurrencyForm();
      }

      return;
    }
  }

  renderMinor({
    isLoading,
    realtimeCurrenciesChange,
    currentCurrencyTypeChange,
  } = {}) {
    if (isLoading !== undefined) {
      this.isLoading = isLoading;
    }

    if (this.isLoading) {
      this._renderLoading();
      return;
    }

    const currentRoute = this._accountsPresenter.getCurrentRoute();

    // Accounts page
    if (currentRoute === "accounts") {
      this._renderAccounts();
    }

    // Currency page
    if (currentRoute === "currency") {
      if (currentCurrencyTypeChange) {
        this._renderCurrencyForm();
      }

      if (realtimeCurrenciesChange) {
        this._renderRealtimeCurrency();
      }
    }
  }

  updateMinor(data) {
    const { field } = data;

    if (field) {
      if (this._formCurrencyFieldComponents.has(field.id)) {
        this._replaceCurrencyFieldComponent(
          this._formCurrencyFieldComponents,
          field.id
        );
      }
    }

    this.clearMinor(data);
    this.renderMinor(data);
  }

  clearMajor() {
    this._clearHeaderComponent();

    if (this._loadingComponent) {
      Render.remove(this._loadingComponent);
    }

    if (this._noAccountsComponent) {
      Render.remove(this._noAccountsComponent);
    }

    Render.remove(this._mainContainer);

    const currentRoute = this._accountsPresenter.getCurrentRoute();

    // Accounts page
    if (currentRoute === "accounts") {
      this._clearAccounts();
      return;
    }

    // Account page
    if (currentRoute === "account") {
      this._clearAccount();
      return;
    }

    this._mainSectionContainer = null;
    this._mapComponent = null;
  }

  _renderLoading() {
    this._loadingComponent = new LoadingView();

    Render.render(this._mainSectionContainer, this._loadingComponent);
  }

  _loader(isLoading) {
    if (isLoading) {
      this._renderLoading();
      return;
    }
  }

  renderMajor({ isLoading, accountId } = {}) {
    Render.render(this._rootContainer, this._headerContainer);

    this._renderHeaderComponent();

    Render.render(this._rootContainer, this._mainContainer);
    this._mainSectionContainer = this._mainContainer.getMainSectionContainer();

    const currentRoute = this._accountsPresenter.getCurrentRoute();

    // Accounts page
    if (currentRoute === "accounts") {
      document.title = "Coin. - Accounts";
      this._loader(isLoading);
      this._renderAccounts();
      return;
    }

    // Account page
    if (currentRoute === "account") {
      document.title = "Coin. - Account";
      this._loader(isLoading);
      this._renderAccount(accountId);
      return;
    }

    // Account page
    if (currentRoute === "history") {
      document.title = "Coin. - History";
      this._loader(isLoading);
      this._renderHistory(accountId);
      return;
    }

    // Currency page
    if (currentRoute === "currency") {
      document.title = "Coin. - Currency";
      this._loader(isLoading);
      this._renderCurrency();
      return;
    }

    // Banks page
    if (currentRoute === "banks") {
      document.title = "Coin. - Banks";
      this._loader(isLoading);
      this._renderBanks();
      return;
    }

    // Login page
    document.title = "Coin. - Login";

    this._renderLoginForm();
  }

  updateMajor(data) {
    this.clearMajor();
    this.renderMajor(data);
  }

  _replaceFieldComponent(fieldComponents, fieldId) {
    const oldFieldComponent = fieldComponents.get(fieldId);
    const newFieldComponent = this._createFieldComponent(
      this._accountsPresenter.getFormField(fieldId)
    );

    Render.replace(newFieldComponent, oldFieldComponent);
    Render.remove(oldFieldComponent);

    fieldComponents.delete(fieldId);
    fieldComponents.set(fieldId, newFieldComponent);
  }

  _replaceTransactionFieldComponent(fieldComponents, fieldId) {
    const oldFieldComponent = fieldComponents.get(fieldId);
    const newFieldComponent = this._createTransactionFieldComponent(
      this._accountsPresenter.getTransactionFormField(fieldId)
    );

    Render.replace(newFieldComponent, oldFieldComponent);
    Render.remove(oldFieldComponent);

    fieldComponents.delete(fieldId);
    fieldComponents.set(fieldId, newFieldComponent);
  }

  _replaceCurrencyFieldComponent(fieldComponents, fieldId) {
    const oldFieldComponent = fieldComponents.get(fieldId);
    const newFieldComponent = this._createCurrencyFieldComponent(
      this._accountsPresenter.getCurrencyFormField(fieldId)
    );

    Render.replace(newFieldComponent, oldFieldComponent);
    Render.remove(oldFieldComponent);

    fieldComponents.delete(fieldId);
    fieldComponents.set(fieldId, newFieldComponent);
  }

  clearPatch() {
    if (this._formErrorsComponent) {
      Render.remove(this._formErrorsComponent);
    }

    if (this._formTransactionErrorsComponent) {
      Render.remove(this._formTransactionErrorsComponent);
    }

    if (this.addAccountButtonComponent) {
      Render.remove(this.addAccountButtonComponent);
    }

    if (this.addTransactionButtonComponent) {
      Render.remove(this.addTransactionButtonComponent);
    }
  }

  renderPatch() {
    const currentRoute = this._accountsPresenter.getCurrentRoute();

    if (currentRoute === "account") {
      this._renderTransactionFormErrors();
      this._renderTransactionButton();
    }

    if (currentRoute === "") {
      this._renderFormErrors();
      this._renderLoginButton();
    }
  }

  updatePatch(data) {
    if (this._formFieldComponents.has(data.id)) {
      this._replaceFieldComponent(this._formFieldComponents, data.id);
    }

    if (this._formTransactionFieldComponents.has(data.id)) {
      this._replaceTransactionFieldComponent(
        this._formTransactionFieldComponents,
        data.id
      );
    }

    this.clearPatch();
    this.renderPatch(data);
  }

  init() {
    this.renderMajor();
    this._accountsPresenter.init();
  }
}
