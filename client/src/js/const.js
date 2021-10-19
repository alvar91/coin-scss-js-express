import Utils from "./utils/common.js";

const STORE_PREFIX = `coin-localstorage`;
const STORE_VER = `v1`;
export const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

export const END_POINT = `http://localhost:5000`;
export const WS_END_POINT = `ws://localhost:5000`;

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  BEFOREBEGIN: `beforebegin`,
  AFTEREND: `afterend`,
};

export const UserAction = {
  SEND_LOGIN: `SEND_LOGIN`,
  ADD_NEW_ACCOUNT: `ADD_NEW_ACCOUNT`,
  NEW_TRANSACTION: `NEW_TRANSACTION`,
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MINOR_FORM: `MINOR_FORM`,
  MAJOR: `MAJOR`,
  INIT: `INIT`,
};

export const State = {
  ADDING: `ADDING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`,
};

export const FORM = {
  inputText: "inputText",
  inputPassword: "inputPassword",
  inputNumber: "inputNumber",
  inputTransactionDropdown: "inputTransactionDropdown",
};

export const MODE = {
  profile: "profile",
  addAccount: "addAccount",
  editAccount: "editAccount",
  deleteAccount: "deleteAccount",
};

export const ButtonTitle = {
  save: "Войти",
  delete: "Удалить клиента",
  cancel: "Отмена",
  send: "Отправить",
  exchange: "Обменять",
};

export const FieldTitle = {
  password: "Пароль",
  name: "Логин",
  paymentNumber: "Номер счета получателя",
  paymentSum: "Сумма перевода",
  sum: "Сумма",
};

export const DropdownTitle = {
  BY_NUMBER: "По номеру",
  BY_BALANCE: "По балансу",
  BY_TRANSACTION: "По последней транзакции",
};

export const FieldName = {
  password: "password",
  login: "login",
  paymentNumber: "paymentNumber",
  paymentSum: "paymentSum",
  notEqualFromAndTo: "notEqualFromAndTo",
};

export const ValidationType = {
  notEmpty: "notEmpty",
  isLengthMoreThan6: "isLengthMoreThan6",
  isEmail: "isEmail",
  isPhone: "isPhone",
  isLengthIs26: "isLengthIs26",
  notEqualFromAndTo: "notEqualFromAndTo",
  isValueMoreThanAccountHave: "isValueMoreThanAccountHave",
};

export const InitiateFields = () => {
  return [
    {
      id: `${Utils.createUUID()}`,
      type: FORM.inputText,
      title: FieldTitle.name,
      name: FieldName.login,
      value: "",
      required: true,
      validation: {
        [ValidationType.notEmpty]: Utils.getErrorNotFiled(FieldTitle.name),
        [ValidationType.isLengthMoreThan6]: Utils.getErrorNotLengthMoreThan6(
          FieldTitle.name
        ),
      },
      isValid: false,
      isTouched: false,
    },
    {
      id: `${Utils.createUUID()}`,
      type: FORM.inputPassword,
      title: FieldTitle.password,
      name: FieldName.password,
      value: "",
      required: true,
      validation: {
        [ValidationType.notEmpty]: Utils.getErrorNotFiled(FieldTitle.password),
        [ValidationType.isLengthMoreThan6]: Utils.getErrorNotLengthMoreThan6(
          FieldTitle.password
        ),
      },
      isValid: false,
      isTouched: false,
    },
  ];
};

export const InitiateTransactionFields = () => {
  return [
    {
      id: `${Utils.createUUID()}`,
      type: FORM.inputTransactionDropdown,
      title: FieldTitle.paymentNumber,
      name: FieldName.paymentNumber,
      value: "",
      required: true,
      validation: {
        [ValidationType.notEmpty]: Utils.getErrorNotFiled(
          FieldTitle.paymentNumber
        ),
        [ValidationType.notEqualFromAndTo]: Utils.notEqualFromAndTo(
          FieldTitle.paymentNumber
        ),
        [ValidationType.isLengthIs26]: Utils.getErrorNotLengthIs26(
          FieldTitle.paymentNumber
        ),
      },
      isValid: false,
      isTouched: false,
    },
    {
      id: `${Utils.createUUID()}`,
      type: FORM.inputNumber,
      title: FieldTitle.paymentSum,
      name: FieldName.paymentSum,
      value: "",
      required: true,
      validation: {
        [ValidationType.notEmpty]: Utils.getErrorNotFiled(
          FieldTitle.paymentSum
        ),
        [ValidationType.isValueMoreThanAccountHave]:
          Utils.getErrorNotValueMoreThanAccountHave(FieldTitle.paymentSum),
      },
      isValid: false,
      isTouched: false,
    },
  ];
};

export const InitiateCurrencyFields = () => {
  return [
    {
      id: `${Utils.createUUID()}`,
      type: FORM.inputNumber,
      title: FieldTitle.sum,
      name: FieldName.paymentSum,
      value: "",
      required: true,
      validation: {
        [ValidationType.notEmpty]: Utils.getErrorNotFiled(
          FieldTitle.paymentSum
        ),
        [ValidationType.isValueMoreThanAccountHave]:
          Utils.getErrorNotValueMoreThanAccountHave(FieldTitle.paymentSum),
      },
      isValid: false,
      isTouched: false,
    },
  ];
};

export const MIN_PASSWORD_LENGTH = 6;
export const MIN_ACCOUNT_NUMBER_LENGTH = 26;

export const InitialStoreStructure = {
  accounts: {},
  banks: [],
  auth: {},
  pageOrders: {
    showAccountPage: [{ 0: "a" }, { 1: "b" }, { 2: "c" }],
    showHistoryPage: [{ 0: "a" }, { 1: "b" }, { 2: "c" }],
    showCurrencyPage: [{ 0: "a" }, { 1: "b" }, { 2: "c" }],
  },
  mappedLastYearTransactionsByMonth: {
    loss: {},
    profit: {},
  },
  verifiedAccountsByTransactions: [],
};

export const StoreTitle = {
  expireDate: "expireDate",
};

export const EXPIRE_DAY_GAP = 1;

export const MonthLabels = {
  0: "янв",
  1: "фев",
  2: "мар",
  3: "апр",
  4: "май",
  5: "июн",
  6: "июл",
  7: "авг",
  8: "сен",
  9: "окт",
  10: "ноя",
  11: "дек",
};
